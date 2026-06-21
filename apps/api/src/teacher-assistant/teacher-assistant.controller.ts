import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { BatchUploadDto, CreateAssistantAssessmentDto, OverrideResultsDto, ScriptSelectionDto, UpdateExtractedTextDto } from "./dto";
import { TeacherAssistantService } from "./teacher-assistant.service";

@Controller("teacher-assistant")
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permissions({ module: "teacher_portal", action: "teacher.assistant" })
export class TeacherAssistantController {
  constructor(private assistant: TeacherAssistantService) {}
  @Get() dashboard(@Req() req: any) { return this.assistant.dashboard(req.user.id); }
  @Post("assessments") create(@Req() req: any, @Body() dto: CreateAssistantAssessmentDto) { return this.assistant.create(req.user.id, dto); }
  @Get("assessments/:id") get(@Req() req: any, @Param("id") id: string) { return this.assistant.get(req.user.id, id); }
  @Get("assessments/:id/analytics") analytics(@Req() req: any, @Param("id") id: string) { return this.assistant.analytics(req.user.id, id); }
  @Post("assessments/:id/scripts") upload(@Req() req: any, @Param("id") id: string, @Body() dto: BatchUploadDto) { return this.assistant.uploadBatch(req.user.id, id, dto); }
  @Patch("scripts/:id/extracted-text") text(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateExtractedTextDto) { return this.assistant.updateExtractedText(req.user.id, id, dto); }
  @Patch("scripts/:id/results") override(@Req() req: any, @Param("id") id: string, @Body() dto: OverrideResultsDto) { return this.assistant.override(req.user.id, id, dto); }
  @Post("assessments/:id/approve") approve(@Req() req: any, @Param("id") id: string, @Body() dto: ScriptSelectionDto) { return this.assistant.approve(req.user.id, id, dto); }
  @Post("assessments/:id/publish") publish(@Req() req: any, @Param("id") id: string, @Body() dto: ScriptSelectionDto) { return this.assistant.publish(req.user.id, id, dto); }
}
