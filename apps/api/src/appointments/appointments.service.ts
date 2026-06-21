import { Injectable, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateAppointmentDto } from "./dto";
import { buildIcs } from "../calendar/ics";
import { CalendarService } from "../calendar/calendar.service";

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService, private calendar: CalendarService) {}

  async create(parentUserId: string, dto: CreateAppointmentDto) {
    const link = await this.prisma.guardianStudentLink.findFirst({ where: { guardianUserId: parentUserId, learnerId: dto.learnerId, status: "ACTIVE", verifiedAt: { not: null }, bookAppointments: true }, include: { learner: true } });
    if (!link) throw new ForbiddenException("You cannot book appointments for this student");
    if (!link.learner.classId) throw new BadRequestException("Student is not assigned to a class");
    const assignedTeacher = await this.prisma.teacherClassAssignment.findFirst({ where: { teacherId: dto.staffId, classId: link.learner.classId } });
    if (!assignedTeacher) throw new ForbiddenException("Teacher is not assigned to this student's class");
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
    const externalConflict = externalBusy.some(
      (slot) => slot.startsAt < endsAt && slot.endsAt > startsAt
    );

    if (conflict || externalConflict) throw new BadRequestException("Time slot unavailable");

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

  async ics(appointmentId: string, actorId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { staff: true, parent: true }
    });

    if (!appointment) throw new BadRequestException("Appointment not found");
    if (appointment.parentId !== actorId && appointment.staffId !== actorId) throw new ForbiddenException("Appointment does not belong to this account");

    return buildIcs({
      id: appointment.id,
      title: `POPIN-LMS Appointment with ${appointment.staff.name || appointment.staff.email}`,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      location: appointment.location || "School",
      description: "School appointment"
    });
  }
}
