import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsService } from "./boards.service";
import { PrismaService } from "../common/prisma.service";
import { WorkflowModule } from "../workflow/workflow.module";
import { ApplicationsModule } from "../applications/applications.module";

@Module({
  imports: [WorkflowModule, ApplicationsModule],
  controllers: [BoardsController],
  providers: [BoardsService, PrismaService]
})
export class BoardsModule {}
