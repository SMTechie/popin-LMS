import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";

@Module({
  providers: [WebhookService, PrismaService, QueueService],
  exports: [WebhookService]
})
export class WebhooksModule {}
