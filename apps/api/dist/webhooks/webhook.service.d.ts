import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";
export declare class WebhookService {
    private prisma;
    private queues;
    constructor(prisma: PrismaService, queues: QueueService);
    emitStoreEvent(tenantId: string, integrationId: string, eventType: string, payload: object): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        lastError: string | null;
        eventType: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        targetUrl: string;
        deliveryId: string;
        attemptCount: number;
        lastStatusCode: number | null;
        lastAttemptAt: Date | null;
        integrationId: string;
    } | undefined>;
    emitShopCatalogUpdated(tenantId: string, integrationId: string, payload: object): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        lastError: string | null;
        eventType: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        targetUrl: string;
        deliveryId: string;
        attemptCount: number;
        lastStatusCode: number | null;
        lastAttemptAt: Date | null;
        integrationId: string;
    } | undefined>;
}
