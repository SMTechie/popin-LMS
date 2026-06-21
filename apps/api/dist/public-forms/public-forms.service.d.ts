import { JwtService } from "@nestjs/jwt";
import { TenantsService } from "../tenants/tenants.service";
import { ExternalIntegration } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
export declare class PublicFormsService {
    private jwt;
    private tenants;
    private prisma;
    constructor(jwt: JwtService, tenants: TenantsService, prisma: PrismaService);
    createApplicationLink(expiresInMinutes?: number, integration?: ExternalIntegration): Promise<{
        signed_url: string;
        expiry_time: Date;
    }>;
    verifyToken(token: string): any;
}
