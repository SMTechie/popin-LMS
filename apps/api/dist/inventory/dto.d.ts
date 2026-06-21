import { InventoryAdjustmentStatus, InventoryCountStatus, InventoryItemType, InventoryIssueType, InventoryRequestStatus, InventoryTrackingType, InventoryTransferStatus } from "@prisma/client";
export declare class PaginationQueryDto {
    page?: number;
    pageSize?: number;
    search?: string;
}
export declare class CreateInventoryCategoryDto {
    name: string;
    code?: string;
    description?: string;
}
export declare class CreateInventoryUnitDto {
    name: string;
    abbreviation: string;
}
export declare class CreateInventoryLocationDto {
    name: string;
    code?: string;
    description?: string;
    managerId?: string;
}
export declare class UpdateInventoryLocationDto {
    name?: string;
    code?: string;
    description?: string;
    managerId?: string;
    isActive?: boolean;
}
export declare class CreateVariantDto {
    name: string;
    sku: string;
    barcode?: string;
    attributes?: Record<string, any>;
}
export declare class CreateInventoryItemDto {
    name: string;
    sku: string;
    description?: string;
    categoryId?: string;
    unitId?: string;
    type?: InventoryItemType;
    tracking?: InventoryTrackingType;
    barcode?: string;
    imageUrl?: string;
    reorderPoint?: number;
    minStock?: number;
    maxStock?: number;
    isTrackable?: boolean;
    taxRate?: number;
    variants?: CreateVariantDto[];
}
export declare class UpdateInventoryItemDto {
    name?: string;
    description?: string;
    categoryId?: string;
    unitId?: string;
    type?: InventoryItemType;
    tracking?: InventoryTrackingType;
    barcode?: string;
    imageUrl?: string;
    reorderPoint?: number;
    minStock?: number;
    maxStock?: number;
    isTrackable?: boolean;
    taxRate?: number;
    isActive?: boolean;
}
export declare class StockLineDto {
    itemId: string;
    variantId?: string;
    quantity: number;
    unitCost?: number;
    batchNumber?: string;
    expiryDate?: string;
    serialNumbers?: string[];
}
export declare class ReceiveStockDto {
    locationId: string;
    reference?: string;
    reason?: string;
    items: StockLineDto[];
}
export declare class IssueStockDto {
    locationId: string;
    issueType: InventoryIssueType;
    issuedTo?: string;
    reference?: string;
    reason?: string;
    items: StockLineDto[];
}
export declare class CreateTransferDto {
    fromLocationId: string;
    toLocationId: string;
    note?: string;
    items: StockLineDto[];
}
export declare class UpdateTransferStatusDto {
    status: InventoryTransferStatus;
    note?: string;
}
export declare class CreateRequestLineDto {
    itemId: string;
    variantId?: string;
    quantityRequested: number;
    notes?: string;
}
export declare class CreateRequestDto {
    locationId?: string;
    department?: string;
    costCenter?: string;
    neededBy?: string;
    reason?: string;
    linkedTicketId?: string;
    linkedBoardCardId?: string;
    lines: CreateRequestLineDto[];
}
export declare class ApproveRequestDto {
    status: InventoryRequestStatus;
    note?: string;
    lines?: CreateRequestLineDto[];
}
export declare class FulfillRequestDto {
    locationId: string;
    note?: string;
    issueType?: InventoryIssueType;
    issuedTo?: string;
    items: StockLineDto[];
}
export declare class CreateAdjustmentLineDto {
    itemId: string;
    variantId?: string;
    quantityDelta: number;
    unitCost?: number;
    note?: string;
}
export declare class CreateAdjustmentDto {
    locationId: string;
    reason: string;
    note?: string;
    lines: CreateAdjustmentLineDto[];
}
export declare class UpdateAdjustmentStatusDto {
    status: InventoryAdjustmentStatus;
    note?: string;
}
export declare class CreateCountSessionDto {
    locationId: string;
    type: string;
    blindCount?: boolean;
}
export declare class CountLineDto {
    itemId: string;
    variantId?: string;
    countedQty: number;
}
export declare class SubmitCountDto {
    lines: CountLineDto[];
}
export declare class UpdateCountStatusDto {
    status: InventoryCountStatus;
}
export declare class LocationAccessDto {
    userId: string;
    locationId: string;
    canIssue?: boolean;
    canApprove?: boolean;
}
