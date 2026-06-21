import { PrismaService } from "../common/prisma.service";
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDefaultTenant(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        code: string;
        portalUrl: string;
        websiteUrl: string | null;
    }>;
}
