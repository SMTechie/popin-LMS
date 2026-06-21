import { PrismaService } from "../common/prisma.service";
import { ApproveRequestDto, CreateAdjustmentDto, CreateCountSessionDto, CreateInventoryCategoryDto, CreateInventoryItemDto, CreateInventoryLocationDto, CreateInventoryUnitDto, CreateRequestDto, CreateTransferDto, FulfillRequestDto, IssueStockDto, LocationAccessDto, PaginationQueryDto, ReceiveStockDto, SubmitCountDto, UpdateAdjustmentStatusDto, UpdateCountStatusDto, UpdateInventoryItemDto, UpdateInventoryLocationDto, UpdateTransferStatusDto } from "./dto";
import { Prisma } from "@prisma/client";
export declare class InventoryService {
    private prisma;
    constructor(prisma: PrismaService);
    private logAudit;
    private ensureLocationAccess;
    private getOrCreateBalance;
    overview(): Promise<{
        totalSkus: number;
        totalOnHand: number;
        lowStockCount: number;
        outOfStockCount: number;
        expiringItems: number;
        pendingRequests: number;
        stockValue: number;
        recentMovements: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                description: string | null;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
                isActive: boolean;
                isTrackable: boolean;
                taxRate: number | null;
            };
            variant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                barcode: string | null;
                itemId: string;
                attributes: Prisma.JsonValue | null;
            } | null;
            locationFrom: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
                isActive: boolean;
                managerId: string | null;
            } | null;
            locationTo: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
                isActive: boolean;
                managerId: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.InventoryMovementType;
            reference: string | null;
            createdById: string | null;
            quantity: number;
            unitCost: number | null;
            itemId: string;
            variantId: string | null;
            binId: string | null;
            locationFromId: string | null;
            locationToId: string | null;
            batchId: string | null;
            serialId: string | null;
            reason: string | null;
        })[];
        locationSummary: {
            id: any;
            name: any;
            stockOnHand: any;
        }[];
    }>;
    listItems(query: PaginationQueryDto & {
        categoryId?: string;
        type?: string;
        active?: string;
    }): Promise<{
        items: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
            } | null;
            unit: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                abbreviation: string;
            } | null;
            variants: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                barcode: string | null;
                itemId: string;
                attributes: Prisma.JsonValue | null;
            }[];
            balances: {
                id: string;
                updatedAt: Date;
                itemId: string;
                variantId: string | null;
                locationId: string;
                binId: string | null;
                quantityOnHand: number;
                quantityReserved: number;
                averageCost: number | null;
            }[];
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            description: string | null;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
            isActive: boolean;
            isTrackable: boolean;
            taxRate: number | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    getItem(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
        } | null;
        unit: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            abbreviation: string;
        } | null;
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            itemId: string;
            attributes: Prisma.JsonValue | null;
        }[];
        balances: ({
            location: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
                isActive: boolean;
                managerId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            itemId: string;
            variantId: string | null;
            locationId: string;
            binId: string | null;
            quantityOnHand: number;
            quantityReserved: number;
            averageCost: number | null;
        })[];
        movements: ({
            variant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                barcode: string | null;
                itemId: string;
                attributes: Prisma.JsonValue | null;
            } | null;
            locationFrom: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
                isActive: boolean;
                managerId: string | null;
            } | null;
            locationTo: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
                isActive: boolean;
                managerId: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.InventoryMovementType;
            reference: string | null;
            createdById: string | null;
            quantity: number;
            unitCost: number | null;
            itemId: string;
            variantId: string | null;
            binId: string | null;
            locationFromId: string | null;
            locationToId: string | null;
            batchId: string | null;
            serialId: string | null;
            reason: string | null;
        })[];
        supplierLinks: ({
            supplier: {
                id: string;
                name: string;
                createdAt: Date;
                email: string | null;
                phone: string | null;
                bankDetails: Prisma.JsonValue | null;
                taxInfo: Prisma.JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            itemId: string;
            supplierId: string;
            supplierSku: string | null;
            price: number | null;
        })[];
        alerts: {
            id: string;
            status: import("@prisma/client").$Enums.InventoryAlertStatus;
            createdAt: Date;
            type: import("@prisma/client").$Enums.InventoryAlertType;
            itemId: string | null;
            variantId: string | null;
            locationId: string | null;
            message: string;
            resolvedAt: Date | null;
        }[];
        attachments: {
            id: string;
            createdAt: Date;
            itemId: string | null;
            entityType: string;
            entityId: string;
            filename: string;
            url: string;
            size: number | null;
            mimeType: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        description: string | null;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isActive: boolean;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    createItem(dto: CreateInventoryItemDto, actorId: string): Promise<{
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            itemId: string;
            attributes: Prisma.JsonValue | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        description: string | null;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isActive: boolean;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    updateItem(id: string, dto: UpdateInventoryItemDto, actorId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        description: string | null;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isActive: boolean;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    archiveItem(id: string, actorId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        description: string | null;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isActive: boolean;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    listCategories(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
    }[]>;
    createCategory(dto: CreateInventoryCategoryDto): Prisma.Prisma__InventoryCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listUnits(): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        abbreviation: string;
    }[]>;
    createUnit(dto: CreateInventoryUnitDto): Prisma.Prisma__InventoryUnitClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        abbreviation: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listLocations(): Prisma.PrismaPromise<({
        manager: {
            id: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            lastLoginAt: Date | null;
            userType: string;
            selfRegistered: boolean;
            emailVerifiedAt: Date | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
        isActive: boolean;
        managerId: string | null;
    })[]>;
    createLocation(dto: CreateInventoryLocationDto): Prisma.Prisma__InventoryLocationClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
        isActive: boolean;
        managerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateLocation(id: string, dto: UpdateInventoryLocationDto): Prisma.Prisma__InventoryLocationClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        description: string | null;
        isActive: boolean;
        managerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listBalances(locationId?: string): Prisma.PrismaPromise<({
        item: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            description: string | null;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
            isActive: boolean;
            isTrackable: boolean;
            taxRate: number | null;
        };
        variant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            itemId: string;
            attributes: Prisma.JsonValue | null;
        } | null;
        location: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        itemId: string;
        variantId: string | null;
        locationId: string;
        binId: string | null;
        quantityOnHand: number;
        quantityReserved: number;
        averageCost: number | null;
    })[]>;
    listMovements(query: PaginationQueryDto & {
        locationId?: string;
        itemId?: string;
        type?: string;
    }): Prisma.PrismaPromise<({
        item: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            description: string | null;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
            isActive: boolean;
            isTrackable: boolean;
            taxRate: number | null;
        };
        variant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            itemId: string;
            attributes: Prisma.JsonValue | null;
        } | null;
        locationFrom: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        } | null;
        locationTo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.InventoryMovementType;
        reference: string | null;
        createdById: string | null;
        quantity: number;
        unitCost: number | null;
        itemId: string;
        variantId: string | null;
        binId: string | null;
        locationFromId: string | null;
        locationToId: string | null;
        batchId: string | null;
        serialId: string | null;
        reason: string | null;
    })[]>;
    receiveStock(dto: ReceiveStockDto, actorId: string): Promise<{
        reference: string;
    }>;
    issueStock(dto: IssueStockDto, actorId: string): Promise<{
        reference: string;
    }>;
    createTransfer(dto: CreateTransferDto, actorId: string): Promise<{
        lines: {
            id: string;
            quantity: number;
            itemId: string;
            variantId: string | null;
            transferId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryTransferStatus;
        createdAt: Date;
        updatedAt: Date;
        approvedAt: Date | null;
        reference: string;
        receivedAt: Date | null;
        note: string | null;
        shippedAt: Date | null;
        fromLocationId: string;
        toLocationId: string;
        requestedById: string;
        approvedById: string | null;
    }>;
    updateTransferStatus(id: string, dto: UpdateTransferStatusDto, actorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryTransferStatus;
    }>;
    createRequest(dto: CreateRequestDto, actorId: string): Promise<{
        lines: {
            id: string;
            itemId: string;
            variantId: string | null;
            quantityRequested: number;
            quantityApproved: number | null;
            quantityFulfilled: number | null;
            notes: string | null;
            requestId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        department: string | null;
        reference: string;
        locationId: string | null;
        reason: string | null;
        requestedById: string;
        costCenter: string | null;
        neededBy: Date | null;
        linkedTicketId: string | null;
        linkedBoardCardId: string | null;
    }>;
    listRequests(query: PaginationQueryDto & {
        status?: string;
    }): Prisma.PrismaPromise<({
        requestedBy: {
            id: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            lastLoginAt: Date | null;
            userType: string;
            selfRegistered: boolean;
            emailVerifiedAt: Date | null;
        };
        lines: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                description: string | null;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
                isActive: boolean;
                isTrackable: boolean;
                taxRate: number | null;
            };
            variant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                barcode: string | null;
                itemId: string;
                attributes: Prisma.JsonValue | null;
            } | null;
        } & {
            id: string;
            itemId: string;
            variantId: string | null;
            quantityRequested: number;
            quantityApproved: number | null;
            quantityFulfilled: number | null;
            notes: string | null;
            requestId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        department: string | null;
        reference: string;
        locationId: string | null;
        reason: string | null;
        requestedById: string;
        costCenter: string | null;
        neededBy: Date | null;
        linkedTicketId: string | null;
        linkedBoardCardId: string | null;
    })[]>;
    approveRequest(id: string, dto: ApproveRequestDto, actorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryRequestStatus;
        createdAt: Date;
        updatedAt: Date;
        department: string | null;
        reference: string;
        locationId: string | null;
        reason: string | null;
        requestedById: string;
        costCenter: string | null;
        neededBy: Date | null;
        linkedTicketId: string | null;
        linkedBoardCardId: string | null;
    }>;
    fulfillRequest(id: string, dto: FulfillRequestDto, actorId: string): Promise<{
        id: string;
    }>;
    createAdjustment(dto: CreateAdjustmentDto, actorId: string): Promise<{
        lines: {
            id: string;
            unitCost: number | null;
            itemId: string;
            variantId: string | null;
            quantityDelta: number;
            note: string | null;
            adjustmentId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryAdjustmentStatus;
        createdAt: Date;
        updatedAt: Date;
        approvedAt: Date | null;
        reference: string;
        createdById: string;
        locationId: string;
        reason: string;
        note: string | null;
        approvedById: string | null;
    }>;
    updateAdjustmentStatus(id: string, dto: UpdateAdjustmentStatusDto, actorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryAdjustmentStatus;
    }>;
    createCountSession(dto: CreateCountSessionDto, actorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryCountStatus;
        createdAt: Date;
        updatedAt: Date;
        approvedAt: Date | null;
        type: string;
        reference: string;
        createdById: string;
        locationId: string;
        approvedById: string | null;
        blindCount: boolean;
        startedAt: Date | null;
        closedAt: Date | null;
    }>;
    submitCount(id: string, dto: SubmitCountDto, actorId: string): Promise<{
        id: string;
    }>;
    updateCountStatus(id: string, dto: UpdateCountStatusDto, actorId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryCountStatus;
    }>;
    listTransfers(query: PaginationQueryDto & {
        status?: string;
    }): Prisma.PrismaPromise<({
        fromLocation: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        };
        toLocation: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        };
        lines: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                description: string | null;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
                isActive: boolean;
                isTrackable: boolean;
                taxRate: number | null;
            };
            variant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                barcode: string | null;
                itemId: string;
                attributes: Prisma.JsonValue | null;
            } | null;
        } & {
            id: string;
            quantity: number;
            itemId: string;
            variantId: string | null;
            transferId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryTransferStatus;
        createdAt: Date;
        updatedAt: Date;
        approvedAt: Date | null;
        reference: string;
        receivedAt: Date | null;
        note: string | null;
        shippedAt: Date | null;
        fromLocationId: string;
        toLocationId: string;
        requestedById: string;
        approvedById: string | null;
    })[]>;
    listAdjustments(query: PaginationQueryDto & {
        status?: string;
    }): Prisma.PrismaPromise<({
        createdBy: {
            id: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            lastLoginAt: Date | null;
            userType: string;
            selfRegistered: boolean;
            emailVerifiedAt: Date | null;
        };
        location: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        };
        lines: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                description: string | null;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
                isActive: boolean;
                isTrackable: boolean;
                taxRate: number | null;
            };
            variant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                sku: string;
                barcode: string | null;
                itemId: string;
                attributes: Prisma.JsonValue | null;
            } | null;
        } & {
            id: string;
            unitCost: number | null;
            itemId: string;
            variantId: string | null;
            quantityDelta: number;
            note: string | null;
            adjustmentId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryAdjustmentStatus;
        createdAt: Date;
        updatedAt: Date;
        approvedAt: Date | null;
        reference: string;
        createdById: string;
        locationId: string;
        reason: string;
        note: string | null;
        approvedById: string | null;
    })[]>;
    listCounts(query: PaginationQueryDto & {
        status?: string;
    }): Prisma.PrismaPromise<({
        createdBy: {
            id: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            lastLoginAt: Date | null;
            userType: string;
            selfRegistered: boolean;
            emailVerifiedAt: Date | null;
        };
        location: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryCountStatus;
        createdAt: Date;
        updatedAt: Date;
        approvedAt: Date | null;
        type: string;
        reference: string;
        createdById: string;
        locationId: string;
        approvedById: string | null;
        blindCount: boolean;
        startedAt: Date | null;
        closedAt: Date | null;
    })[]>;
    reportLowStock(): Promise<any[]>;
    reportValuation(): Promise<{
        totalValue: number;
        balances: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                description: string | null;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
                isActive: boolean;
                isTrackable: boolean;
                taxRate: number | null;
            };
            location: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                code: string | null;
                description: string | null;
                isActive: boolean;
                managerId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            itemId: string;
            variantId: string | null;
            locationId: string;
            binId: string | null;
            quantityOnHand: number;
            quantityReserved: number;
            averageCost: number | null;
        })[];
    }>;
    listAlerts(): Prisma.PrismaPromise<({
        item: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            description: string | null;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
            isActive: boolean;
            isTrackable: boolean;
            taxRate: number | null;
        } | null;
        location: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            description: string | null;
            isActive: boolean;
            managerId: string | null;
        } | null;
    } & {
        id: string;
        status: import("@prisma/client").$Enums.InventoryAlertStatus;
        createdAt: Date;
        type: import("@prisma/client").$Enums.InventoryAlertType;
        itemId: string | null;
        variantId: string | null;
        locationId: string | null;
        message: string;
        resolvedAt: Date | null;
    })[]>;
    setLocationAccess(dto: LocationAccessDto): Promise<{
        id: string;
        createdAt: Date;
        locationId: string;
        userId: string;
        canIssue: boolean;
        canApprove: boolean;
    }>;
    evaluateAlerts(tx: Prisma.TransactionClient, itemId: string, variantId: string | null, locationId: string): Promise<void>;
}
