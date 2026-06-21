import { RequisitionItemType, TicketStatus } from "@prisma/client";
export declare class PaginationQueryDto {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    department?: string;
    priority?: string;
}
export declare class CreateRequisitionItemDto {
    itemName: string;
    category?: string;
    quantity: number;
    estimatedUnitCost?: number;
    totalCost?: number;
    itemType: RequisitionItemType;
    inventoryItemId?: string;
}
export declare class CreateRequisitionDto {
    title: string;
    description?: string;
    department?: string;
    priority?: string;
    budgetCode?: string;
    requiredDate?: string;
    deliveryLocation?: string;
    vendorPreference?: string;
    procurementStatus?: string;
    approvalLevel?: number;
    estimatedTotalCost?: number;
    status?: TicketStatus;
    items: CreateRequisitionItemDto[];
}
export declare class ApproveRequisitionDto {
    approvalRole: string;
    comments?: string;
}
export declare class RejectRequisitionDto {
    approvalRole: string;
    comments?: string;
}
export declare class CreatePurchaseOrderDto {
    vendor?: string;
    expectedDeliveryDate?: string;
}
export declare class DeliverRequisitionItemDto {
    requisitionItemId: string;
    quantity?: number;
    unitCost?: number;
    inventoryItemId?: string;
}
export declare class DeliverRequisitionDto {
    locationId: string;
    items?: DeliverRequisitionItemDto[];
}
