import { Controller, Post, Body, Get, Param, UseGuards, Res, Req } from "@nestjs/common";
import { Response } from "express";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";

@Controller("appointments")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AppointmentsController {
  constructor(private appointments: AppointmentsService) {}

  @Post()
  @Permissions({ module: "parent_portal", action: "create" })
  create(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    return this.appointments.create(req.user.id, dto);
  }

  @Get(":id/ics")
  @Permissions({ module: "parent_portal", action: "view" })
  async ics(@Param("id") id: string, @Req() req: any, @Res() res: Response) {
    const ics = await this.appointments.ics(id, req.user.id);
    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", `attachment; filename=appointment-${id}.ics`);
    res.send(ics);
  }
}
