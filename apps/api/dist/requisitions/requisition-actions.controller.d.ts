import { RequisitionsService } from "./requisitions.service";
import { CreatePurchaseOrderDto, DeliverRequisitionDto } from "./dto";
export declare class RequisitionActionsController {
    private readonly requisitions;
    constructor(requisitions: RequisitionsService);
    createPurchaseOrder(id: string, dto: CreatePurchaseOrderDto, req: any): Promise<{
        items: {
            id: string;
            name: string;
            quantity: number;
            unitCost: number | null;
            totalCost: number | null;
            requisitionItemId: string | null;
            purchaseOrderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        createdById: string | null;
        reference: string;
        vendor: string | null;
        orderDate: Date;
        expectedDeliveryDate: Date | null;
        ticketId: string;
    }>;
    deliver(id: string, dto: DeliverRequisitionDto, req: any): Promise<{
        id: string;
        status: "DELIVERED";
    }>;
}
