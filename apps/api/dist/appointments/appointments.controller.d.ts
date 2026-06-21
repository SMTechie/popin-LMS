import { Response } from "express";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto";
export declare class AppointmentsController {
    private appointments;
    constructor(appointments: AppointmentsService);
    create(dto: CreateAppointmentDto, req: any): Promise<{
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
    ics(id: string, req: any, res: Response): Promise<void>;
}
