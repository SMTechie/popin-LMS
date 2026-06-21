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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const audit_service_1 = require("../audit/audit.service");
const guardianSelect = {
    id: true, relationshipType: true, status: true, isPrimary: true, viewFees: true, payFees: true,
    viewReports: true, viewHomework: true, receiveAnnouncements: true, messageTeachers: true,
    authorisePickup: true, submitApplications: true, bookAppointments: true, verifiedAt: true,
    viewHostel: true, applyHostel: true, viewHostelBilling: true, submitHostelConcerns: true, viewHostelMovement: true,
    guardian: { select: { id: true, email: true, name: true, status: true } }
};
let StudentsService = class StudentsService {
    prisma;
    tenants;
    audit;
    constructor(prisma, tenants, audit) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.audit = audit;
    }
    async list(search, status, gradeId, classId) {
        const tenant = await this.tenants.getDefaultTenant();
        const where = {
            tenantId: tenant.id,
            ...(status ? { status } : {}), ...(gradeId ? { gradeId } : {}), ...(classId ? { classId } : {}),
            ...(search ? { OR: [
                    { firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } },
                    { studentNumber: { contains: search, mode: "insensitive" } }, { identityNumber: { contains: search, mode: "insensitive" } }
                ] } : {})
        };
        const [items, grades, classes, subjects] = await Promise.all([
            this.prisma.learnerProfile.findMany({ where, include: { guardians: { select: guardianSelect }, classHistory: { orderBy: { changedAt: "desc" }, take: 10 } }, orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
            this.prisma.academicGrade.findMany({ where: { tenantId: tenant.id, isActive: true }, orderBy: { sortOrder: "asc" } }),
            this.prisma.schoolClass.findMany({ where: { tenantId: tenant.id, isActive: true }, include: { subjects: { include: { subject: true } } }, orderBy: { name: "asc" } }),
            this.prisma.academicSubject.findMany({ where: { tenantId: tenant.id, isActive: true }, orderBy: { name: "asc" } })
        ]);
        return { items, grades, classes, subjects };
    }
    async get(id) {
        const tenant = await this.tenants.getDefaultTenant();
        const learner = await this.prisma.learnerProfile.findFirst({ where: { id, tenantId: tenant.id }, include: { guardians: { select: guardianSelect }, classHistory: { orderBy: { changedAt: "desc" } } } });
        if (!learner)
            throw new common_1.NotFoundException("Student not found");
        const [attendance, homework, applications, queries] = await Promise.all([
            this.prisma.attendanceEntry.findMany({ where: { learnerId: id }, include: { register: true }, orderBy: { createdAt: "desc" }, take: 50 }),
            learner.classId ? this.prisma.teacherWorkItem.findMany({ where: { classId: learner.classId, type: { in: ["HOMEWORK", "ASSESSMENT"] } }, orderBy: { dueAt: "desc" }, take: 50 }) : [],
            learner.admissionApplicationId ? this.prisma.application.findMany({ where: { id: learner.admissionApplicationId } }) : [],
            this.prisma.parentTeacherQuery.findMany({ where: { learnerId: id }, orderBy: { createdAt: "desc" }, take: 50 })
        ]);
        return { ...learner, attendance, homework, applications, communicationHistory: queries };
    }
    async ensureNoDuplicate(dto, ignoreId) {
        const tenant = await this.tenants.getDefaultTenant();
        const or = [];
        if (dto.identityNumber)
            or.push({ identityNumber: dto.identityNumber });
        if (dto.dateOfBirth)
            or.push({ firstName: { equals: dto.firstName, mode: "insensitive" }, lastName: { equals: dto.lastName, mode: "insensitive" }, dateOfBirth: new Date(dto.dateOfBirth) });
        if (!or.length)
            return;
        const duplicate = await this.prisma.learnerProfile.findFirst({ where: { tenantId: tenant.id, ...(ignoreId ? { id: { not: ignoreId } } : {}), OR: or } });
        if (duplicate)
            throw new common_1.BadRequestException(`Possible duplicate student: ${duplicate.studentNumber}`);
    }
    async studentNumber(tenantCode) {
        const count = await this.prisma.learnerProfile.count();
        return `${tenantCode}-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;
    }
    async create(dto, actorId) {
        await this.ensureNoDuplicate(dto);
        const tenant = await this.tenants.getDefaultTenant();
        if (dto.classId) {
            const target = await this.prisma.schoolClass.findFirst({ where: { id: dto.classId, tenantId: tenant.id } });
            if (!target)
                throw new common_1.BadRequestException("Class does not belong to this school");
        }
        const learner = await this.prisma.learnerProfile.create({ data: {
                tenantId: tenant.id, firstName: dto.firstName.trim(), lastName: dto.lastName.trim(), preferredName: dto.preferredName || null,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null, identityNumber: dto.identityNumber || null,
                gender: dto.gender || null, email: dto.email?.toLowerCase() || null, phone: dto.phone || null,
                address: dto.address, medicalNotes: dto.medicalNotes || null,
                studentNumber: dto.studentNumber || await this.studentNumber(tenant.code), gradeId: dto.gradeId || null,
                classId: dto.classId || null, admissionApplicationId: dto.admissionApplicationId || null
            } });
        await this.audit.log({ actorId, action: "student.create", entity: "LearnerProfile", entityId: learner.id, data: { studentNumber: learner.studentNumber } });
        return learner;
    }
    async update(id, dto, actorId) {
        const current = await this.get(id);
        await this.ensureNoDuplicate(dto, id);
        const learner = await this.prisma.learnerProfile.update({ where: { id }, data: {
                firstName: dto.firstName, lastName: dto.lastName, preferredName: dto.preferredName || null,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null, identityNumber: dto.identityNumber || null,
                gender: dto.gender || null, email: dto.email?.toLowerCase() || null, phone: dto.phone || null,
                address: dto.address, medicalNotes: dto.medicalNotes || null,
                studentNumber: dto.studentNumber || current.studentNumber, gradeId: dto.gradeId || null, classId: dto.classId || null
            } });
        await this.audit.log({ actorId, action: "student.update", entity: "LearnerProfile", entityId: id });
        return learner;
    }
    async archive(id, actorId) {
        await this.get(id);
        const learner = await this.prisma.learnerProfile.update({ where: { id }, data: { status: "ARCHIVED", archivedAt: new Date() } });
        await this.audit.log({ actorId, action: "student.archive", entity: "LearnerProfile", entityId: id });
        return learner;
    }
    async move(id, dto, actorId) {
        const current = await this.get(id);
        const tenant = await this.tenants.getDefaultTenant();
        const updated = await this.prisma.$transaction(async (tx) => {
            const learner = await tx.learnerProfile.update({ where: { id }, data: { classId: dto.classId || null, gradeId: dto.gradeId || null } });
            await tx.studentClassHistory.create({ data: { tenantId: tenant.id, learnerId: id, fromClassId: current.classId, toClassId: dto.classId || null, fromGradeId: current.gradeId, toGradeId: dto.gradeId || null, reason: dto.reason, changedById: actorId } });
            return learner;
        });
        await this.audit.log({ actorId, action: dto.reason.toLowerCase().includes("promot") ? "student.promote" : "student.transfer", entity: "LearnerProfile", entityId: id, data: { fromClassId: current.classId, toClassId: dto.classId || null } });
        return updated;
    }
    async bulkImport(dto, actorId) {
        const results = [];
        for (let index = 0; index < dto.students.length; index++) {
            try {
                const item = await this.create(dto.students[index], actorId);
                results.push({ row: index + 1, status: "created", studentNumber: item.studentNumber });
            }
            catch (error) {
                results.push({ row: index + 1, status: "rejected", error: error instanceof Error ? error.message : "Import failed" });
            }
        }
        return { created: results.filter((r) => r.status === "created").length, rejected: results.filter((r) => r.status === "rejected").length, results };
    }
    async linkGuardian(learnerId, dto, actorId) {
        const learner = await this.get(learnerId);
        let guardian = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (guardian && !["PARENT", "EXTERNAL"].includes(guardian.userType))
            throw new common_1.BadRequestException("This email belongs to a staff account");
        if (!guardian) {
            const parentRole = await this.prisma.role.findUnique({ where: { name: "Parent" } });
            guardian = await this.prisma.user.create({ data: { email: dto.email.toLowerCase(), name: dto.name || null, userType: "PARENT", status: "ACTIVE", roles: parentRole ? { create: { roleId: parentRole.id } } : undefined } });
        }
        const link = await this.prisma.guardianStudentLink.upsert({
            where: { guardianUserId_learnerId_relationshipType: { guardianUserId: guardian.id, learnerId, relationshipType: dto.relationshipType } },
            update: { ...this.permissionData(dto), status: "ACTIVE", isPrimary: dto.isPrimary ?? false, verifiedById: actorId, verifiedAt: new Date() },
            create: { tenantId: learner.tenantId, guardianUserId: guardian.id, learnerId, relationshipType: dto.relationshipType, ...this.permissionData(dto), isPrimary: dto.isPrimary ?? false, createdById: actorId, verifiedById: actorId, verifiedAt: new Date() }
        });
        await this.audit.log({ actorId, action: "student.guardian.link", entity: "GuardianStudentLink", entityId: link.id, data: { learnerId, guardianUserId: guardian.id, relationshipType: dto.relationshipType, permissions: this.permissionData(dto) } });
        return link;
    }
    async updateGuardian(linkId, dto, actorId) {
        const existing = await this.prisma.guardianStudentLink.findUnique({ where: { id: linkId } });
        if (!existing)
            throw new common_1.NotFoundException("Guardian link not found");
        const link = await this.prisma.guardianStudentLink.update({ where: { id: linkId }, data: { ...this.permissionData(dto), ...(dto.isPrimary !== undefined ? { isPrimary: dto.isPrimary } : {}), ...(dto.status ? { status: dto.status } : {}) } });
        await this.audit.log({ actorId, action: "student.guardian.permissions", entity: "GuardianStudentLink", entityId: linkId, data: { before: existing, after: link } });
        return link;
    }
    async unlinkGuardian(linkId, actorId) {
        const existing = await this.prisma.guardianStudentLink.findUnique({ where: { id: linkId } });
        if (!existing)
            throw new common_1.NotFoundException("Guardian link not found");
        const link = await this.prisma.guardianStudentLink.update({ where: { id: linkId }, data: { status: "REVOKED" } });
        await this.audit.log({ actorId, action: "student.guardian.unlink", entity: "GuardianStudentLink", entityId: linkId, data: { learnerId: link.learnerId, guardianUserId: link.guardianUserId } });
        return link;
    }
    async createTeacher(dto, actorId) {
        if (await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } }))
            throw new common_1.BadRequestException("Email already exists");
        const role = await this.prisma.role.findUnique({ where: { name: "Teacher" } });
        if (!role)
            throw new common_1.BadRequestException("Teacher role is not configured");
        const passwordHash = dto.temporaryPassword ? await bcryptjs_1.default.hash(dto.temporaryPassword, 12) : null;
        const tenant = await this.tenants.getDefaultTenant();
        const teacher = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({ data: { email: dto.email.toLowerCase(), name: dto.name, userType: "TEACHER", status: "ACTIVE", passwordHash, roles: { create: { roleId: role.id } } } });
            if (dto.assignments?.length)
                await tx.teacherClassAssignment.createMany({ data: dto.assignments.map((a) => ({ tenantId: tenant.id, teacherId: user.id, classId: a.classId, subject: a.subject, isPrimary: a.isPrimary ?? false })) });
            return user;
        });
        await this.audit.log({ actorId, action: "teacher.admin.create", entity: "User", entityId: teacher.id, data: { email: teacher.email } });
        return teacher;
    }
    async createGrade(dto, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const grade = await this.prisma.academicGrade.create({ data: { tenantId: tenant.id, name: dto.name, code: dto.code.toUpperCase(), sortOrder: dto.sortOrder ?? 0 } });
        await this.audit.log({ actorId, action: "academic.grade.create", entity: "AcademicGrade", entityId: grade.id });
        return grade;
    }
    async createClass(dto, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const schoolClass = await this.prisma.schoolClass.create({ data: { tenantId: tenant.id, name: dto.name, code: dto.code.toUpperCase(), gradeId: dto.gradeId, academicYear: dto.academicYear ?? new Date().getFullYear(), room: dto.room || null } });
        await this.audit.log({ actorId, action: "academic.class.create", entity: "SchoolClass", entityId: schoolClass.id });
        return schoolClass;
    }
    async createSubject(dto, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const subject = await this.prisma.academicSubject.create({ data: { tenantId: tenant.id, name: dto.name, code: dto.code.toUpperCase() } });
        await this.audit.log({ actorId, action: "academic.subject.create", entity: "AcademicSubject", entityId: subject.id });
        return subject;
    }
    async assignSubject(classId, dto, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const link = await this.prisma.classSubject.upsert({ where: { classId_subjectId: { classId, subjectId: dto.subjectId } }, update: {}, create: { tenantId: tenant.id, classId, subjectId: dto.subjectId } });
        await this.audit.log({ actorId, action: "academic.class.subject.assign", entity: "ClassSubject", entityId: link.id, data: { classId, subjectId: dto.subjectId } });
        return link;
    }
    permissionData(dto) {
        const keys = ["viewFees", "payFees", "viewReports", "viewHomework", "receiveAnnouncements", "messageTeachers", "authorisePickup", "submitApplications", "bookAppointments", "viewHostel", "applyHostel", "viewHostelBilling", "submitHostelConcerns", "viewHostelMovement"];
        return Object.fromEntries(keys.filter((key) => dto[key] !== undefined).map((key) => [key, dto[key]]));
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, tenants_service_1.TenantsService, audit_service_1.AuditService])
], StudentsService);
//# sourceMappingURL=students.service.js.map