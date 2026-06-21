import { PrismaService } from "../common/prisma.service";
export declare class CalendarService {
    private prisma;
    constructor(prisma: PrismaService);
    getExternalBusySlots(userId: string, start: Date, end: Date): Promise<{
        startsAt: Date;
        endsAt: Date;
    }[]>;
    syncAppointment(userId: string, appointment: {
        id: string;
        startsAt: Date;
        endsAt: Date;
        title: string;
    }): Promise<void>;
}
