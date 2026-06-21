import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { AllowAnon } from "../common/decorators/allow-anon.decorator";
import { VerifyEftDto } from "./dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("payments")
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @AllowAnon()
  @Post("payfast/webhook")
  payfast(@Body() body: Record<string, any>) {
    return this.payments.handleWebhook("payfast", body);
  }

  @AllowAnon()
  @Post("ozow/webhook")
  ozow(@Body() body: Record<string, any>) {
    return this.payments.handleWebhook("ozow", body);
  }

  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Post("eft/verify")
  @Permissions({ module: "payments", action: "edit" })
  verifyEft(@Body() dto: VerifyEftDto, @CurrentUser() user: { id: string }) {
    return this.payments.verifyEft(dto.orderId, dto.verified, user.id);
  }
}
