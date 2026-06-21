import { PrismaService } from "../common/prisma.service";
import { Prisma } from "@prisma/client";
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(input: {
        actorId?: string;
        action: string;
        entity: string;
        entityId?: string;
        data?: Record<string, unknown>;
        ip?: string;
        requestId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        actorId: string | null;
        action: string;
        data: Prisma.JsonValue | null;
        entityId: string | null;
        requestId: string | null;
        entity: string;
        ip: string | null;
    }>;
}
