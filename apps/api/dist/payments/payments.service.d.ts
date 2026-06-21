import { PrismaService } from "../common/prisma.service";
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    handleWebhook(provider: "payfast" | "ozow", payload: Record<string, any>): Promise<{
        status: string;
        webhookId?: undefined;
    } | {
        status: string;
        webhookId: string;
    }>;
    verifyEft(orderId: string, verified: boolean, actorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        parentId: string;
        totalAmount: number;
        paymentMethod: string;
        eftProofUrl: string | null;
        eftVerifiedById: string | null;
        eftVerifiedAt: Date | null;
    }>;
    private validatePayfast;
    private validateOzow;
}
