import { PrismaService } from "../common/prisma.service";
import { CreateAppointmentDto } from "./dto";
import { CalendarService } from "../calendar/calendar.service";
export declare class AppointmentsService {
    private prisma;
    private calendar;
    constructor(prisma: PrismaService, calendar: CalendarService);
    create(parentUserId: string, dto: CreateAppointmentDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.AppointmentStatus;
        createdAt: Date;
        learnerId: string | null;
        location: string | null;
        parentId: string;
        staffId: string;
        startsAt: Date;
        endsAt: Date;
    }>;
    ics(appointmentId: string, actorId: string): Promise<string>;
}
