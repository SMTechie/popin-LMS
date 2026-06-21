import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";
export declare class EmailService {
    private prisma;
    private queues;
    constructor(prisma: PrismaService, queues: QueueService);
    listRoutingRules(): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        boardId: string;
        matchType: string;
        matchValue: string;
    }[]>;
    createRoutingRule(data: {
        name: string;
        boardId: string;
        matchType: string;
        matchValue: string;
    }): Promise<{
        id: string;
        name: string;
        status: string;
        createdAt: Date;
        boardId: string;
        matchType: string;
        matchValue: string;
    }>;
    enqueueIngestion(): Promise<void>;
}
