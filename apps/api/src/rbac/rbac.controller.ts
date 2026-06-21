import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { RbacService } from "./rbac.service";
import { AssignRoleDto, CreateRoleDto, UpdateRolePermissionsDto } from "./dto";

@Controller("rbac")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RbacController {
  constructor(private rbac: RbacService) {}

  @Get("roles")
  @Permissions({ module: "licensing", action: "view" })
  listRoles() {
    return this.rbac.listRoles();
  }

  @Post("roles")
  @Permissions({ module: "licensing", action: "create" })
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbac.createRole(dto.name, dto.description);
  }

  @Post("roles/permissions")
  @Permissions({ module: "licensing", action: "edit" })
  updatePermissions(@Body() dto: UpdateRolePermissionsDto) {
    return this.rbac.updateRolePermissions(dto);
  }

  @Post("roles/assign")
  @Permissions({ module: "licensing", action: "edit" })
  assignRole(@Body() dto: AssignRoleDto) {
    return this.rbac.assignRole(dto.userId, dto.roleId);
  }
}
