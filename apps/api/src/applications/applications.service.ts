import { Injectable, BadRequestException } from "@nestjs/common";
import fs from "fs/promises";
import path from "path";
import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";
import { EmailOutboxService } from "../email/outbox.service";
import { AuditService } from "../audit/audit.service";
import { WorkflowService } from "../workflow/workflow.service";
import { PublicFormsService } from "../public-forms/public-forms.service";
import { TicketStatus, TicketType } from "@prisma/client";
import { StudentsService } from "../students/students.service";

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private tenants: TenantsService,
    private emailOutbox: EmailOutboxService,
    private audit: AuditService,
    private workflow: WorkflowService,
    private forms: PublicFormsService,
    private students: StudentsService
  ) {}

  async createPublicApplication(input: {
    parentName: string;
    parentEmail: string;
    parentPhone?: string;
    studentName: string;
    grade: string;
    token?: string;
  }) {
    const submission = await this.submitApplication({
      applicantName: input.studentName,
      guardianName: input.parentName,
      guardianEmail: input.parentEmail,
      guardianPhone: input.parentPhone,
      submissionChannel: "website",
      payload: {
        studentName: input.studentName,
        grade: input.grade
      },
      token: input.token
    });

    return { reference: submission.submissionReference };
  }

  async getPublicApplicationForm(token?: string) {
    let tenant = await this.tenants.getDefaultTenant();

    if (token) {
      try {
        const payload = this.forms.verifyToken(token);
        if (payload.formType !== "application") {
          throw new Error("Invalid form type");
        }
        if (payload.tenantId) {
          const tokenTenant = await this.prisma.tenant.findUnique({ where: { id: payload.tenantId } });
          if (tokenTenant) tenant = tokenTenant;
        }
      } catch (error) {
        throw new BadRequestException("Invalid or expired token");
      }
    }

    const form = await this.prisma.applicationForm.findFirst({
      where: { tenantId: tenant.id, slug: "admissions" },
      include: { versions: { where: { isPublished: true }, orderBy: { versionNumber: "desc" }, take: 1 } }
    });

    if (!form) {
      throw new BadRequestException("Application form not configured");
    }

    const now = new Date();
    let admissionsOpen = form.admissionsOpenState === "open";
    if (form.admissionsOpenState === "scheduled") {
      admissionsOpen = (!form.opensAt || form.opensAt <= now) && (!form.closesAt || form.closesAt > now);
    }

    return {
      admissionsOpen,
      admissionsOpenState: form.admissionsOpenState,
      opensAt: form.opensAt,
      closesAt: form.closesAt,
      closedMessage: form.closedMessage,
      openingMessage: form.openingMessage,
      form: form.versions[0] || null
    };
  }

  async submitApplication(input: {
    applicantName: string;
    guardianName: string;
    guardianEmail: string;
    guardianPhone?: string;
    submissionChannel?: string;
    payload?: Record<string, any>;
    files?: Array<{
      fieldKey: string;
      originalFilename: string;
      mimeType: string;
      contentBase64: string;
    }>;
    token?: string;
  }) {
    const { form, admissionsOpen, closedMessage } = await this.getPublicApplicationForm(input.token);

    if (!admissionsOpen) {
      throw new BadRequestException(closedMessage || "Admissions are currently closed.");
    }

    if (!form) {
      throw new BadRequestException("Application form not published.");
    }

    const payload = input.payload || {};
    const schema = (form.schemaJson || {}) as { steps?: Array<{ fields?: Array<{ required?: boolean; key: string }> }> };
    const requiredFields = (Array.isArray(schema.steps) ? schema.steps : []).flatMap((step: any) =>
      (step.fields || []).filter((field: any) => field.required).map((field: any) => field.key)
    );
    if (requiredFields?.length) {
      for (const key of requiredFields) {
        if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
          throw new BadRequestException(`Missing required field: ${key}`);
        }
      }
    }

    const tenant = await this.tenants.getDefaultTenant();
    const submission = await this.prisma.applicationSubmission.create({
      data: {
        tenantId: tenant.id,
        formId: form.formId,
        formVersionId: form.id,
        submissionReference: "PENDING",
        submissionChannel: input.submissionChannel || "website",
        applicantName: input.applicantName,
        guardianName: input.guardianName,
        guardianEmail: input.guardianEmail,
        guardianPhone: input.guardianPhone || null,
        payloadJson: payload,
        status: "submitted"
      }
    });

    if (input.files?.length) {
      const uploadBase = path.resolve(process.cwd(), "uploads", "applications", submission.id);
      await fs.mkdir(uploadBase, { recursive: true });
      for (const file of input.files) {
        const safeName = path.basename(file.originalFilename || "file");
        const buffer = Buffer.from(file.contentBase64, "base64");
        const maxSize = 5 * 1024 * 1024;
        if (buffer.length > maxSize) {
          throw new BadRequestException(`File too large for field ${file.fieldKey}`);
        }
        const storagePath = path.join(uploadBase, safeName);
        await fs.writeFile(storagePath, buffer);
        await this.prisma.applicationSubmissionFile.create({
          data: {
            tenantId: tenant.id,
            submissionId: submission.id,
            fieldKey: file.fieldKey,
            originalFilename: safeName,
            storagePath,
            mimeType: file.mimeType,
            fileSize: buffer.length
          }
        });
      }
    }

    const reference = `${tenant.code}-APP-${new Date().getFullYear()}-${String(submission.id).slice(0, 6)}`;

    await this.prisma.applicationSubmission.update({
      where: { id: submission.id },
      data: { submissionReference: reference }
    });

    await this.prisma.application.create({
      data: {
        tenantId: tenant.id,
        reference,
        parentName: input.guardianName,
        parentEmail: input.guardianEmail,
        parentPhone: input.guardianPhone || null,
        studentName: input.applicantName,
        grade: payload.grade || payload.student_grade || "Unknown",
        status: "Submitted",
        source: input.submissionChannel || "website"
      }
    });

    await this.prisma.crmLead.create({
      data: {
        tenantId: tenant.id,
        source: input.submissionChannel || "website",
        name: input.guardianName,
        email: input.guardianEmail,
        phone: input.guardianPhone || null
      }
    });

    await this.createAdmissionCard(reference, {
      studentName: input.applicantName,
      parentName: input.guardianName
    });

    await this.createTicketRecord(reference, {
      studentName: input.applicantName,
      parentName: input.guardianName,
      parentEmail: input.guardianEmail
    });

    await this.emailOutbox.queueEmail({
      to: input.guardianEmail,
      subject: `Application received: ${reference}`,
      body: `Thank you for your application. Reference: ${reference}`
    });

    const admissionsEmail = process.env.ADMISSIONS_EMAIL || "admissions@school.co.za";
    await this.emailOutbox.queueEmail({
      to: admissionsEmail,
      subject: `New application: ${reference}`,
      body: `New application submitted for ${input.applicantName}. Reference: ${reference}`
    });

    await this.audit.log({
      action: "ApplicationSubmitted",
      entity: "ApplicationSubmission",
      entityId: submission.id,
      data: { reference, guardianEmail: input.guardianEmail }
    });

    await this.workflow.enqueueEvent({
      type: "application.submitted",
      payload: { reference, submissionId: submission.id }
    });

    return { submissionReference: reference };
  }

  async approveApplication(applicationId: string, dto: { gradeId?: string; classId?: string; relationshipType?: string }, actorId: string) {
    const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) throw new BadRequestException("Application not found");
    const existing = await this.prisma.learnerProfile.findFirst({ where: { admissionApplicationId: application.id } });
    if (existing) throw new BadRequestException(`Application already created student ${existing.studentNumber}`);
    const submission = await this.prisma.applicationSubmission.findUnique({ where: { submissionReference: application.reference } });
    const payload = (submission?.payloadJson || {}) as Record<string, any>;
    const names = application.studentName.trim().split(/\s+/);
    const tenant = await this.tenants.getDefaultTenant();
    const matchedGrade = dto.gradeId ? null : await this.prisma.academicGrade.findFirst({ where: { tenantId: tenant.id, name: { equals: application.grade, mode: "insensitive" }, isActive: true } });
    const resolvedGradeId = dto.gradeId || matchedGrade?.id;
    const matchedClass = dto.classId ? null : resolvedGradeId ? await this.prisma.schoolClass.findFirst({ where: { tenantId: tenant.id, gradeId: resolvedGradeId, isActive: true }, orderBy: { name: "asc" } }) : null;
    const learner = await this.students.create({
      firstName: names.shift() || application.studentName,
      lastName: names.join(" ") || "Not supplied",
      dateOfBirth: payload.student_birthdate || payload.dateOfBirth,
      identityNumber: payload.id_number || payload.birth_certificate_number,
      gradeId: resolvedGradeId,
      classId: dto.classId || matchedClass?.id,
      admissionApplicationId: application.id
    }, actorId);
    await this.students.linkGuardian(learner.id, {
      email: application.parentEmail,
      name: application.parentName,
      relationshipType: dto.relationshipType || "Guardian",
      isPrimary: true,
      viewFees: true, payFees: true, viewReports: true, viewHomework: true,
      receiveAnnouncements: true, messageTeachers: true, submitApplications: true, bookAppointments: true
    }, actorId);
    await this.prisma.$transaction([
      this.prisma.application.update({ where: { id: application.id }, data: { status: "Accepted" } }),
      ...(submission ? [this.prisma.applicationSubmission.update({ where: { id: submission.id }, data: { status: "accepted" } })] : [])
    ]);
    await this.emailOutbox.queueEmail({ to: application.parentEmail, subject: `Admission approved: ${application.reference}`, body: `Your application has been approved. Student number: ${learner.studentNumber}. Sign in or create your parent account using this email address to access linked learner information.` });
    await this.audit.log({ actorId, action: "admission.approved.student-created", entity: "Application", entityId: application.id, data: { learnerId: learner.id, studentNumber: learner.studentNumber, guardianEmail: application.parentEmail } });
    await this.workflow.enqueueEvent({ type: "admission.approved", payload: { applicationId: application.id, learnerId: learner.id, guardianEmail: application.parentEmail } });
    return { application: { ...application, status: "Accepted" }, learner };
  }

  private async createAdmissionCard(reference: string, input: { studentName: string; parentName: string }) {
    const board = await this.prisma.board.findFirst({ where: { module: "admissions" }, include: { stages: true } });
    if (!board) return;
    const stage = board.stages.sort((a: { order: number }, b: { order: number }) => a.order - b.order)[0];
    if (!stage) return;

    await this.prisma.card.create({
      data: {
        boardId: board.id,
        stageId: stage.id,
        title: `Application ${reference}`,
        description: `Applicant: ${input.studentName}. Parent: ${input.parentName}`,
        createdById: (await this.systemUserId())
      }
    });
  }

  private async createTicket(reference: string, input: { studentName: string; parentName: string }) {
    const board = await this.prisma.board.findFirst({ where: { module: "ticket" }, include: { stages: true } });
    if (!board) return;
    const stage = board.stages.sort((a: { order: number }, b: { order: number }) => a.order - b.order)[0];
    if (!stage) return;

    await this.prisma.card.create({
      data: {
        boardId: board.id,
        stageId: stage.id,
        title: `Admissions ticket ${reference}`,
        description: `Application submitted for ${input.studentName} (${input.parentName})`,
        createdById: (await this.systemUserId())
      }
    });
  }

  private async createTicketRecord(
    reference: string,
    input: { studentName: string; parentName: string; parentEmail?: string }
  ) {
    const userId = await this.systemUserId();
    await this.prisma.ticket.create({
      data: {
        type: TicketType.ADMISSION_CASE,
        title: `Admissions application ${reference}`,
        description: `Applicant: ${input.studentName}. Guardian: ${input.parentName} (${input.parentEmail || ""})`,
        department: "Admissions",
        priority: "Medium",
        status: TicketStatus.SUBMITTED,
        createdById: userId
      }
    });
  }

  private async systemUserId() {
    const user = await this.prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
    if (!user) throw new BadRequestException("No users configured");
    return user.id;
  }
}
