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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const ics_1 = require("../calendar/ics");
const calendar_service_1 = require("../calendar/calendar.service");
let AppointmentsService = class AppointmentsService {
    prisma;
    calendar;
    constructor(prisma, calendar) {
        this.prisma = prisma;
        this.calendar = calendar;
    }
    async create(parentUserId, dto) {
        const link = await this.prisma.guardianStudentLink.findFirst({ where: { guardianUserId: parentUserId, learnerId: dto.learnerId, status: "ACTIVE", verifiedAt: { not: null }, bookAppointments: true }, include: { learner: true } });
        if (!link)
            throw new common_1.ForbiddenException("You cannot book appointments for this student");
        if (!link.learner.classId)
            throw new common_1.BadRequestException("Student is not assigned to a class");
        const assignedTeacher = await this.prisma.teacherClassAssignment.findFirst({ where: { teacherId: dto.staffId, classId: link.learner.classId } });
        if (!assignedTeacher)
            throw new common_1.ForbiddenException("Teacher is not assigned to this student's class");
        const startsAt = new Date(dto.startsAt);
        const endsAt = new Date(dto.endsAt);
        const conflict = await this.prisma.appointment.findFirst({
            where: {
                staffId: dto.staffId,
                OR: [
                    {
                        startsAt: { lte: startsAt },
                        endsAt: { gt: startsAt }
                    },
                    {
                        startsAt: { lt: endsAt },
                        endsAt: { gte: endsAt }
                    }
                ]
            }
        });
        const externalBusy = await this.calendar.getExternalBusySlots(dto.staffId, startsAt, endsAt);
        const externalConflict = externalBusy.some((slot) => slot.startsAt < endsAt && slot.endsAt > startsAt);
        if (conflict || externalConflict)
            throw new common_1.BadRequestException("Time slot unavailable");
        const appointment = await this.prisma.appointment.create({
            data: {
                staffId: dto.staffId,
                parentId: parentUserId,
                learnerId: dto.learnerId,
                startsAt,
                endsAt,
                location: dto.location || null,
                status: "CONFIRMED"
            }
        });
        await this.calendar.syncAppointment(dto.staffId, {
            id: appointment.id,
            startsAt: appointment.startsAt,
            endsAt: appointment.endsAt,
            title: `School appointment for ${link.learner.firstName} ${link.learner.lastName}`
        });
        return appointment;
    }
    async ics(appointmentId, actorId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { staff: true, parent: true }
        });
        if (!appointment)
            throw new common_1.BadRequestException("Appointment not found");
        if (appointment.parentId !== actorId && appointment.staffId !== actorId)
            throw new common_1.ForbiddenException("Appointment does not belong to this account");
        return (0, ics_1.buildIcs)({
            id: appointment.id,
            title: `POPIN-LMS Appointment with ${appointment.staff.name || appointment.staff.email}`,
            startsAt: appointment.startsAt,
            endsAt: appointment.endsAt,
            location: appointment.location || "School",
            description: "School appointment"
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, calendar_service_1.CalendarService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map