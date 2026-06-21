import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { CreateTeacherWorkItemDto, ReplyParentQueryDto, SubmitAttendanceDto, UpdateTeacherWorkItemDto } from "./dto";
import { TeacherService } from "./teacher.service";

@Controller("teacher")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TeacherController {
  constructor(private teacher: TeacherService) {}

  @Get("dashboard")
  @Permissions({ module: "teacher_portal", action: "teacher.view" })
  dashboard(@Req() req: any) { return this.teacher.dashboard(req.user.id); }

  @Get("classes")
  @Permissions({ module: "teacher_portal", action: "teacher.view" })
  classes(@Req() req: any) { return this.teacher.classes(req.user.id); }

  @Post("work-items")
  @Permissions({ module: "teacher_portal", action: "teacher.manage" })
  createWorkItem(@Req() req: any, @Body() dto: CreateTeacherWorkItemDto) { return this.teacher.createWorkItem(req.user.id, dto); }

  @Patch("work-items/:id")
  @Permissions({ module: "teacher_portal", action: "teacher.manage" })
  updateWorkItem(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateTeacherWorkItemDto) { return this.teacher.updateWorkItem(req.user.id, id, dto); }

  @Post("attendance")
  @Permissions({ module: "teacher_portal", action: "teacher.attendance" })
  attendance(@Req() req: any, @Body() dto: SubmitAttendanceDto) { return this.teacher.submitAttendance(req.user.id, dto); }

  @Get("parent-queries")
  @Permissions({ module: "teacher_portal", action: "teacher.communicate" })
  queries(@Req() req: any) { return this.teacher.parentQueries(req.user.id); }

  @Patch("parent-queries/:id")
  @Permissions({ module: "teacher_portal", action: "teacher.communicate" })
  reply(@Req() req: any, @Param("id") id: string, @Body() dto: ReplyParentQueryDto) { return this.teacher.replyToQuery(req.user.id, id, dto); }
}
