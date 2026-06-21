import { PrismaService } from "../common/prisma.service";
export declare class AuditController {
    private prisma;
    constructor(prisma: PrismaService);
    list(page?: string, pageSize?: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            actorId: string | null;
            action: string;
            entity: string;
            entityId: string | null;
            ip: string | null;
            requestId: string | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
