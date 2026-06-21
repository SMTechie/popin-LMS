import { InventoryService } from "./inventory.service";
import { ApproveRequestDto, CreateAdjustmentDto, CreateCountSessionDto, CreateInventoryCategoryDto, CreateInventoryItemDto, CreateInventoryLocationDto, CreateInventoryUnitDto, CreateRequestDto, CreateTransferDto, FulfillRequestDto, IssueStockDto, LocationAccessDto, PaginationQueryDto, ReceiveStockDto, SubmitCountDto, UpdateAdjustmentStatusDto, UpdateCountStatusDto, UpdateInventoryItemDto, UpdateInventoryLocationDto, UpdateTransferStatusDto } from "./dto";
export declare class InventoryController {
    private readonly inventory;
    constructor(inventory: InventoryService);
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
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
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
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
            locationFrom: {
                id: string;
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                managerId: string | null;
            } | null;
            locationTo: {
                id: string;
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                managerId: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            reason: string | null;
            createdById: string | null;
            type: import("@prisma/client").$Enums.InventoryMovementType;
            reference: string | null;
            quantity: number;
            itemId: string;
            variantId: string | null;
            binId: string | null;
            locationFromId: string | null;
            locationToId: string | null;
            batchId: string | null;
            serialId: string | null;
            unitCost: number | null;
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
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                updatedAt: Date;
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
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
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
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
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
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            updatedAt: Date;
        } | null;
        attachments: {
            id: string;
            createdAt: Date;
            entityId: string;
            mimeType: string | null;
            itemId: string | null;
            entityType: string;
            filename: string;
            url: string;
            size: number | null;
        }[];
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
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        balances: ({
            location: {
                id: string;
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
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
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
            locationFrom: {
                id: string;
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                managerId: string | null;
            } | null;
            locationTo: {
                id: string;
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                managerId: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            reason: string | null;
            createdById: string | null;
            type: import("@prisma/client").$Enums.InventoryMovementType;
            reference: string | null;
            quantity: number;
            itemId: string;
            variantId: string | null;
            binId: string | null;
            locationFromId: string | null;
            locationToId: string | null;
            batchId: string | null;
            serialId: string | null;
            unitCost: number | null;
        })[];
        supplierLinks: ({
            supplier: {
                id: string;
                name: string;
                createdAt: Date;
                email: string | null;
                phone: string | null;
                bankDetails: import("@prisma/client/runtime/library").JsonValue | null;
                taxInfo: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            id: string;
            createdAt: Date;
            price: number | null;
            itemId: string;
            supplierId: string;
            supplierSku: string | null;
        })[];
        alerts: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.InventoryAlertStatus;
            resolvedAt: Date | null;
            message: string;
            type: import("@prisma/client").$Enums.InventoryAlertType;
            itemId: string | null;
            variantId: string | null;
            locationId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    createItem(dto: CreateInventoryItemDto, req: any): Promise<{
        variants: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            itemId: string;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    updateItem(id: string, dto: UpdateInventoryItemDto, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    archiveItem(id: string, req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        type: import("@prisma/client").$Enums.InventoryItemType;
        sku: string;
        categoryId: string | null;
        unitId: string | null;
        tracking: import("@prisma/client").$Enums.InventoryTrackingType;
        barcode: string | null;
        imageUrl: string | null;
        reorderPoint: number;
        minStock: number;
        maxStock: number | null;
        isTrackable: boolean;
        taxRate: number | null;
    }>;
    listCategories(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        code: string | null;
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
    }[]>;
    createCategory(dto: CreateInventoryCategoryDto): import("@prisma/client").Prisma.Prisma__InventoryCategoryClient<{
        id: string;
        code: string | null;
        name: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listUnits(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        abbreviation: string;
    }[]>;
    createUnit(dto: CreateInventoryUnitDto): import("@prisma/client").Prisma.Prisma__InventoryUnitClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        abbreviation: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    listLocations(): import("@prisma/client").Prisma.PrismaPromise<({
        manager: {
            id: string;
            name: string | null;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
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
        code: string | null;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        managerId: string | null;
    })[]>;
    createLocation(dto: CreateInventoryLocationDto): import("@prisma/client").Prisma.Prisma__InventoryLocationClient<{
        id: string;
        code: string | null;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        managerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateLocation(id: string, dto: UpdateInventoryLocationDto): import("@prisma/client").Prisma.Prisma__InventoryLocationClient<{
        id: string;
        code: string | null;
        name: string;
        createdAt: Date;
        description: string | null;
        isActive: boolean;
        updatedAt: Date;
        managerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    setLocationAccess(dto: LocationAccessDto): Promise<{
        id: string;
        createdAt: Date;
        locationId: string;
        userId: string;
        canIssue: boolean;
        canApprove: boolean;
    }>;
    listBalances(locationId?: string): import("@prisma/client").Prisma.PrismaPromise<({
        item: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
            isTrackable: boolean;
            taxRate: number | null;
        };
        location: {
            id: string;
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        };
        variant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            barcode: string | null;
            itemId: string;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
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
    }): import("@prisma/client").Prisma.PrismaPromise<({
        item: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
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
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        locationFrom: {
            id: string;
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        } | null;
        locationTo: {
            id: string;
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        reason: string | null;
        createdById: string | null;
        type: import("@prisma/client").$Enums.InventoryMovementType;
        reference: string | null;
        quantity: number;
        itemId: string;
        variantId: string | null;
        binId: string | null;
        locationFromId: string | null;
        locationToId: string | null;
        batchId: string | null;
        serialId: string | null;
        unitCost: number | null;
    })[]>;
    receiveStock(dto: ReceiveStockDto, req: any): Promise<{
        reference: string;
    }>;
    issueStock(dto: IssueStockDto, req: any): Promise<{
        reference: string;
    }>;
    createTransfer(dto: CreateTransferDto, req: any): Promise<{
        lines: {
            id: string;
            quantity: number;
            itemId: string;
            variantId: string | null;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryTransferStatus;
        updatedAt: Date;
        note: string | null;
        approvedAt: Date | null;
        reference: string;
        receivedAt: Date | null;
        shippedAt: Date | null;
        fromLocationId: string;
        toLocationId: string;
        requestedById: string;
        approvedById: string | null;
    }>;
    updateTransferStatus(id: string, dto: UpdateTransferStatusDto, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryTransferStatus;
    }>;
    listRequests(query: PaginationQueryDto & {
        status?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        requestedBy: {
            id: string;
            name: string | null;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
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
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
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
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        } & {
            id: string;
            notes: string | null;
            requestId: string;
            itemId: string;
            variantId: string | null;
            quantityRequested: number;
            quantityApproved: number | null;
            quantityFulfilled: number | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryRequestStatus;
        updatedAt: Date;
        reason: string | null;
        reference: string;
        department: string | null;
        locationId: string | null;
        requestedById: string;
        costCenter: string | null;
        neededBy: Date | null;
        linkedTicketId: string | null;
        linkedBoardCardId: string | null;
    })[]>;
    listTransfers(query: PaginationQueryDto & {
        status?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        fromLocation: {
            id: string;
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        };
        toLocation: {
            id: string;
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        };
        lines: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
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
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
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
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryTransferStatus;
        updatedAt: Date;
        note: string | null;
        approvedAt: Date | null;
        reference: string;
        receivedAt: Date | null;
        shippedAt: Date | null;
        fromLocationId: string;
        toLocationId: string;
        requestedById: string;
        approvedById: string | null;
    })[]>;
    listAdjustments(query: PaginationQueryDto & {
        status?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        createdBy: {
            id: string;
            name: string | null;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
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
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        };
        lines: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
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
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
            } | null;
        } & {
            id: string;
            note: string | null;
            itemId: string;
            variantId: string | null;
            unitCost: number | null;
            quantityDelta: number;
            adjustmentId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryAdjustmentStatus;
        updatedAt: Date;
        reason: string;
        createdById: string;
        note: string | null;
        approvedAt: Date | null;
        reference: string;
        locationId: string;
        approvedById: string | null;
    })[]>;
    listCounts(query: PaginationQueryDto & {
        status?: string;
    }): import("@prisma/client").Prisma.PrismaPromise<({
        createdBy: {
            id: string;
            name: string | null;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
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
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryCountStatus;
        updatedAt: Date;
        createdById: string;
        type: string;
        approvedAt: Date | null;
        reference: string;
        locationId: string;
        approvedById: string | null;
        blindCount: boolean;
        startedAt: Date | null;
        closedAt: Date | null;
    })[]>;
    createRequest(dto: CreateRequestDto, req: any): Promise<{
        lines: {
            id: string;
            notes: string | null;
            requestId: string;
            itemId: string;
            variantId: string | null;
            quantityRequested: number;
            quantityApproved: number | null;
            quantityFulfilled: number | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryRequestStatus;
        updatedAt: Date;
        reason: string | null;
        reference: string;
        department: string | null;
        locationId: string | null;
        requestedById: string;
        costCenter: string | null;
        neededBy: Date | null;
        linkedTicketId: string | null;
        linkedBoardCardId: string | null;
    }>;
    approveRequest(id: string, dto: ApproveRequestDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryRequestStatus;
        updatedAt: Date;
        reason: string | null;
        reference: string;
        department: string | null;
        locationId: string | null;
        requestedById: string;
        costCenter: string | null;
        neededBy: Date | null;
        linkedTicketId: string | null;
        linkedBoardCardId: string | null;
    }>;
    fulfillRequest(id: string, dto: FulfillRequestDto, req: any): Promise<{
        id: string;
    }>;
    createAdjustment(dto: CreateAdjustmentDto, req: any): Promise<{
        lines: {
            id: string;
            note: string | null;
            itemId: string;
            variantId: string | null;
            unitCost: number | null;
            quantityDelta: number;
            adjustmentId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryAdjustmentStatus;
        updatedAt: Date;
        reason: string;
        createdById: string;
        note: string | null;
        approvedAt: Date | null;
        reference: string;
        locationId: string;
        approvedById: string | null;
    }>;
    updateAdjustmentStatus(id: string, dto: UpdateAdjustmentStatusDto, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryAdjustmentStatus;
    }>;
    createCountSession(dto: CreateCountSessionDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryCountStatus;
        updatedAt: Date;
        createdById: string;
        type: string;
        approvedAt: Date | null;
        reference: string;
        locationId: string;
        approvedById: string | null;
        blindCount: boolean;
        startedAt: Date | null;
        closedAt: Date | null;
    }>;
    submitCount(id: string, dto: SubmitCountDto, req: any): Promise<{
        id: string;
    }>;
    updateCountStatus(id: string, dto: UpdateCountStatusDto, req: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.InventoryCountStatus;
    }>;
    listAlerts(): import("@prisma/client").Prisma.PrismaPromise<({
        item: {
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            type: import("@prisma/client").$Enums.InventoryItemType;
            sku: string;
            categoryId: string | null;
            unitId: string | null;
            tracking: import("@prisma/client").$Enums.InventoryTrackingType;
            barcode: string | null;
            imageUrl: string | null;
            reorderPoint: number;
            minStock: number;
            maxStock: number | null;
            isTrackable: boolean;
            taxRate: number | null;
        } | null;
        location: {
            id: string;
            code: string | null;
            name: string;
            createdAt: Date;
            description: string | null;
            isActive: boolean;
            updatedAt: Date;
            managerId: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.InventoryAlertStatus;
        resolvedAt: Date | null;
        message: string;
        type: import("@prisma/client").$Enums.InventoryAlertType;
        itemId: string | null;
        variantId: string | null;
        locationId: string | null;
    })[]>;
    lowStockReport(): Promise<any[]>;
    valuationReport(): Promise<{
        totalValue: number;
        balances: ({
            item: {
                id: string;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
                type: import("@prisma/client").$Enums.InventoryItemType;
                sku: string;
                categoryId: string | null;
                unitId: string | null;
                tracking: import("@prisma/client").$Enums.InventoryTrackingType;
                barcode: string | null;
                imageUrl: string | null;
                reorderPoint: number;
                minStock: number;
                maxStock: number | null;
                isTrackable: boolean;
                taxRate: number | null;
            };
            location: {
                id: string;
                code: string | null;
                name: string;
                createdAt: Date;
                description: string | null;
                isActive: boolean;
                updatedAt: Date;
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
}
