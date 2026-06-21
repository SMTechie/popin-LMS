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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const hostel_service_1 = require("../hostel/hostel.service");
let ParentService = class ParentService {
    prisma;
    tenants;
    hostelService;
    constructor(prisma, tenants, hostelService) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.hostelService = hostelService;
    }
    async children(parentUserId) {
        const tenant = await this.tenants.getDefaultTenant();
        const links = await this.prisma.guardianStudentLink.findMany({
            where: { tenantId: tenant.id, guardianUserId: parentUserId, status: "ACTIVE", verifiedAt: { not: null } },
            include: { learner: true }, orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }]
        });
        return links.map(({ learner, ...permissions }) => ({ learner, permissions }));
    }
    async access(parentUserId, learnerId, permission) {
        const tenant = await this.tenants.getDefaultTenant();
        const link = await this.prisma.guardianStudentLink.findFirst({ where: { tenantId: tenant.id, guardianUserId: parentUserId, learnerId, status: "ACTIVE", verifiedAt: { not: null } } });
        if (!link)
            throw new common_1.ForbiddenException("You are not linked to this student");
        if (permission && !link[permission])
            throw new common_1.ForbiddenException(`Guardian permission '${permission}' is required`);
        return link;
    }
    async overview(parentUserId, learnerId) {
        const link = await this.access(parentUserId, learnerId);
        const learner = await this.prisma.learnerProfile.findUnique({ where: { id: learnerId } });
        if (!learner)
            throw new common_1.NotFoundException("Student not found");
        const [homework, announcements, attendance, assessments, appointments] = await Promise.all([
            link.viewHomework && learner.classId ? this.prisma.teacherWorkItem.findMany({ where: { classId: learner.classId, type: "HOMEWORK", visibleToParents: true }, orderBy: { dueAt: "asc" } }) : [],
            link.receiveAnnouncements && learner.classId ? this.prisma.teacherWorkItem.findMany({ where: { classId: learner.classId, type: "ANNOUNCEMENT", visibleToParents: true }, orderBy: { createdAt: "desc" } }) : [],
            this.prisma.attendanceEntry.findMany({ where: { learnerId }, include: { register: true }, orderBy: { createdAt: "desc" }, take: 30 }),
            link.viewReports ? this.prisma.teacherAssistantScript.findMany({ where: { learnerId, status: "PUBLISHED" }, include: { assessment: true, results: { orderBy: { questionNumber: "asc" } } }, orderBy: { publishedAt: "desc" } }) : [],
            link.bookAppointments ? this.prisma.appointment.findMany({ where: { parentId: parentUserId, learnerId }, orderBy: { startsAt: "desc" } }) : []
        ]);
        return { learner, permissions: link, homework, announcements, attendance, assessments, appointments };
    }
    async fees(parentUserId, learnerId) {
        await this.access(parentUserId, learnerId, "viewFees");
        return this.prisma.feeInvoice.findMany({ where: { learnerProfileId: learnerId }, include: { payments: true }, orderBy: { dueDate: "desc" } });
    }
    async applications(parentUserId, learnerId) {
        await this.access(parentUserId, learnerId, "submitApplications");
        const [learner, parent] = await Promise.all([this.prisma.learnerProfile.findUnique({ where: { id: learnerId } }), this.prisma.user.findUnique({ where: { id: parentUserId } })]);
        if (!learner || !parent)
            return [];
        return this.prisma.application.findMany({ where: { parentEmail: parent.email, OR: [{ id: learner.admissionApplicationId || "" }, { studentName: { equals: `${learner.firstName} ${learner.lastName}`, mode: "insensitive" } }] }, orderBy: { createdAt: "desc" } });
    }
    async orders(parentUserId) { return this.prisma.storeOrder.findMany({ where: { parentId: parentUserId }, include: { items: true }, orderBy: { createdAt: "desc" } }); }
    async tickets(parentUserId) { return this.prisma.ticket.findMany({ where: { createdById: parentUserId }, orderBy: { createdAt: "desc" } }); }
    async teachers(parentUserId, learnerId) {
        await this.access(parentUserId, learnerId, "messageTeachers");
        const learner = await this.prisma.learnerProfile.findUnique({ where: { id: learnerId } });
        if (!learner?.classId)
            return [];
        const assignments = await this.prisma.teacherClassAssignment.findMany({ where: { classId: learner.classId } });
        const users = await this.prisma.user.findMany({ where: { id: { in: assignments.map((a) => a.teacherId) } }, select: { id: true, name: true, email: true } });
        return assignments.map((assignment) => ({ ...assignment, teacher: users.find((user) => user.id === assignment.teacherId) }));
    }
    async hostel(parentUserId, learnerId) {
        const link = await this.access(parentUserId, learnerId, "viewHostel");
        return this.hostelService.parentView(parentUserId, learnerId, link);
    }
    async hostelApply(parentUserId, learnerId, body) {
        await this.access(parentUserId, learnerId, "applyHostel");
        return this.hostelService.parentApply(parentUserId, learnerId, body);
    }
    async hostelConcern(parentUserId, learnerId, body) {
        await this.access(parentUserId, learnerId, "submitHostelConcerns");
        return this.hostelService.createMaintenance(body, parentUserId, "PARENT", learnerId);
    }
};
exports.ParentService = ParentService;
exports.ParentService = ParentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, tenants_service_1.TenantsService, hostel_service_1.HostelService])
], ParentService);
//# sourceMappingURL=parent.service.js.map