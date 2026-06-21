import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getExternalBusySlots(userId: string, start: Date, end: Date) {
    const connections = await this.prisma.calendarConnection.findMany({ where: { userId, status: "ACTIVE" } });
    if (connections.length === 0) return [] as { startsAt: Date; endsAt: Date }[];

    // Placeholder: fetch busy slots from Google/Microsoft Graph.
    return [] as { startsAt: Date; endsAt: Date }[];
  }

  async syncAppointment(userId: string, appointment: { id: string; startsAt: Date; endsAt: Date; title: string }) {
    const connections = await this.prisma.calendarConnection.findMany({ where: { userId, status: "ACTIVE" } });
    if (connections.length === 0) return;

    // Placeholder: create calendar events.
  }
}
