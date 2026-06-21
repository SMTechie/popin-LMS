import { Module } from "@nestjs/common";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";
import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";

@Module({
  controllers: [WorkflowController],
  providers: [WorkflowService, PrismaService, QueueService],
  exports: [WorkflowService]
})
export class WorkflowModule {}
