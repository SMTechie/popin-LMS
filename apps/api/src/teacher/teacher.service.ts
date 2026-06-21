import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService, private tenants: TenantsService) {}

  private async context(teacherId: string) {
    const tenant = await this.tenants.getDefaultTenant();
    const assignments = await this.prisma.teacherClassAssignment.findMany({ where: { tenantId: tenant.id, teacherId } });
    return { tenant, assignments, classIds: [...new Set(assignments.map((item) => item.classId))] };
  }

  async dashboard(teacherId: string) {
    const { tenant, assignments, classIds } = await this.context(teacherId);
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    const [classes, grades, timetable, workItems, queries, learners, requisitions, assistantScripts] = await Promise.all([
      this.prisma.schoolClass.findMany({ where: { tenantId: tenant.id, id: { in: classIds }, isActive: true }, orderBy: { name: "asc" } }),
      this.prisma.academicGrade.findMany({ where: { tenantId: tenant.id } }),
      this.prisma.teacherTimetableEntry.findMany({ where: { tenantId: tenant.id, teacherId, dayOfWeek: now.getDay() }, orderBy: { startsAt: "asc" } }),
      this.prisma.teacherWorkItem.findMany({ where: { tenantId: tenant.id, teacherId }, orderBy: [{ dueAt: "asc" }, { updatedAt: "desc" }], take: 100 }),
      this.prisma.parentTeacherQuery.findMany({ where: { tenantId: tenant.id, teacherId, status: { in: ["OPEN", "ESCALATED"] } }, orderBy: { updatedAt: "desc" }, take: 20 }),
      this.prisma.learnerProfile.findMany({ where: { tenantId: tenant.id, classId: { in: classIds }, status: "ACTIVE" } }),
      this.prisma.ticket.findMany({ where: { createdById: teacherId, type: "REQUISITION" }, orderBy: { updatedAt: "desc" }, take: 10 }),
      this.prisma.teacherAssistantScript.findMany({ where: { assessment: { teacherId } }, select: { status: true } })
    ]);
    const gradeMap = new Map(grades.map((grade) => [grade.id, grade]));
    return {
      today: timetable.map((entry) => ({ ...entry, class: classes.find((item) => item.id === entry.classId) })),
      classes: classes.map((schoolClass) => ({
        ...schoolClass,
        grade: gradeMap.get(schoolClass.gradeId),
        subjects: assignments.filter((item) => item.classId === schoolClass.id).map((item) => item.subject),
        learnerCount: learners.filter((item) => item.classId === schoolClass.id).length
      })),
      homeworkDueToday: workItems.filter((item) => item.type === "HOMEWORK" && item.dueAt && item.dueAt <= end && item.dueAt >= now),
      lessonPlansIncomplete: workItems.filter((item) => item.type === "LESSON_PLAN" && item.status !== "PUBLISHED"),
      recentSubmissions: workItems.filter((item) => item.type === "SUBMISSION").slice(0, 8),
      announcements: workItems.filter((item) => item.type === "ANNOUNCEMENT").slice(0, 8),
      parentQueries: queries,
      requisitions,
      attendanceTasks: classes.filter((schoolClass) => !workItems.some((item) => item.type === "ATTENDANCE" && item.classId === schoolClass.id)),
      teacherAssistant: {
        scriptsWaiting: assistantScripts.filter((item) => ["QUEUED", "OCR", "MARKING"].includes(item.status)).length,
        readyForReview: assistantScripts.filter((item) => item.status === "READY_FOR_REVIEW").length,
        needsAttention: assistantScripts.filter((item) => item.status === "NEEDS_REVIEW").length
      }
    };
  }

  async classes(teacherId: string) {
    const { tenant, assignments, classIds } = await this.context(teacherId);
    const [classes, grades, learners, timetable, workItems] = await Promise.all([
      this.prisma.schoolClass.findMany({ where: { tenantId: tenant.id, id: { in: classIds } }, orderBy: { name: "asc" } }),
      this.prisma.academicGrade.findMany({ where: { tenantId: tenant.id } }),
      this.prisma.learnerProfile.findMany({ where: { tenantId: tenant.id, classId: { in: classIds } }, orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
      this.prisma.teacherTimetableEntry.findMany({ where: { tenantId: tenant.id, teacherId }, orderBy: [{ dayOfWeek: "asc" }, { startsAt: "asc" }] }),
      this.prisma.teacherWorkItem.findMany({ where: { tenantId: tenant.id, teacherId, classId: { in: classIds } }, orderBy: { updatedAt: "desc" } })
    ]);
    return classes.map((schoolClass) => ({
      ...schoolClass,
      grade: grades.find((grade) => grade.id === schoolClass.gradeId),
      assignments: assignments.filter((item) => item.classId === schoolClass.id),
      learners: learners.filter((item) => item.classId === schoolClass.id),
      timetable: timetable.filter((item) => item.classId === schoolClass.id),
      workItems: workItems.filter((item) => item.classId === schoolClass.id)
    }));
  }

  async createWorkItem(teacherId: string, input: any) {
    const { tenant, classIds } = await this.context(teacherId);
    if (input.classId && !classIds.includes(input.classId)) throw new ForbiddenException("This class is not assigned to you");
    return this.prisma.teacherWorkItem.create({
      data: {
        tenantId: tenant.id,
        teacherId,
        classId: input.classId || null,
        type: input.type,
        title: input.title,
        instructions: input.instructions || null,
        dueAt: input.dueAt ? new Date(input.dueAt) : null,
        status: input.status || "DRAFT",
        visibleToParents: input.visibleToParents ?? false,
        attachments: input.attachments || [],
        curriculumOutcomes: input.curriculumOutcomes || [],
        linkedWorkItemId: input.linkedWorkItemId || null
      }
    });
  }

  async updateWorkItem(teacherId: string, id: string, input: any) {
    const item = await this.prisma.teacherWorkItem.findFirst({ where: { id, teacherId } });
    if (!item) throw new NotFoundException("Work item not found");
    return this.prisma.teacherWorkItem.update({
      where: { id },
      data: {
        title: input.title,
        classId: input.classId || null,
        type: input.type,
        instructions: input.instructions || null,
        dueAt: input.dueAt ? new Date(input.dueAt) : null,
        status: input.status || item.status,
        visibleToParents: input.visibleToParents ?? item.visibleToParents,
        attachments: input.attachments || [],
        curriculumOutcomes: input.curriculumOutcomes || []
      }
    });
  }

  async submitAttendance(teacherId: string, input: any) {
    const { tenant, classIds } = await this.context(teacherId);
    if (!classIds.includes(input.classId)) throw new ForbiddenException("This class is not assigned to you");
    const registerDate = new Date(input.registerDate);
    registerDate.setHours(0, 0, 0, 0);
    return this.prisma.attendanceRegister.upsert({
      where: { classId_registerDate: { classId: input.classId, registerDate } },
      update: {
        status: input.submit ? "SUBMITTED" : "DRAFT",
        submittedAt: input.submit ? new Date() : null,
        entries: { deleteMany: {}, create: input.entries }
      },
      create: {
        tenantId: tenant.id,
        classId: input.classId,
        teacherId,
        registerDate,
        status: input.submit ? "SUBMITTED" : "DRAFT",
        submittedAt: input.submit ? new Date() : null,
        entries: { create: input.entries }
      },
      include: { entries: true }
    });
  }

  async parentQueries(teacherId: string) {
    const { tenant } = await this.context(teacherId);
    return this.prisma.parentTeacherQuery.findMany({ where: { tenantId: tenant.id, teacherId }, orderBy: { updatedAt: "desc" } });
  }

  async replyToQuery(teacherId: string, id: string, input: any) {
    const query = await this.prisma.parentTeacherQuery.findFirst({ where: { id, teacherId } });
    if (!query) throw new NotFoundException("Parent query not found");
    return this.prisma.parentTeacherQuery.update({
      where: { id },
      data: {
        response: input.response,
        status: input.escalate ? "ESCALATED" : input.resolve ? "RESOLVED" : "ANSWERED",
        escalatedAt: input.escalate ? new Date() : query.escalatedAt,
        resolvedAt: input.resolve ? new Date() : null
      }
    });
  }
}
