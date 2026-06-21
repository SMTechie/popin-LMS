import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";
import { HostelService } from "../hostel/hostel.service";

type GuardianPermission = "viewFees" | "payFees" | "viewReports" | "viewHomework" | "receiveAnnouncements" | "messageTeachers" | "authorisePickup" | "submitApplications" | "bookAppointments" | "viewHostel" | "applyHostel" | "viewHostelBilling" | "submitHostelConcerns" | "viewHostelMovement";

@Injectable()
export class ParentService {
  constructor(private prisma: PrismaService, private tenants: TenantsService, private hostelService: HostelService) {}

  async children(parentUserId: string) {
    const tenant = await this.tenants.getDefaultTenant();
    const links = await this.prisma.guardianStudentLink.findMany({
      where: { tenantId: tenant.id, guardianUserId: parentUserId, status: "ACTIVE", verifiedAt: { not: null } },
      include: { learner: true }, orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }]
    });
    return links.map(({ learner, ...permissions }) => ({ learner, permissions }));
  }

  private async access(parentUserId: string, learnerId: string, permission?: GuardianPermission) {
    const tenant = await this.tenants.getDefaultTenant();
    const link = await this.prisma.guardianStudentLink.findFirst({ where: { tenantId: tenant.id, guardianUserId: parentUserId, learnerId, status: "ACTIVE", verifiedAt: { not: null } } });
    if (!link) throw new ForbiddenException("You are not linked to this student");
    if (permission && !link[permission]) throw new ForbiddenException(`Guardian permission '${permission}' is required`);
    return link;
  }

  async overview(parentUserId: string, learnerId: string) {
    const link = await this.access(parentUserId, learnerId);
    const learner = await this.prisma.learnerProfile.findUnique({ where: { id: learnerId } });
    if (!learner) throw new NotFoundException("Student not found");
    const [homework, announcements, attendance, assessments, appointments] = await Promise.all([
      link.viewHomework && learner.classId ? this.prisma.teacherWorkItem.findMany({ where: { classId: learner.classId, type: "HOMEWORK", visibleToParents: true }, orderBy: { dueAt: "asc" } }) : [],
      link.receiveAnnouncements && learner.classId ? this.prisma.teacherWorkItem.findMany({ where: { classId: learner.classId, type: "ANNOUNCEMENT", visibleToParents: true }, orderBy: { createdAt: "desc" } }) : [],
      this.prisma.attendanceEntry.findMany({ where: { learnerId }, include: { register: true }, orderBy: { createdAt: "desc" }, take: 30 }),
      link.viewReports ? this.prisma.teacherAssistantScript.findMany({ where: { learnerId, status: "PUBLISHED" }, include: { assessment: true, results: { orderBy: { questionNumber: "asc" } } }, orderBy: { publishedAt: "desc" } }) : [],
      link.bookAppointments ? this.prisma.appointment.findMany({ where: { parentId: parentUserId, learnerId }, orderBy: { startsAt: "desc" } }) : []
    ]);
    return { learner, permissions: link, homework, announcements, attendance, assessments, appointments };
  }

  async fees(parentUserId: string, learnerId: string) {
    await this.access(parentUserId, learnerId, "viewFees");
    return this.prisma.feeInvoice.findMany({ where: { learnerProfileId: learnerId }, include: { payments: true }, orderBy: { dueDate: "desc" } });
  }

  async applications(parentUserId: string, learnerId: string) {
    await this.access(parentUserId, learnerId, "submitApplications");
    const [learner, parent] = await Promise.all([this.prisma.learnerProfile.findUnique({ where: { id: learnerId } }), this.prisma.user.findUnique({ where: { id: parentUserId } })]);
    if (!learner || !parent) return [];
    return this.prisma.application.findMany({ where: { parentEmail: parent.email, OR: [{ id: learner.admissionApplicationId || "" }, { studentName: { equals: `${learner.firstName} ${learner.lastName}`, mode: "insensitive" } }] }, orderBy: { createdAt: "desc" } });
  }

  async orders(parentUserId: string) { return this.prisma.storeOrder.findMany({ where: { parentId: parentUserId }, include: { items: true }, orderBy: { createdAt: "desc" } }); }
  async tickets(parentUserId: string) { return this.prisma.ticket.findMany({ where: { createdById: parentUserId }, orderBy: { createdAt: "desc" } }); }

  async teachers(parentUserId: string, learnerId: string) {
    await this.access(parentUserId, learnerId, "messageTeachers");
    const learner = await this.prisma.learnerProfile.findUnique({ where: { id: learnerId } });
    if (!learner?.classId) return [];
    const assignments = await this.prisma.teacherClassAssignment.findMany({ where: { classId: learner.classId } });
    const users = await this.prisma.user.findMany({ where: { id: { in: assignments.map((a) => a.teacherId) } }, select: { id: true, name: true, email: true } });
    return assignments.map((assignment) => ({ ...assignment, teacher: users.find((user) => user.id === assignment.teacherId) }));
  }

  async hostel(parentUserId: string, learnerId: string) {
    const link = await this.access(parentUserId, learnerId, "viewHostel");
    return this.hostelService.parentView(parentUserId, learnerId, link);
  }

  async hostelApply(parentUserId: string, learnerId: string, body: any) {
    await this.access(parentUserId, learnerId, "applyHostel");
    return this.hostelService.parentApply(parentUserId, learnerId, body);
  }

  async hostelConcern(parentUserId: string, learnerId: string, body: any) {
    await this.access(parentUserId, learnerId, "submitHostelConcerns");
    return this.hostelService.createMaintenance(body, parentUserId, "PARENT", learnerId);
  }
}
