import { PrismaService } from "../common/prisma.service";
import { Prisma } from "@prisma/client";
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        key: string;
        value: Prisma.JsonValue;
    }[]>;
    get(key: string): Promise<{
        key: string;
        value: Prisma.JsonValue;
    } | null>;
    set(key: string, value: Record<string, unknown>, actorId?: string, ip?: string, requestId?: string): Promise<{
        key: string;
        value: Prisma.JsonValue;
    }>;
}
