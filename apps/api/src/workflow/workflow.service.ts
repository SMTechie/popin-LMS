import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";
import { CreateRuleDto } from "./dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService, private queues: QueueService) {}

  async listRules() {
    return this.prisma.automationRule.findMany({
      include: { versions: { orderBy: { version: "desc" }, take: 1 } }
    });
  }

  async createRule(dto: CreateRuleDto, actorId: string) {
    const rule = await this.prisma.automationRule.create({
      data: {
        name: dto.name,
        trigger: dto.trigger,
        boardId: dto.boardId || null
      }
    });

    const version = await this.prisma.automationRuleVersion.create({
      data: {
        ruleId: rule.id,
        version: 1,
        conditions: dto.conditions as Prisma.InputJsonValue,
        actions: dto.actions as Prisma.InputJsonValue,
        createdById: actorId
      }
    });

    return { ...rule, versions: [version] };
  }

  async enqueueEvent(event: { type: string; payload: Record<string, unknown> }) {
    await this.queues.automationQueue.add("evaluate", event, {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 }
    });
  }
}
