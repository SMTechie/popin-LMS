import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { WorkflowService } from "./workflow.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { CreateRuleDto } from "./dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("workflow")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class WorkflowController {
  constructor(private workflow: WorkflowService) {}

  @Get("rules")
  @Permissions({ module: "automation", action: "view" })
  listRules() {
    return this.workflow.listRules();
  }

  @Post("rules")
  @Permissions({ module: "automation", action: "create" })
  createRule(@Body() dto: CreateRuleDto, @CurrentUser() user: { id: string }) {
    return this.workflow.createRule(dto, user.id);
  }
}
