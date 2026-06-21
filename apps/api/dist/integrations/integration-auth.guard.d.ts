import { CanActivate, ExecutionContext } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
export declare class ExternalIntegrationAuthGuard implements CanActivate {
    private prisma;
    private static rateWindowMs;
    private static rateLimit;
    private static requestMap;
    constructor(prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private enforceRateLimit;
}
