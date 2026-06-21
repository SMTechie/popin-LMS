import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { EmailOutboxService } from "./outbox.service";
import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";

@Module({
  controllers: [EmailController],
  providers: [EmailService, EmailOutboxService, PrismaService, QueueService],
  exports: [EmailOutboxService]
})
export class EmailModule {}
