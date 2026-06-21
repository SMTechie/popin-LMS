import { Module } from "@nestjs/common";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { PrismaService } from "../common/prisma.service";
import { CalendarService } from "../calendar/calendar.service";

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService, CalendarService]
})
export class AppointmentsModule {}
