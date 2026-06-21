import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService, private queues: QueueService) {}

  async listRoutingRules() {
    return this.prisma.emailRoutingRule.findMany({ orderBy: { createdAt: "desc" } });
  }

  async createRoutingRule(data: {
    name: string;
    boardId: string;
    matchType: string;
    matchValue: string;
  }) {
    return this.prisma.emailRoutingRule.create({
      data: {
        name: data.name,
        boardId: data.boardId,
        matchType: data.matchType,
        matchValue: data.matchValue
      }
    });
  }

  @Cron("*/2 * * * *")
  async enqueueIngestion() {
    await this.queues.emailIngestionQueue.add(
      "poll",
      {},
      { attempts: 3, backoff: { type: "exponential", delay: 10000 } }
    );
  }
}
