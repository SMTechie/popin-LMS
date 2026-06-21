import { PrismaService } from "../common/prisma.service";
export declare class EmailOutboxService {
    private prisma;
    constructor(prisma: PrismaService);
    queueEmail(input: {
        to: string;
        subject: string;
        body: string;
    }): import("@prisma/client").Prisma.Prisma__EmailOutboxClient<{
        error: string | null;
        id: string;
        subject: string;
        status: string;
        createdAt: Date;
        to: string;
        body: string;
        sentAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
