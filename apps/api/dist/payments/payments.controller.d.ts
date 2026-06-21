import { PaymentsService } from "./payments.service";
import { VerifyEftDto } from "./dto";
export declare class PaymentsController {
    private payments;
    constructor(payments: PaymentsService);
    payfast(body: Record<string, any>): Promise<{
        status: string;
        webhookId?: undefined;
    } | {
        status: string;
        webhookId: string;
    }>;
    ozow(body: Record<string, any>): Promise<{
        status: string;
        webhookId?: undefined;
    } | {
        status: string;
        webhookId: string;
    }>;
    verifyEft(dto: VerifyEftDto, user: {
        id: string;
    }): Promise<{
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
}
