import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import {
  ApproveRequestDto,
  CreateAdjustmentDto,
  CreateCountSessionDto,
  CreateInventoryCategoryDto,
  CreateInventoryItemDto,
  CreateInventoryLocationDto,
  CreateInventoryUnitDto,
  CreateRequestDto,
  CreateTransferDto,
  FulfillRequestDto,
  IssueStockDto,
  LocationAccessDto,
  PaginationQueryDto,
  ReceiveStockDto,
  SubmitCountDto,
  UpdateAdjustmentStatusDto,
  UpdateCountStatusDto,
  UpdateInventoryItemDto,
  UpdateInventoryLocationDto,
  UpdateTransferStatusDto
} from "./dto";
import {
  InventoryAdjustmentStatus,
  InventoryCountStatus,
  InventoryMovementType,
  InventoryRequestStatus,
  InventoryTransferStatus,
  Prisma
} from "@prisma/client";

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private async logAudit(data: {
    actorId?: string;
    action: string;
    entity: string;
    entityId?: string;
    before?: Prisma.JsonValue;
    after?: Prisma.JsonValue;
    reason?: string;
    ip?: string;
    requestId?: string;
  }) {
    await this.prisma.inventoryAuditLog.create({
      data: {
        actorId: data.actorId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        before: data.before as any,
        after: data.after as any,
        reason: data.reason,
        ip: data.ip,
        requestId: data.requestId
      }
    });
  }

  private async ensureLocationAccess(userId: string, locationId: string, action: "issue" | "approve") {
    const access = await this.prisma.inventoryLocationAccess.findUnique({
      where: { userId_locationId: { userId, locationId } }
    });
    if (!access) {
      throw new ForbiddenException("No access to this location");
    }
    if (action === "issue" && !access.canIssue) {
      throw new ForbiddenException("Not permitted to issue from this location");
    }
    if (action === "approve" && !access.canApprove) {
      throw new ForbiddenException("Not permitted to approve for this location");
    }
  }

  private async getOrCreateBalance(
    tx: Prisma.TransactionClient,
    params: { itemId: string; variantId?: string | null; locationId: string; binId?: string | null }
  ) {
    const existing = await tx.inventoryStockBalance.findFirst({
      where: {
        itemId: params.itemId,
        variantId: params.variantId ?? null,
        locationId: params.locationId,
        binId: params.binId ?? null
      }
    });
    if (existing) return existing;

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
    const [items, balances, lowStockItems, outOfStockItems, expiringBatches, pendingRequests, recentMovements, locations] =
      await Promise.all([
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
          where: { status: InventoryRequestStatus.PENDING_APPROVAL }
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
    const totalOnHand = balances.reduce((sum: number, b: any) => sum + b.quantityOnHand, 0);
    const stockValue = balances.reduce((sum: number, b: any) => sum + b.quantityOnHand * (b.averageCost || 0), 0);

    const lowStockCount = lowStockItems.filter((item: any) => {
      const qty = item.balances.reduce((sum: number, b: any) => sum + b.quantityOnHand, 0);
      return qty > 0 && item.reorderPoint > 0 && qty <= item.reorderPoint;
    }).length;

    const outOfStockCount = outOfStockItems.filter((item: any) => {
      const qty = item.balances.reduce((sum: number, b: any) => sum + b.quantityOnHand, 0);
      return qty <= 0;
    }).length;

    const locationSummary = locations.map((loc: any) => ({
      id: loc.id,
      name: loc.name,
      stockOnHand: loc.balances.reduce((sum: number, b: any) => sum + b.quantityOnHand, 0)
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

  async listItems(query: PaginationQueryDto & { categoryId?: string; type?: string; active?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where: Prisma.InventoryItemWhereInput = {
      isActive: query.active === "false" ? false : true
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { sku: { contains: query.search, mode: "insensitive" } }
      ];
    }
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.type) where.type = query.type as any;

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

  async getItem(id: string) {
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

    if (!item) throw new NotFoundException("Item not found");
    return item;
  }

  async createItem(dto: CreateInventoryItemDto, actorId: string) {
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
      after: item as any
    });

    return item;
  }

  async updateItem(id: string, dto: UpdateInventoryItemDto, actorId: string) {
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Item not found");

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
      before: existing as any,
      after: item as any
    });

    return item;
  }

  async archiveItem(id: string, actorId: string) {
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Item not found");

    const item = await this.prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false }
    });

    await this.logAudit({
      actorId,
      action: "inventory.item.archive",
      entity: "InventoryItem",
      entityId: item.id,
      before: existing as any,
      after: item as any,
      reason: "Archived"
    });

    return item;
  }

  listCategories() {
    return this.prisma.inventoryCategory.findMany({ orderBy: { name: "asc" } });
  }

  createCategory(dto: CreateInventoryCategoryDto) {
    return this.prisma.inventoryCategory.create({ data: dto });
  }

  listUnits() {
    return this.prisma.inventoryUnit.findMany({ orderBy: { name: "asc" } });
  }

  createUnit(dto: CreateInventoryUnitDto) {
    return this.prisma.inventoryUnit.create({ data: dto });
  }

  listLocations() {
    return this.prisma.inventoryLocation.findMany({
      include: { manager: true }
    });
  }

  createLocation(dto: CreateInventoryLocationDto) {
    return this.prisma.inventoryLocation.create({
      data: {
        name: dto.name,
        code: dto.code || null,
        description: dto.description || null,
        managerId: dto.managerId || null
      }
    });
  }

  updateLocation(id: string, dto: UpdateInventoryLocationDto) {
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

  listBalances(locationId?: string) {
    return this.prisma.inventoryStockBalance.findMany({
      where: locationId ? { locationId } : {},
      include: { item: true, variant: true, location: true }
    });
  }

  listMovements(query: PaginationQueryDto & { locationId?: string; itemId?: string; type?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where: Prisma.InventoryStockMovementWhereInput = {};

    if (query.locationId) {
      where.OR = [{ locationFromId: query.locationId }, { locationToId: query.locationId }];
    }
    if (query.itemId) where.itemId = query.itemId;
    if (query.type) where.type = query.type as any;

    return this.prisma.inventoryStockMovement.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: { item: true, variant: true, locationFrom: true, locationTo: true }
    });
  }

  async receiveStock(dto: ReceiveStockDto, actorId: string) {
    const location = await this.prisma.inventoryLocation.findUnique({ where: { id: dto.locationId } });
    if (!location || !location.isActive) throw new BadRequestException("Invalid location");

    const reference = dto.reference || `RCV-${Date.now()}`;

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const line of dto.items) {
        const item = await tx.inventoryItem.findUnique({ where: { id: line.itemId } });
        if (!item || !item.isActive) throw new BadRequestException("Invalid item");

        let batchId: string | undefined;
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
            throw new BadRequestException("Serial numbers count mismatch");
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
            type: InventoryMovementType.RECEIVE,
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
      after: { reference, items: dto.items } as any
    });

    return { reference };
  }

  async issueStock(dto: IssueStockDto, actorId: string) {
    await this.ensureLocationAccess(actorId, dto.locationId, "issue");

    const reference = dto.reference || `ISS-${Date.now()}`;

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const line of dto.items) {
        const balance = await this.getOrCreateBalance(tx, {
          itemId: line.itemId,
          variantId: line.variantId ?? null,
          locationId: dto.locationId
        });
        const available = balance.quantityOnHand - balance.quantityReserved;
        if (available < line.quantity) throw new BadRequestException("Insufficient stock");

        const item = await tx.inventoryItem.findUnique({ where: { id: line.itemId } });
        if (item?.tracking === "SERIAL") {
          if (!line.serialNumbers || line.serialNumbers.length !== line.quantity) {
            throw new BadRequestException("Serial numbers required for serial-tracked items");
          }
          for (const serialNumber of line.serialNumbers) {
            const serial = await tx.inventorySerial.findUnique({ where: { serialNumber } });
            if (!serial || serial.locationId !== dto.locationId) {
              throw new BadRequestException(`Serial not available: ${serialNumber}`);
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
            type: InventoryMovementType.ISSUE,
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
      after: { reference, items: dto.items } as any
    });

    return { reference };
  }

  async createTransfer(dto: CreateTransferDto, actorId: string) {
    if (dto.fromLocationId === dto.toLocationId) {
      throw new BadRequestException("Locations must differ");
    }

    const reference = `TRF-${Date.now()}`;

    const transfer = await this.prisma.inventoryTransfer.create({
      data: {
        reference,
        status: InventoryTransferStatus.SUBMITTED,
        fromLocationId: dto.fromLocationId,
        toLocationId: dto.toLocationId,
        requestedById: actorId,
        note: dto.note || null,
        lines: {
          create: dto.items.map((line: any) => ({
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
      after: transfer as any
    });

    return transfer;
  }

  async updateTransferStatus(id: string, dto: UpdateTransferStatusDto, actorId: string) {
    const transfer = await this.prisma.inventoryTransfer.findUnique({
      where: { id },
      include: { lines: true }
    });
    if (!transfer) throw new NotFoundException("Transfer not found");

    if (dto.status === InventoryTransferStatus.IN_TRANSIT) {
      await this.ensureLocationAccess(actorId, transfer.fromLocationId, "issue");
    }
    if (dto.status === InventoryTransferStatus.RECEIVED) {
      await this.ensureLocationAccess(actorId, transfer.toLocationId, "issue");
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (dto.status === InventoryTransferStatus.IN_TRANSIT) {
        for (const line of transfer.lines) {
          const balance = await this.getOrCreateBalance(tx, {
            itemId: line.itemId,
            variantId: line.variantId ?? null,
            locationId: transfer.fromLocationId
          });
          if (balance.quantityOnHand - balance.quantityReserved < line.quantity) {
            throw new BadRequestException("Insufficient stock for transfer");
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
              type: InventoryMovementType.TRANSFER_OUT,
              reference: transfer.reference,
              createdById: actorId
            }
          });
        }
      }

      if (dto.status === InventoryTransferStatus.RECEIVED) {
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
              type: InventoryMovementType.TRANSFER_IN,
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
          approvedById:
            dto.status === InventoryTransferStatus.APPROVED ? actorId : transfer.approvedById,
          approvedAt:
            dto.status === InventoryTransferStatus.APPROVED ? new Date() : transfer.approvedAt,
          shippedAt:
            dto.status === InventoryTransferStatus.IN_TRANSIT ? new Date() : transfer.shippedAt,
          receivedAt:
            dto.status === InventoryTransferStatus.RECEIVED ? new Date() : transfer.receivedAt,
          note: dto.note || transfer.note
        }
      });
    });

    return { id, status: dto.status };
  }

  async createRequest(dto: CreateRequestDto, actorId: string) {
    const reference = `REQ-${Date.now()}`;
    const request = await this.prisma.inventoryRequest.create({
      data: {
        reference,
        status: InventoryRequestStatus.PENDING_APPROVAL,
        locationId: dto.locationId || null,
        requestedById: actorId,
        department: dto.department || null,
        costCenter: dto.costCenter || null,
        neededBy: dto.neededBy ? new Date(dto.neededBy) : null,
        reason: dto.reason || null,
        linkedTicketId: dto.linkedTicketId || null,
        linkedBoardCardId: dto.linkedBoardCardId || null,
        lines: {
          create: dto.lines.map((line: any) => ({
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
      after: request as any
    });

    return request;
  }

  listRequests(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where: Prisma.InventoryRequestWhereInput = {};
    if (query.status) where.status = query.status as any;

    return this.prisma.inventoryRequest.findMany({
      where,
      include: { lines: { include: { item: true, variant: true } }, requestedBy: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize
    });
  }

  async approveRequest(id: string, dto: ApproveRequestDto, actorId: string) {
    const request = await this.prisma.inventoryRequest.findUnique({
      where: { id },
      include: { lines: true }
    });
    if (!request) throw new NotFoundException("Request not found");

    if (request.locationId) {
      await this.ensureLocationAccess(actorId, request.locationId, "approve");
    }

    const status = dto.status;

    const updated = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (dto.lines && dto.lines.length) {
        for (const line of dto.lines) {
          await tx.inventoryRequestLine.updateMany({
            where: { requestId: request.id, itemId: line.itemId, variantId: line.variantId || null },
            data: { quantityApproved: line.quantityRequested }
          });
        }
      } else if (status === InventoryRequestStatus.APPROVED) {
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
      after: updated as any
    });

    return updated;
  }

  async fulfillRequest(id: string, dto: FulfillRequestDto, actorId: string) {
    const request = await this.prisma.inventoryRequest.findUnique({
      where: { id },
      include: { lines: true }
    });
    if (!request) throw new NotFoundException("Request not found");

    await this.issueStock(
      {
        locationId: dto.locationId,
        issueType: dto.issueType || "DEPARTMENT",
        issuedTo: dto.issuedTo ?? undefined,
        reference: request.reference,
        reason: dto.note,
        items: dto.items
      },
      actorId
    );

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const line of dto.items) {
        await tx.inventoryRequestLine.updateMany({
          where: { requestId: request.id, itemId: line.itemId, variantId: line.variantId || null },
          data: { quantityFulfilled: line.quantity }
        });
      }

      const updatedLines = await tx.inventoryRequestLine.findMany({
        where: { requestId: request.id }
      });
      const fullyFulfilled = updatedLines.every(
        (line: any) => (line.quantityFulfilled ?? 0) >= (line.quantityApproved ?? 0)
      );

      await tx.inventoryRequest.update({
        where: { id },
        data: {
          status: fullyFulfilled
            ? InventoryRequestStatus.FULFILLED
            : InventoryRequestStatus.PARTIALLY_FULFILLED
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

  async createAdjustment(dto: CreateAdjustmentDto, actorId: string) {
    const reference = `ADJ-${Date.now()}`;
    const adjustment = await this.prisma.inventoryAdjustment.create({
      data: {
        reference,
        status: InventoryAdjustmentStatus.SUBMITTED,
        locationId: dto.locationId,
        reason: dto.reason,
        createdById: actorId,
        note: dto.note || null,
        lines: {
          create: dto.lines.map((line: any) => ({
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
      after: adjustment as any
    });

    return adjustment;
  }

  async updateAdjustmentStatus(id: string, dto: UpdateAdjustmentStatusDto, actorId: string) {
    const adjustment = await this.prisma.inventoryAdjustment.findUnique({
      where: { id },
      include: { lines: true }
    });
    if (!adjustment) throw new NotFoundException("Adjustment not found");

    if (
      dto.status === InventoryAdjustmentStatus.APPROVED ||
      dto.status === InventoryAdjustmentStatus.APPLIED
    ) {
      await this.ensureLocationAccess(actorId, adjustment.locationId, "approve");
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (dto.status === InventoryAdjustmentStatus.APPLIED) {
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
              type: InventoryMovementType.ADJUSTMENT,
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
          approvedById:
            dto.status === InventoryAdjustmentStatus.APPROVED ? actorId : adjustment.approvedById,
          approvedAt:
            dto.status === InventoryAdjustmentStatus.APPROVED ? new Date() : adjustment.approvedAt
        }
      });
    });

    return { id, status: dto.status };
  }

  async createCountSession(dto: CreateCountSessionDto, actorId: string) {
    const reference = `CNT-${Date.now()}`;
    const session = await this.prisma.inventoryCountSession.create({
      data: {
        reference,
        status: InventoryCountStatus.IN_PROGRESS,
        locationId: dto.locationId,
        type: dto.type,
        blindCount: dto.blindCount ?? false,
        startedAt: new Date(),
        createdById: actorId
      }
    });

    return session;
  }

  async submitCount(id: string, dto: SubmitCountDto, actorId: string) {
    const session = await this.prisma.inventoryCountSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException("Count session not found");

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
        data: { status: InventoryCountStatus.SUBMITTED }
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

  async updateCountStatus(id: string, dto: UpdateCountStatusDto, actorId: string) {
    const session = await this.prisma.inventoryCountSession.findUnique({
      where: { id },
      include: { lines: true }
    });
    if (!session) throw new NotFoundException("Count session not found");

    if (dto.status === InventoryCountStatus.APPROVED) {
      await this.ensureLocationAccess(actorId, session.locationId, "approve");

      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        for (const line of session.lines) {
          if (line.variance === 0) continue;
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
              type: InventoryMovementType.COUNT,
              reference: session.reference,
              reason: "Stock count variance",
              createdById: actorId
            }
          });
        }

        await tx.inventoryCountSession.update({
          where: { id },
          data: {
            status: InventoryCountStatus.APPROVED,
            approvedById: actorId,
            approvedAt: new Date(),
            closedAt: new Date()
          }
        });
      });
    } else {
      await this.prisma.inventoryCountSession.update({
        where: { id },
        data: { status: dto.status }
      });
    }

    return { id, status: dto.status };
  }

  listTransfers(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where: Prisma.InventoryTransferWhereInput = {};
    if (query.status) where.status = query.status as any;

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

  listAdjustments(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where: Prisma.InventoryAdjustmentWhereInput = {};
    if (query.status) where.status = query.status as any;

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

  listCounts(query: PaginationQueryDto & { status?: string }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where: Prisma.InventoryCountSessionWhereInput = {};
    if (query.status) where.status = query.status as any;

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
      .map((item: any) => {
        const onHand = item.balances.reduce((sum: number, b: any) => sum + b.quantityOnHand, 0);
        return { ...item, onHand };
      })
      .filter((item: any) => item.reorderPoint > 0 && item.onHand <= item.reorderPoint);
  }

  async reportValuation() {
    const balances = await this.prisma.inventoryStockBalance.findMany({
      include: { item: true, location: true }
    });

    const totalValue = balances.reduce(
      (sum: number, b: any) => sum + b.quantityOnHand * (b.averageCost || 0),
      0
    );

    return { totalValue, balances };
  }

  listAlerts() {
    return this.prisma.inventoryAlert.findMany({
      orderBy: { createdAt: "desc" },
      include: { item: true, location: true }
    });
  }

  async setLocationAccess(dto: LocationAccessDto) {
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

  async evaluateAlerts(
    tx: Prisma.TransactionClient,
    itemId: string,
    variantId: string | null,
    locationId: string
  ) {
    const item = await tx.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) return;

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
}



