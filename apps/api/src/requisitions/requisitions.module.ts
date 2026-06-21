import { Module } from "@nestjs/common";
import { RequisitionsService } from "./requisitions.service";
import { RequisitionsController } from "./requisitions.controller";
import { RequisitionActionsController } from "./requisition-actions.controller";
import { PrismaService } from "../common/prisma.service";

@Module({
  controllers: [RequisitionsController, RequisitionActionsController],
  providers: [RequisitionsService, PrismaService]
})
export class RequisitionsModule {}
