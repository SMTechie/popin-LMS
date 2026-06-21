"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const outbox_service_1 = require("../email/outbox.service");
const audit_service_1 = require("../audit/audit.service");
const workflow_service_1 = require("../workflow/workflow.service");
const public_forms_service_1 = require("../public-forms/public-forms.service");
const client_1 = require("@prisma/client");
const students_service_1 = require("../students/students.service");
let ApplicationsService = class ApplicationsService {
    prisma;
    tenants;
    emailOutbox;
    audit;
    workflow;
    forms;
    students;
    constructor(prisma, tenants, emailOutbox, audit, workflow, forms, students) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.emailOutbox = emailOutbox;
        this.audit = audit;
        this.workflow = workflow;
        this.forms = forms;
        this.students = students;
    }
    async createPublicApplication(input) {
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
    async getPublicApplicationForm(token) {
        let tenant = await this.tenants.getDefaultTenant();
        if (token) {
            try {
                const payload = this.forms.verifyToken(token);
                if (payload.formType !== "application") {
                    throw new Error("Invalid form type");
                }
                if (payload.tenantId) {
                    const tokenTenant = await this.prisma.tenant.findUnique({ where: { id: payload.tenantId } });
                    if (tokenTenant)
                        tenant = tokenTenant;
                }
            }
            catch (error) {
                throw new common_1.BadRequestException("Invalid or expired token");
            }
        }
        const form = await this.prisma.applicationForm.findFirst({
            where: { tenantId: tenant.id, slug: "admissions" },
            include: { versions: { where: { isPublished: true }, orderBy: { versionNumber: "desc" }, take: 1 } }
        });
        if (!form) {
            throw new common_1.BadRequestException("Application form not configured");
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
    async submitApplication(input) {
        const { form, admissionsOpen, closedMessage } = await this.getPublicApplicationForm(input.token);
        if (!admissionsOpen) {
            throw new common_1.BadRequestException(closedMessage || "Admissions are currently closed.");
        }
        if (!form) {
            throw new common_1.BadRequestException("Application form not published.");
        }
        const payload = input.payload || {};
        const schema = (form.schemaJson || {});
        const requiredFields = (Array.isArray(schema.steps) ? schema.steps : []).flatMap((step) => (step.fields || []).filter((field) => field.required).map((field) => field.key));
        if (requiredFields?.length) {
            for (const key of requiredFields) {
                if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
                    throw new common_1.BadRequestException(`Missing required field: ${key}`);
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
            const uploadBase = path_1.default.resolve(process.cwd(), "uploads", "applications", submission.id);
            await promises_1.default.mkdir(uploadBase, { recursive: true });
            for (const file of input.files) {
                const safeName = path_1.default.basename(file.originalFilename || "file");
                const buffer = Buffer.from(file.contentBase64, "base64");
                const maxSize = 5 * 1024 * 1024;
                if (buffer.length > maxSize) {
                    throw new common_1.BadRequestException(`File too large for field ${file.fieldKey}`);
                }
                const storagePath = path_1.default.join(uploadBase, safeName);
                await promises_1.default.writeFile(storagePath, buffer);
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
    async approveApplication(applicationId, dto, actorId) {
        const application = await this.prisma.application.findUnique({ where: { id: applicationId } });
        if (!application)
            throw new common_1.BadRequestException("Application not found");
        const existing = await this.prisma.learnerProfile.findFirst({ where: { admissionApplicationId: application.id } });
        if (existing)
            throw new common_1.BadRequestException(`Application already created student ${existing.studentNumber}`);
        const submission = await this.prisma.applicationSubmission.findUnique({ where: { submissionReference: application.reference } });
        const payload = (submission?.payloadJson || {});
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
    async createAdmissionCard(reference, input) {
        const board = await this.prisma.board.findFirst({ where: { module: "admissions" }, include: { stages: true } });
        if (!board)
            return;
        const stage = board.stages.sort((a, b) => a.order - b.order)[0];
        if (!stage)
            return;
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
    async createTicket(reference, input) {
        const board = await this.prisma.board.findFirst({ where: { module: "ticket" }, include: { stages: true } });
        if (!board)
            return;
        const stage = board.stages.sort((a, b) => a.order - b.order)[0];
        if (!stage)
            return;
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
    async createTicketRecord(reference, input) {
        const userId = await this.systemUserId();
        await this.prisma.ticket.create({
            data: {
                type: client_1.TicketType.ADMISSION_CASE,
                title: `Admissions application ${reference}`,
                description: `Applicant: ${input.studentName}. Guardian: ${input.parentName} (${input.parentEmail || ""})`,
                department: "Admissions",
                priority: "Medium",
                status: client_1.TicketStatus.SUBMITTED,
                createdById: userId
            }
        });
    }
    async systemUserId() {
        const user = await this.prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
        if (!user)
            throw new common_1.BadRequestException("No users configured");
        return user.id;
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenants_service_1.TenantsService,
        outbox_service_1.EmailOutboxService,
        audit_service_1.AuditService,
        workflow_service_1.WorkflowService,
        public_forms_service_1.PublicFormsService,
        students_service_1.StudentsService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map