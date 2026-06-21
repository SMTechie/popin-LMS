import { Body, Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";

@Controller("settings")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SettingsController {
  constructor(private settings: SettingsService) {}

  @Get()
  @Permissions({ module: "branding", action: "view" })
  getAll() {
    return this.settings.getAll();
  }

  @Get(":key")
  @Permissions({ module: "branding", action: "view" })
  get(@Param("key") key: string) {
    return this.settings.get(key);
  }

  @Put(":key")
  @Permissions({ module: "branding", action: "edit" })
  set(@Param("key") key: string, @Body() value: Record<string, unknown>, @Req() req: any) {
    return this.settings.set(key, value, req.user?.id, req.ip, req.headers["x-request-id"]);
  }
}
