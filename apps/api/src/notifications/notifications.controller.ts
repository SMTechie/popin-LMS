import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("notifications")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Post("subscribe")
  @Permissions({ module: "automation", action: "view" })
  subscribe(
    @Body() body: { endpoint: string; keys: { p256dh: string; auth: string } },
    @CurrentUser() user: { id: string }
  ) {
    return this.notifications.subscribe(user.id, body);
  }

  @Post("send")
  @Permissions({ module: "automation", action: "create" })
  send(@Body() body: { userId: string; payload: Record<string, unknown> }) {
    return this.notifications.send(body.userId, body.payload);
  }
}
