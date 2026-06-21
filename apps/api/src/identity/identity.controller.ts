import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { ConfigureIdentityProviderDto, CreateRoleMappingDto } from "./dto";
import { IdentityService } from "./identity.service";

@Controller("identity")
@UseGuards(JwtAuthGuard, PermissionGuard)
@Permissions({ module: "integrations", action: "integrations.manage" })
export class IdentityController {
  constructor(private identity: IdentityService) {}
  @Get("providers") list() { return this.identity.list(); }
  @Put("providers/:provider") configure(@Param("provider") provider: string, @Body() dto: ConfigureIdentityProviderDto, @Req() req: any) { return this.identity.configure(provider, dto, req.user.id); }
  @Delete("providers/:provider") disconnect(@Param("provider") provider: string, @Req() req: any) { return this.identity.disconnect(provider, req.user.id); }
  @Post("providers/:provider/role-mappings") mapping(@Param("provider") provider: string, @Body() dto: CreateRoleMappingDto, @Req() req: any) { return this.identity.addMapping(provider, dto, req.user.id); }
  @Post("providers/:provider/sync") sync(@Param("provider") provider: string, @Req() req: any) { return this.identity.sync(provider, req.user.id); }
}
