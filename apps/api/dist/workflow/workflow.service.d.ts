import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";
import { CreateRuleDto } from "./dto";
import { Prisma } from "@prisma/client";
export declare class WorkflowService {
    private prisma;
    private queues;
    constructor(prisma: PrismaService, queues: QueueService);
    listRules(): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            createdById: string;
            version: number;
            ruleId: string;
            conditions: Prisma.JsonValue;
            actions: Prisma.JsonValue;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.AutomationStatus;
        boardId: string | null;
        trigger: string;
    })[]>;
    createRule(dto: CreateRuleDto, actorId: string): Promise<{
        versions: {
            id: string;
            createdAt: Date;
            createdById: string;
            version: number;
            ruleId: string;
            conditions: Prisma.JsonValue;
            actions: Prisma.JsonValue;
        }[];
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.AutomationStatus;
        boardId: string | null;
        trigger: string;
    }>;
    enqueueEvent(event: {
        type: string;
        payload: Record<string, unknown>;
    }): Promise<void>;
}
