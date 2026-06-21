import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { RequisitionsService } from "./requisitions.service";
import {
  ApproveRequisitionDto,
  CreateRequisitionDto,
  PaginationQueryDto,
  RejectRequisitionDto
} from "./dto";

@Controller("tickets")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RequisitionsController {
  constructor(private readonly requisitions: RequisitionsService) {}

  @Get("requisitions/overview")
  @Permissions({ module: "requisition", action: "view" })
  overview() {
    return this.requisitions.overview();
  }

  @Get("requisitions")
  @Permissions({ module: "requisition", action: "view" })
  list(@Query() query: PaginationQueryDto) {
    return this.requisitions.list(query);
  }

  @Get("requisitions/:id")
  @Permissions({ module: "requisition", action: "view" })
  get(@Param("id") id: string) {
    return this.requisitions.get(id);
  }

  @Post("requisitions")
  @Permissions({ module: "requisition", action: "create" })
  create(@Body() dto: CreateRequisitionDto, @Req() req: any) {
    return this.requisitions.create(dto, req.user.id);
  }

  @Post(":id/approve")
  @Permissions({ module: "requisition", action: "approve" })
  approve(@Param("id") id: string, @Body() dto: ApproveRequisitionDto, @Req() req: any) {
    return this.requisitions.approve(id, dto, req.user.id);
  }

  @Post(":id/reject")
  @Permissions({ module: "requisition", action: "approve" })
  reject(@Param("id") id: string, @Body() dto: RejectRequisitionDto, @Req() req: any) {
    return this.requisitions.reject(id, dto, req.user.id);
  }
}
