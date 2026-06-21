"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const client_1 = require("@prisma/client");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logAudit(data) {
        await this.prisma.inventoryAuditLog.create({
            data: {
                actorId: data.actorId,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                before: data.before,
                after: data.after,
                reason: data.reason,
                ip: data.ip,
                requestId: data.requestId
            }
        });
    }
    async ensureLocationAccess(userId, locationId, action) {
        const access = await this.prisma.inventoryLocationAccess.findUnique({
            where: { userId_locationId: { userId, locationId } }
        });
        if (!access) {
            throw new common_1.ForbiddenException("No access to this location");
        }
        if (action === "issue" && !access.canIssue) {
            throw new common_1.ForbiddenException("Not permitted to issue from this location");
        }
        if (action === "approve" && !access.canApprove) {
            throw new common_1.ForbiddenException("Not permitted to approve for this location");
        }
    }
    async getOrCreateBalance(tx, params) {
        const existing = await tx.inventoryStockBalance.findFirst({
            where: {
                itemId: params.itemId,
                variantId: params.variantId ?? null,
                locationId: params.locationId,
                binId: params.binId ?? null
            }
        });
        if (existing)
            return existing;
        return tx.inventoryStockBalance.create({
            data: {
                itemId: params.itemId,
                variantId: params.variantId ?? null,
                locationId: params.locationId,
                binId: params.binId ?? null,
                quantityOnHand: 0,
                quantityReserved: 0,
                averageCost: 0
            }
        });
    }
    async overview() {
        const [items, balances, lowStockItems, outOfStockItems, expiringBatches, pendingRequests, recentMovements, locations] = await Promise.all([
            this.prisma.inventoryItem.findMany({
                where: { isActive: true },
                include: { balances: true }
            }),
            this.prisma.inventoryStockBalance.findMany(),
            this.prisma.inventoryItem.findMany({
                where: { isActive: true },
                include: { balances: true }
            }),
            this.prisma.inventoryItem.findMany({
                where: { isActive: true },
                include: { balances: true }
            }),
            this.prisma.inventoryBatch.findMany({
                where: {
                    quantityRemaining: { gt: 0 },
                    expiryDate: { lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) }
                },
                include: { item: true, location: true }
            }),
            this.prisma.inventoryRequest.count({
                where: { status: client_1.InventoryRequestStatus.PENDING_APPROVAL }
            }),
            this.prisma.inventoryStockMovement.findMany({
                orderBy: { createdAt: "desc" },
                take: 8,
                include: {
                    item: true,
                    variant: true,
                    locationFrom: true,
                    locationTo: true
                }
            }),
            this.prisma.inventoryLocation.findMany({
                include: { balances: true }
            })
        ]);
        const totalSkus = items.length;
        const totalOnHand = balances.reduce((sum, b) => sum + b.quantityOnHand, 0);
        const stockValue = balances.reduce((sum, b) => sum + b.quantityOnHand * (b.averageCost || 0), 0);
        const lowStockCount = lowStockItems.filter((item) => {
            const qty = item.balances.reduce((sum, b) => sum + b.quantityOnHand, 0);
            return qty > 0 && item.reorderPoint > 0 && qty <= item.reorderPoint;
        }).length;
        const outOfStockCount = outOfStockItems.filter((item) => {
            const qty = item.balances.reduce((sum, b) => sum + b.quantityOnHand, 0);
            return qty <= 0;
        }).length;
        const locationSummary = locations.map((loc) => ({
            id: loc.id,
            name: loc.name,
            stockOnHand: loc.balances.reduce((sum, b) => sum + b.quantityOnHand, 0)
        }));
        return {
            totalSkus,
            totalOnHand,
            lowStockCount,
            outOfStockCount,
            expiringItems: expiringBatches.length,
            pendingRequests,
            stockValue,
            recentMovements,
            locationSummary
        };
    }
    async listItems(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {
            isActive: query.active === "false" ? false : true
        };
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: "insensitive" } },
                { sku: { contains: query.search, mode: "insensitive" } }
            ];
        }
        if (query.categoryId)
            where.categoryId = query.categoryId;
        if (query.type)
            where.type = query.type;
        const [items, total] = await Promise.all([
            this.prisma.inventoryItem.findMany({
                where,
                include: { category: true, unit: true, variants: true, balances: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize
            }),
            this.prisma.inventoryItem.count({ where })
        ]);
        return { items, total, page, pageSize };
    }
    async getItem(id) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id },
            include: {
                category: true,
                unit: true,
                variants: true,
                balances: { include: { location: true } },
                movements: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                    include: { locationFrom: true, locationTo: true, variant: true }
                },
                supplierLinks: { include: { supplier: true } },
                alerts: { where: { status: "OPEN" }, take: 5 },
                attachments: true
            }
        });
        if (!item)
            throw new common_1.NotFoundException("Item not found");
        return item;
    }
    async createItem(dto, actorId) {
        const item = await this.prisma.inventoryItem.create({
            data: {
                name: dto.name,
                sku: dto.sku,
                description: dto.description || null,
                categoryId: dto.categoryId || null,
                unitId: dto.unitId || null,
                type: dto.type || "CONSUMABLE",
                tracking: dto.tracking || "NONE",
                barcode: dto.barcode || null,
                imageUrl: dto.imageUrl || null,
                reorderPoint: dto.reorderPoint ?? 0,
                minStock: dto.minStock ?? 0,
                maxStock: dto.maxStock ?? null,
                isTrackable: dto.isTrackable ?? true,
                taxRate: dto.taxRate ?? null,
                variants: dto.variants?.length
                    ? {
                        create: dto.variants.map((variant) => ({
                            name: variant.name,
                            sku: variant.sku,
                            barcode: variant.barcode || null,
                            attributes: variant.attributes ?? undefined
                        }))
                    }
                    : undefined
            },
            include: { variants: true }
        });
        await this.logAudit({
            actorId,
            action: "inventory.item.create",
            entity: "InventoryItem",
            entityId: item.id,
            after: item
        });
        return item;
    }
    async updateItem(id, dto, actorId) {
        const existing = await this.prisma.inventoryItem.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException("Item not found");
        const item = await this.prisma.inventoryItem.update({
            where: { id },
            data: {
                name: dto.name ?? existing.name,
                description: dto.description ?? existing.description,
                categoryId: dto.categoryId ?? existing.categoryId,
                unitId: dto.unitId ?? existing.unitId,
                type: dto.type ?? existing.type,
                tracking: dto.tracking ?? existing.tracking,
                barcode: dto.barcode ?? existing.barcode,
                imageUrl: dto.imageUrl ?? existing.imageUrl,
                reorderPoint: dto.reorderPoint ?? existing.reorderPoint,
                minStock: dto.minStock ?? existing.minStock,
                maxStock: dto.maxStock ?? existing.maxStock,
                isTrackable: dto.isTrackable ?? existing.isTrackable,
                taxRate: dto.taxRate ?? existing.taxRate,
                isActive: dto.isActive ?? existing.isActive
            }
        });
        await this.logAudit({
            actorId,
            action: "inventory.item.update",
            entity: "InventoryItem",
            entityId: item.id,
            before: existing,
            after: item
        });
        return item;
    }
    async archiveItem(id, actorId) {
        const existing = await this.prisma.inventoryItem.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException("Item not found");
        const item = await this.prisma.inventoryItem.update({
            where: { id },
            data: { isActive: false }
        });
        await this.logAudit({
            actorId,
            action: "inventory.item.archive",
            entity: "InventoryItem",
            entityId: item.id,
            before: existing,
            after: item,
            reason: "Archived"
        });
        return item;
    }
    listCategories() {
        return this.prisma.inventoryCategory.findMany({ orderBy: { name: "asc" } });
    }
    createCategory(dto) {
        return this.prisma.inventoryCategory.create({ data: dto });
    }
    listUnits() {
        return this.prisma.inventoryUnit.findMany({ orderBy: { name: "asc" } });
    }
    createUnit(dto) {
        return this.prisma.inventoryUnit.create({ data: dto });
    }
    listLocations() {
        return this.prisma.inventoryLocation.findMany({
            include: { manager: true }
        });
    }
    createLocation(dto) {
        return this.prisma.inventoryLocation.create({
            data: {
                name: dto.name,
                code: dto.code || null,
                description: dto.description || null,
                managerId: dto.managerId || null
            }
        });
    }
    updateLocation(id, dto) {
        return this.prisma.inventoryLocation.update({
            where: { id },
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                managerId: dto.managerId || null,
                isActive: dto.isActive
            }
        });
    }
    listBalances(locationId) {
        return this.prisma.inventoryStockBalance.findMany({
            where: locationId ? { locationId } : {},
            include: { item: true, variant: true, location: true }
        });
    }
    listMovements(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (query.locationId) {
            where.OR = [{ locationFromId: query.locationId }, { locationToId: query.locationId }];
        }
        if (query.itemId)
            where.itemId = query.itemId;
        if (query.type)
            where.type = query.type;
        return this.prisma.inventoryStockMovement.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            include: { item: true, variant: true, locationFrom: true, locationTo: true }
        });
    }
    async receiveStock(dto, actorId) {
        const location = await this.prisma.inventoryLocation.findUnique({ where: { id: dto.locationId } });
        if (!location || !location.isActive)
            throw new common_1.BadRequestException("Invalid location");
        const reference = dto.reference || `RCV-${Date.now()}`;
        await this.prisma.$transaction(async (tx) => {
            for (const line of dto.items) {
                const item = await tx.inventoryItem.findUnique({ where: { id: line.itemId } });
                if (!item || !item.isActive)
                    throw new common_1.BadRequestException("Invalid item");
                let batchId;
                if (item.tracking === "BATCH" && line.batchNumber) {
                    const batch = await tx.inventoryBatch.create({
                        data: {
                            itemId: line.itemId,
                            variantId: line.variantId || null,
                            locationId: dto.locationId,
                            batchNumber: line.batchNumber,
                            expiryDate: line.expiryDate ? new Date(line.expiryDate) : null,
                            quantityRemaining: line.quantity
                        }
                    });
                    batchId = batch.id;
                }
                if (item.tracking === "SERIAL") {
                    if (!line.serialNumbers || line.serialNumbers.length !== line.quantity) {
                        throw new common_1.BadRequestException("Serial numbers count mismatch");
                    }
                    for (const serialNumber of line.serialNumbers) {
                        await tx.inventorySerial.create({
                            data: {
                                itemId: line.itemId,
                                variantId: line.variantId || null,
                                serialNumber,
                                locationId: dto.locationId
                            }
                        });
                    }
                }
                const balance = await this.getOrCreateBalance(tx, {
                    itemId: line.itemId,
                    variantId: line.variantId ?? null,
                    locationId: dto.locationId
                });
                const newQty = balance.quantityOnHand + line.quantity;
                const newAvgCost = line.unitCost
                    ? ((balance.averageCost || 0) * balance.quantityOnHand + line.unitCost * line.quantity) /
                        Math.max(newQty, 1)
                    : balance.averageCost || 0;
                await tx.inventoryStockBalance.update({
                    where: { id: balance.id },
                    data: { quantityOnHand: newQty, averageCost: newAvgCost }
                });
                await tx.inventoryStockMovement.create({
                    data: {
                        itemId: line.itemId,
                        variantId: line.variantId || null,
                        locationToId: dto.locationId,
                        quantity: line.quantity,
                        unitCost: line.unitCost || null,
                        type: client_1.InventoryMovementType.RECEIVE,
                        reference,
                        reason: dto.reason || null,
                        batchId: batchId || null,
                        createdById: actorId
                    }
                });
                await this.evaluateAlerts(tx, line.itemId, line.variantId || null, dto.locationId);
            }
        });
        await this.logAudit({
            actorId,
            action: "inventory.stock.receive",
            entity: "InventoryStockMovement",
            entityId: reference,
            after: { reference, items: dto.items }
        });
        return { reference };
    }
    async issueStock(dto, actorId) {
        await this.ensureLocationAccess(actorId, dto.locationId, "issue");
        const reference = dto.reference || `ISS-${Date.now()}`;
        await this.prisma.$transaction(async (tx) => {
            for (const line of dto.items) {
                const balance = await this.getOrCreateBalance(tx, {
                    itemId: line.itemId,
                    variantId: line.variantId ?? null,
                    locationId: dto.locationId
                });
                const available = balance.quantityOnHand - balance.quantityReserved;
                if (available < line.quantity)
                    throw new common_1.BadRequestException("Insufficient stock");
                const item = await tx.inventoryItem.findUnique({ where: { id: line.itemId } });
                if (item?.tracking === "SERIAL") {
                    if (!line.serialNumbers || line.serialNumbers.length !== line.quantity) {
                        throw new common_1.BadRequestException("Serial numbers required for serial-tracked items");
                    }
                    for (const serialNumber of line.serialNumbers) {
                        const serial = await tx.inventorySerial.findUnique({ where: { serialNumber } });
                        if (!serial || serial.locationId !== dto.locationId) {
                            throw new common_1.BadRequestException(`Serial not available: ${serialNumber}`);
                        }
                        await tx.inventorySerial.update({
                            where: { id: serial.id },
                            data: { status: "ISSUED", locationId: null }
                        });
                    }
                }
                await tx.inventoryStockBalance.update({
                    where: { id: balance.id },
                    data: { quantityOnHand: balance.quantityOnHand - line.quantity }
                });
                await tx.inventoryStockMovement.create({
                    data: {
                        itemId: line.itemId,
                        variantId: line.variantId || null,
                        locationFromId: dto.locationId,
                        quantity: line.quantity,
                        unitCost: line.unitCost || null,
                        type: client_1.InventoryMovementType.ISSUE,
                        reference,
                        reason: dto.reason || null,
                        createdById: actorId
                    }
                });
                await this.evaluateAlerts(tx, line.itemId, line.variantId || null, dto.locationId);
            }
        });
        await this.logAudit({
            actorId,
            action: "inventory.stock.issue",
            entity: "InventoryStockMovement",
            entityId: reference,
            after: { reference, items: dto.items }
        });
        return { reference };
    }
    async createTransfer(dto, actorId) {
        if (dto.fromLocationId === dto.toLocationId) {
            throw new common_1.BadRequestException("Locations must differ");
        }
        const reference = `TRF-${Date.now()}`;
        const transfer = await this.prisma.inventoryTransfer.create({
            data: {
                reference,
                status: client_1.InventoryTransferStatus.SUBMITTED,
                fromLocationId: dto.fromLocationId,
                toLocationId: dto.toLocationId,
                requestedById: actorId,
                note: dto.note || null,
                lines: {
                    create: dto.items.map((line) => ({
                        itemId: line.itemId,
                        variantId: line.variantId || null,
                        quantity: line.quantity
                    }))
                }
            },
            include: { lines: true }
        });
        await this.logAudit({
            actorId,
            action: "inventory.stock.transfer",
            entity: "InventoryTransfer",
            entityId: transfer.id,
            after: transfer
        });
        return transfer;
    }
    async updateTransferStatus(id, dto, actorId) {
        const transfer = await this.prisma.inventoryTransfer.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!transfer)
            throw new common_1.NotFoundException("Transfer not found");
        if (dto.status === client_1.InventoryTransferStatus.IN_TRANSIT) {
            await this.ensureLocationAccess(actorId, transfer.fromLocationId, "issue");
        }
        if (dto.status === client_1.InventoryTransferStatus.RECEIVED) {
            await this.ensureLocationAccess(actorId, transfer.toLocationId, "issue");
        }
        await this.prisma.$transaction(async (tx) => {
            if (dto.status === client_1.InventoryTransferStatus.IN_TRANSIT) {
                for (const line of transfer.lines) {
                    const balance = await this.getOrCreateBalance(tx, {
                        itemId: line.itemId,
                        variantId: line.variantId ?? null,
                        locationId: transfer.fromLocationId
                    });
                    if (balance.quantityOnHand - balance.quantityReserved < line.quantity) {
                        throw new common_1.BadRequestException("Insufficient stock for transfer");
                    }
                    await tx.inventoryStockBalance.update({
                        where: { id: balance.id },
                        data: { quantityOnHand: balance.quantityOnHand - line.quantity }
                    });
                    await tx.inventoryStockMovement.create({
                        data: {
                            itemId: line.itemId,
                            variantId: line.variantId || null,
                            locationFromId: transfer.fromLocationId,
                            quantity: line.quantity,
                            type: client_1.InventoryMovementType.TRANSFER_OUT,
                            reference: transfer.reference,
                            createdById: actorId
                        }
                    });
                }
            }
            if (dto.status === client_1.InventoryTransferStatus.RECEIVED) {
                for (const line of transfer.lines) {
                    const balance = await this.getOrCreateBalance(tx, {
                        itemId: line.itemId,
                        variantId: line.variantId ?? null,
                        locationId: transfer.toLocationId
                    });
                    await tx.inventoryStockBalance.update({
                        where: { id: balance.id },
                        data: { quantityOnHand: balance.quantityOnHand + line.quantity }
                    });
                    await tx.inventoryStockMovement.create({
                        data: {
                            itemId: line.itemId,
                            variantId: line.variantId || null,
                            locationToId: transfer.toLocationId,
                            quantity: line.quantity,
                            type: client_1.InventoryMovementType.TRANSFER_IN,
                            reference: transfer.reference,
                            createdById: actorId
                        }
                    });
                }
            }
            await tx.inventoryTransfer.update({
                where: { id },
                data: {
                    status: dto.status,
                    approvedById: dto.status === client_1.InventoryTransferStatus.APPROVED ? actorId : transfer.approvedById,
                    approvedAt: dto.status === client_1.InventoryTransferStatus.APPROVED ? new Date() : transfer.approvedAt,
                    shippedAt: dto.status === client_1.InventoryTransferStatus.IN_TRANSIT ? new Date() : transfer.shippedAt,
                    receivedAt: dto.status === client_1.InventoryTransferStatus.RECEIVED ? new Date() : transfer.receivedAt,
                    note: dto.note || transfer.note
                }
            });
        });
        return { id, status: dto.status };
    }
    async createRequest(dto, actorId) {
        const reference = `REQ-${Date.now()}`;
        const request = await this.prisma.inventoryRequest.create({
            data: {
                reference,
                status: client_1.InventoryRequestStatus.PENDING_APPROVAL,
                locationId: dto.locationId || null,
                requestedById: actorId,
                department: dto.department || null,
                costCenter: dto.costCenter || null,
                neededBy: dto.neededBy ? new Date(dto.neededBy) : null,
                reason: dto.reason || null,
                linkedTicketId: dto.linkedTicketId || null,
                linkedBoardCardId: dto.linkedBoardCardId || null,
                lines: {
                    create: dto.lines.map((line) => ({
                        itemId: line.itemId,
                        variantId: line.variantId || null,
                        quantityRequested: line.quantityRequested,
                        notes: line.notes || null
                    }))
                }
            },
            include: { lines: true }
        });
        await this.logAudit({
            actorId,
            action: "inventory.request.create",
            entity: "InventoryRequest",
            entityId: request.id,
            after: request
        });
        return request;
    }
    listRequests(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (query.status)
            where.status = query.status;
        return this.prisma.inventoryRequest.findMany({
            where,
            include: { lines: { include: { item: true, variant: true } }, requestedBy: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize
        });
    }
    async approveRequest(id, dto, actorId) {
        const request = await this.prisma.inventoryRequest.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!request)
            throw new common_1.NotFoundException("Request not found");
        if (request.locationId) {
            await this.ensureLocationAccess(actorId, request.locationId, "approve");
        }
        const status = dto.status;
        const updated = await this.prisma.$transaction(async (tx) => {
            if (dto.lines && dto.lines.length) {
                for (const line of dto.lines) {
                    await tx.inventoryRequestLine.updateMany({
                        where: { requestId: request.id, itemId: line.itemId, variantId: line.variantId || null },
                        data: { quantityApproved: line.quantityRequested }
                    });
                }
            }
            else if (status === client_1.InventoryRequestStatus.APPROVED) {
                for (const line of request.lines) {
                    await tx.inventoryRequestLine.update({
                        where: { id: line.id },
                        data: { quantityApproved: line.quantityRequested }
                    });
                }
            }
            const requestUpdate = await tx.inventoryRequest.update({
                where: { id },
                data: { status }
            });
            await tx.inventoryRequestApproval.create({
                data: {
                    requestId: id,
                    status,
                    approvedById: actorId,
                    note: dto.note || null
                }
            });
            return requestUpdate;
        });
        await this.logAudit({
            actorId,
            action: "inventory.request.approve",
            entity: "InventoryRequest",
            entityId: id,
            after: updated
        });
        return updated;
    }
    async fulfillRequest(id, dto, actorId) {
        const request = await this.prisma.inventoryRequest.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!request)
            throw new common_1.NotFoundException("Request not found");
        await this.issueStock({
            locationId: dto.locationId,
            issueType: dto.issueType || "DEPARTMENT",
            issuedTo: dto.issuedTo ?? undefined,
            reference: request.reference,
            reason: dto.note,
            items: dto.items
        }, actorId);
        await this.prisma.$transaction(async (tx) => {
            for (const line of dto.items) {
                await tx.inventoryRequestLine.updateMany({
                    where: { requestId: request.id, itemId: line.itemId, variantId: line.variantId || null },
                    data: { quantityFulfilled: line.quantity }
                });
            }
            const updatedLines = await tx.inventoryRequestLine.findMany({
                where: { requestId: request.id }
            });
            const fullyFulfilled = updatedLines.every((line) => (line.quantityFulfilled ?? 0) >= (line.quantityApproved ?? 0));
            await tx.inventoryRequest.update({
                where: { id },
                data: {
                    status: fullyFulfilled
                        ? client_1.InventoryRequestStatus.FULFILLED
                        : client_1.InventoryRequestStatus.PARTIALLY_FULFILLED
                }
            });
            await tx.inventoryIssueNote.create({
                data: {
                    requestId: id,
                    issuedById: actorId,
                    issueType: dto.issueType || "DEPARTMENT",
                    issuedTo: dto.issuedTo ?? undefined,
                    note: dto.note || null
                }
            });
        });
        await this.logAudit({
            actorId,
            action: "inventory.request.fulfill",
            entity: "InventoryRequest",
            entityId: id
        });
        return { id };
    }
    async createAdjustment(dto, actorId) {
        const reference = `ADJ-${Date.now()}`;
        const adjustment = await this.prisma.inventoryAdjustment.create({
            data: {
                reference,
                status: client_1.InventoryAdjustmentStatus.SUBMITTED,
                locationId: dto.locationId,
                reason: dto.reason,
                createdById: actorId,
                note: dto.note || null,
                lines: {
                    create: dto.lines.map((line) => ({
                        itemId: line.itemId,
                        variantId: line.variantId || null,
                        quantityDelta: line.quantityDelta,
                        unitCost: line.unitCost || null,
                        note: line.note || null
                    }))
                }
            },
            include: { lines: true }
        });
        await this.logAudit({
            actorId,
            action: "inventory.stock.adjust",
            entity: "InventoryAdjustment",
            entityId: adjustment.id,
            after: adjustment
        });
        return adjustment;
    }
    async updateAdjustmentStatus(id, dto, actorId) {
        const adjustment = await this.prisma.inventoryAdjustment.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!adjustment)
            throw new common_1.NotFoundException("Adjustment not found");
        if (dto.status === client_1.InventoryAdjustmentStatus.APPROVED ||
            dto.status === client_1.InventoryAdjustmentStatus.APPLIED) {
            await this.ensureLocationAccess(actorId, adjustment.locationId, "approve");
        }
        await this.prisma.$transaction(async (tx) => {
            if (dto.status === client_1.InventoryAdjustmentStatus.APPLIED) {
                for (const line of adjustment.lines) {
                    const balance = await this.getOrCreateBalance(tx, {
                        itemId: line.itemId,
                        variantId: line.variantId ?? null,
                        locationId: adjustment.locationId
                    });
                    await tx.inventoryStockBalance.update({
                        where: { id: balance.id },
                        data: { quantityOnHand: balance.quantityOnHand + line.quantityDelta }
                    });
                    await tx.inventoryStockMovement.create({
                        data: {
                            itemId: line.itemId,
                            variantId: line.variantId || null,
                            locationToId: adjustment.locationId,
                            quantity: line.quantityDelta,
                            unitCost: line.unitCost || null,
                            type: client_1.InventoryMovementType.ADJUSTMENT,
                            reference: adjustment.reference,
                            reason: adjustment.reason,
                            createdById: actorId
                        }
                    });
                }
            }
            await tx.inventoryAdjustment.update({
                where: { id },
                data: {
                    status: dto.status,
                    approvedById: dto.status === client_1.InventoryAdjustmentStatus.APPROVED ? actorId : adjustment.approvedById,
                    approvedAt: dto.status === client_1.InventoryAdjustmentStatus.APPROVED ? new Date() : adjustment.approvedAt
                }
            });
        });
        return { id, status: dto.status };
    }
    async createCountSession(dto, actorId) {
        const reference = `CNT-${Date.now()}`;
        const session = await this.prisma.inventoryCountSession.create({
            data: {
                reference,
                status: client_1.InventoryCountStatus.IN_PROGRESS,
                locationId: dto.locationId,
                type: dto.type,
                blindCount: dto.blindCount ?? false,
                startedAt: new Date(),
                createdById: actorId
            }
        });
        return session;
    }
    async submitCount(id, dto, actorId) {
        const session = await this.prisma.inventoryCountSession.findUnique({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException("Count session not found");
        await this.prisma.$transaction(async (tx) => {
            await tx.inventoryCountLine.deleteMany({ where: { sessionId: id } });
            for (const line of dto.lines) {
                const balance = await tx.inventoryStockBalance.findFirst({
                    where: { itemId: line.itemId, variantId: line.variantId || null, locationId: session.locationId }
                });
                const systemQty = balance?.quantityOnHand ?? 0;
                await tx.inventoryCountLine.create({
                    data: {
                        sessionId: id,
                        itemId: line.itemId,
                        variantId: line.variantId || null,
                        systemQty,
                        countedQty: line.countedQty,
                        variance: line.countedQty - systemQty
                    }
                });
            }
            await tx.inventoryCountSession.update({
                where: { id },
                data: { status: client_1.InventoryCountStatus.SUBMITTED }
            });
        });
        await this.logAudit({
            actorId,
            action: "inventory.count.submit",
            entity: "InventoryCountSession",
            entityId: id
        });
        return { id };
    }
    async updateCountStatus(id, dto, actorId) {
        const session = await this.prisma.inventoryCountSession.findUnique({
            where: { id },
            include: { lines: true }
        });
        if (!session)
            throw new common_1.NotFoundException("Count session not found");
        if (dto.status === client_1.InventoryCountStatus.APPROVED) {
            await this.ensureLocationAccess(actorId, session.locationId, "approve");
            await this.prisma.$transaction(async (tx) => {
                for (const line of session.lines) {
                    if (line.variance === 0)
                        continue;
                    const balance = await this.getOrCreateBalance(tx, {
                        itemId: line.itemId,
                        variantId: line.variantId ?? null,
                        locationId: session.locationId
                    });
                    await tx.inventoryStockBalance.update({
                        where: { id: balance.id },
                        data: { quantityOnHand: balance.quantityOnHand + line.variance }
                    });
                    await tx.inventoryStockMovement.create({
                        data: {
                            itemId: line.itemId,
                            variantId: line.variantId || null,
                            locationToId: session.locationId,
                            quantity: line.variance,
                            type: client_1.InventoryMovementType.COUNT,
                            reference: session.reference,
                            reason: "Stock count variance",
                            createdById: actorId
                        }
                    });
                }
                await tx.inventoryCountSession.update({
                    where: { id },
                    data: {
                        status: client_1.InventoryCountStatus.APPROVED,
                        approvedById: actorId,
                        approvedAt: new Date(),
                        closedAt: new Date()
                    }
                });
            });
        }
        else {
            await this.prisma.inventoryCountSession.update({
                where: { id },
                data: { status: dto.status }
            });
        }
        return { id, status: dto.status };
    }
    listTransfers(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (query.status)
            where.status = query.status;
        return this.prisma.inventoryTransfer.findMany({
            where,
            include: {
                fromLocation: true,
                toLocation: true,
                lines: { include: { item: true, variant: true } }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize
        });
    }
    listAdjustments(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (query.status)
            where.status = query.status;
        return this.prisma.inventoryAdjustment.findMany({
            where,
            include: {
                location: true,
                createdBy: true,
                lines: { include: { item: true, variant: true } }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize
        });
    }
    listCounts(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const where = {};
        if (query.status)
            where.status = query.status;
        return this.prisma.inventoryCountSession.findMany({
            where,
            include: { location: true, createdBy: true },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize
        });
    }
    async reportLowStock() {
        const items = await this.prisma.inventoryItem.findMany({
            where: { isActive: true },
            include: { balances: true, category: true, unit: true }
        });
        return items
            .map((item) => {
            const onHand = item.balances.reduce((sum, b) => sum + b.quantityOnHand, 0);
            return { ...item, onHand };
        })
            .filter((item) => item.reorderPoint > 0 && item.onHand <= item.reorderPoint);
    }
    async reportValuation() {
        const balances = await this.prisma.inventoryStockBalance.findMany({
            include: { item: true, location: true }
        });
        const totalValue = balances.reduce((sum, b) => sum + b.quantityOnHand * (b.averageCost || 0), 0);
        return { totalValue, balances };
    }
    listAlerts() {
        return this.prisma.inventoryAlert.findMany({
            orderBy: { createdAt: "desc" },
            include: { item: true, location: true }
        });
    }
    async setLocationAccess(dto) {
        return this.prisma.inventoryLocationAccess.upsert({
            where: { userId_locationId: { userId: dto.userId, locationId: dto.locationId } },
            update: { canIssue: dto.canIssue ?? false, canApprove: dto.canApprove ?? false },
            create: {
                userId: dto.userId,
                locationId: dto.locationId,
                canIssue: dto.canIssue ?? false,
                canApprove: dto.canApprove ?? false
            }
        });
    }
    async evaluateAlerts(tx, itemId, variantId, locationId) {
        const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
        if (!item)
            return;
        const balance = await tx.inventoryStockBalance.findFirst({
            where: { itemId, variantId, locationId }
        });
        const onHand = balance?.quantityOnHand ?? 0;
        if (item.reorderPoint > 0 && onHand <= item.reorderPoint) {
            const existing = await tx.inventoryAlert.findFirst({
                where: {
                    itemId,
                    variantId,
                    locationId,
                    type: "LOW_STOCK",
                    status: "OPEN"
                }
            });
            if (!existing) {
                await tx.inventoryAlert.create({
                    data: {
                        type: "LOW_STOCK",
                        status: "OPEN",
                        itemId,
                        variantId,
                        locationId,
                        message: `Low stock alert: ${item.name}`
                    }
                });
            }
        }
        if (onHand <= 0) {
            const existing = await tx.inventoryAlert.findFirst({
                where: {
                    itemId,
                    variantId,
                    locationId,
                    type: "OUT_OF_STOCK",
                    status: "OPEN"
                }
            });
            if (!existing) {
                await tx.inventoryAlert.create({
                    data: {
                        type: "OUT_OF_STOCK",
                        status: "OPEN",
                        itemId,
                        variantId,
                        locationId,
                        message: `Out of stock: ${item.name}`
                    }
                });
            }
        }
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map