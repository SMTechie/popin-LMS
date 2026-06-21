import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { CreateUserDto, UpdateUserStatusDto } from "./dto";

@Controller("users")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  @Permissions({ module: "licensing", action: "view" })
  list(@Query("page") page = "1", @Query("pageSize") pageSize = "20") {
    return this.users.list(Number(page), Number(pageSize));
  }

  @Post()
  @Permissions({ module: "licensing", action: "create" })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(":id/status")
  @Permissions({ module: "licensing", action: "edit" })
  updateStatus(@Param("id") id: string, @Body() dto: UpdateUserStatusDto) {
    return this.users.setStatus(id, dto);
  }
}
