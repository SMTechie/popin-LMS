import { PrismaService } from "../common/prisma.service";
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    subscribe(userId: string, subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }): Promise<{
        id: string;
        keys: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        endpoint: string;
    }>;
    send(userId: string, payload: Record<string, unknown>): Promise<{
        sent: number;
    }>;
}
