import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { RequisitionsService } from "./requisitions.service";
import { CreatePurchaseOrderDto, DeliverRequisitionDto } from "./dto";

@Controller("requisitions")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RequisitionActionsController {
  constructor(private readonly requisitions: RequisitionsService) {}

  @Post(":id/purchase-order")
  @Permissions({ module: "requisition", action: "purchase" })
  createPurchaseOrder(
    @Param("id") id: string,
    @Body() dto: CreatePurchaseOrderDto,
    @Req() req: any
  ) {
    return this.requisitions.createPurchaseOrder(id, dto, req.user.id);
  }

  @Post(":id/deliver")
  @Permissions({ module: "requisition", action: "deliver" })
  deliver(@Param("id") id: string, @Body() dto: DeliverRequisitionDto, @Req() req: any) {
    return this.requisitions.deliver(id, dto, req.user.id);
  }
}
