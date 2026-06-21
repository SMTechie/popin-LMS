import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { EmailService } from "./email.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";

@Controller("email")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class EmailController {
  constructor(private email: EmailService) {}

  @Get("routing-rules")
  @Permissions({ module: "email", action: "view" })
  listRules() {
    return this.email.listRoutingRules();
  }

  @Post("routing-rules")
  @Permissions({ module: "email", action: "create" })
  createRule(@Body() body: { name: string; boardId: string; matchType: string; matchValue: string }) {
    return this.email.createRoutingRule(body);
  }
}
