import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  ApprovalDecision,
  InventoryMovementType,
  InventoryItemType,
  Prisma,
  RequisitionItemType,
  TicketStatus,
  TicketType
} from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import {
  ApproveRequisitionDto,
  CreatePurchaseOrderDto,
  CreateRequisitionDto,
  DeliverRequisitionDto,
  PaginationQueryDto,
  RejectRequisitionDto
} from "./dto";

@Injectable()
export class RequisitionsService {
  constructor(private prisma: PrismaService) {}

  private async logAudit(data: {
    actorId?: string;
    action: string;
    entity: string;
    entityId?: string;
    data?: Prisma.JsonValue;
    ip?: string;
    requestId?: string;
  }) {
    await this.prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        data: data.data as any,
        ip: data.ip,
        requestId: data.requestId
      }
    });
  }

  private async queueEmail(to: string | null | undefined, subject: string, body: string) {
    if (!to) return;
    await this.prisma.emailOutbox.create({
      data: {
        to,
        subject,
        body
      }
    });
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
    const [totalRequisitions, pendingApprovals, ordersInProgress] = await Promise.all([
      this.prisma.ticket.count({ where: { type: TicketType.REQUISITION } }),
      this.prisma.ticket.count({
        where: {
          type: TicketType.REQUISITION,
          status: { in: [TicketStatus.SUBMITTED, TicketStatus.PENDING_APPROVAL] }
        }
      }),
      this.prisma.ticket.count({
        where: { type: TicketType.REQUISITION, status: { in: [TicketStatus.PROCUREMENT, TicketStatus.ORDERED] } }
      })
    ]);

    const deliveredTickets = await this.prisma.ticket.findMany({
      where: { type: TicketType.REQUISITION, status: TicketStatus.DELIVERED },
      include: { items: true }
    });

    const deliveredItems = deliveredTickets.reduce(
      (sum: number, ticket: any) =>
        sum + ticket.items.reduce((s: number, item: any) => s + item.quantity, 0),
      0
    );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlySpendAgg = await this.prisma.requisitionDetail.aggregate({
      where: { ticket: { type: TicketType.REQUISITION, createdAt: { gte: startOfMonth } } },
      _sum: { estimatedTotalCost: true }
    });

    const departmentGroups = await this.prisma.ticket.groupBy({
      by: ["department"],
      where: { type: TicketType.REQUISITION },
      _count: { _all: true }
    });

    const categoryGroups = await this.prisma.requisitionItem.groupBy({
      by: ["category"],
      _sum: { totalCost: true },
      where: { ticket: { type: TicketType.REQUISITION } }
    });

    const approvals = await this.prisma.ticketApproval.findMany({
      where: { ticket: { type: TicketType.REQUISITION }, decision: ApprovalDecision.APPROVED },
      include: { ticket: true }
    });

    const approvalTimes = approvals
      .filter((approval: any) => approval.decidedAt)
      .map((approval: any) =>
        approval.decidedAt
          ? (approval.decidedAt.getTime() - approval.ticket.createdAt.getTime()) / (1000 * 60 * 60)
          : 0
      );

    const avgApprovalHours = approvalTimes.length
      ? approvalTimes.reduce((sum: number, val: number) => sum + val, 0) / approvalTimes.length
      : 0;

    return {
      totalRequisitions,
      pendingApprovals,
      ordersInProgress,
      deliveredItems,
      monthlySpend: monthlySpendAgg._sum.estimatedTotalCost || 0,
      byDepartment: departmentGroups.map((group: any) => ({
        name: group.department || "Unassigned",
        value: group._count._all
      })),
      spendByCategory: categoryGroups.map((group: any) => ({
        name: group.category || "Uncategorised",
        value: group._sum.totalCost || 0
      })),
      approvalMetrics: {
        averageHours: avgApprovalHours
      }
    };
  }

  async list(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const where: Prisma.TicketWhereInput = {
      type: TicketType.REQUISITION
    };

    if (query.status) {
      where.status = query.status as TicketStatus;
    }
    if (query.department) {
      where.department = { contains: query.department, mode: "insensitive" };
    }
    if (query.priority) {
      where.priority = { contains: query.priority, mode: "insensitive" };
    }
    if (query.search) {
      where.OR = [
        { reference: { contains: query.search, mode: "insensitive" } },
        { title: { contains: query.search, mode: "insensitive" } },
        { department: { contains: query.search, mode: "insensitive" } },
        { requisition: { vendorPreference: { contains: query.search, mode: "insensitive" } } },
        { items: { some: { itemName: { contains: query.search, mode: "insensitive" } } } }
      ];
    }

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        include: {
          createdBy: true,
          requisition: true,
          items: true
        }
      }),
      this.prisma.ticket.count({ where })
    ]);

    const items = tickets.map((ticket: any) => {
      const estimatedTotal = ticket.items.reduce(
        (sum: number, item: any) =>
          sum + (item.totalCost ?? item.estimatedUnitCost ?? 0) * item.quantity,
        0
      );
      return {
        ...ticket,
        estimatedTotal: ticket.requisition?.estimatedTotalCost ?? estimatedTotal
      };
    });

    return { items, total, page, pageSize };
  }

  async get(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: true,
        assignedTo: true,
        requisition: true,
        items: true,
        approvals: { include: { approver: true }, orderBy: { decidedAt: "asc" } },
        purchaseOrders: { include: { items: true } }
      }
    });
    if (!ticket || ticket.type !== TicketType.REQUISITION) {
      throw new NotFoundException("Requisition not found");
    }
    return ticket;
  }

  async create(dto: CreateRequisitionDto, actorId: string) {
    const itemsTotal = dto.items.reduce(
      (sum: number, item: any) =>
        sum + (item.totalCost ?? item.estimatedUnitCost ?? 0) * item.quantity,
      0
    );

    const status = dto.status ?? TicketStatus.SUBMITTED;

    const ticket = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.ticket.create({
        data: {
          type: TicketType.REQUISITION,
          title: dto.title,
          description: dto.description || null,
          department: dto.department || null,
          priority: dto.priority || "Medium",
          status,
          createdById: actorId,
          requisition: {
            create: {
              budgetCode: dto.budgetCode || null,
              requiredDate: dto.requiredDate ? new Date(dto.requiredDate) : null,
              deliveryLocation: dto.deliveryLocation || null,
              vendorPreference: dto.vendorPreference || null,
              procurementStatus: dto.procurementStatus || "Submitted",
              approvalLevel: dto.approvalLevel ?? 1,
              estimatedTotalCost: dto.estimatedTotalCost ?? itemsTotal
            }
          },
          items: {
            create: dto.items.map((item) => ({
              itemName: item.itemName,
              category: item.category || null,
              quantity: item.quantity,
              estimatedUnitCost: item.estimatedUnitCost ?? null,
              totalCost: item.totalCost ?? null,
              itemType: item.itemType,
              inventoryItemId: item.inventoryItemId || null
            }))
          }
        }
      });

      const reference = `REQ-${created.sequence.toString().padStart(5, "0")}`;
      await tx.ticket.update({ where: { id: created.id }, data: { reference } });

      return tx.ticket.findUnique({
        where: { id: created.id },
        include: { requisition: true, items: true, createdBy: true }
      });
    });

    await this.logAudit({
      actorId,
      action: "requisition.create",
      entity: "Ticket",
      entityId: ticket?.id,
      data: ticket as any
    });

    const requesterEmail = ticket?.createdBy?.email;
    await this.queueEmail(
      requesterEmail,
      `Requisition ${ticket?.reference} submitted`,
      `Your requisition ${ticket?.reference} has been submitted for approval.`
    );

    return ticket;
  }

  async approve(id: string, dto: ApproveRequisitionDto, actorId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { requisition: true, createdBy: true }
    });
    if (!ticket || ticket.type !== TicketType.REQUISITION) {
      throw new NotFoundException("Requisition not found");
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.ticketApproval.create({
        data: {
          ticketId: id,
          approverId: actorId,
          approvalRole: dto.approvalRole,
          decision: ApprovalDecision.APPROVED,
          comments: dto.comments || null,
          decidedAt: new Date()
        }
      });

      await tx.ticket.update({
        where: { id },
        data: { status: TicketStatus.APPROVED }
      });

      await tx.requisitionDetail.update({
        where: { ticketId: id },
        data: { procurementStatus: "Approved" }
      });
    });

    await this.logAudit({
      actorId,
      action: "requisition.approve",
      entity: "Ticket",
      entityId: id,
      data: { approvalRole: dto.approvalRole }
    });

    await this.queueEmail(
      ticket.createdBy.email,
      `Requisition ${ticket.reference} approved`,
      `Your requisition ${ticket.reference} has been approved.`
    );

    return { id, status: TicketStatus.APPROVED };
  }

  async reject(id: string, dto: RejectRequisitionDto, actorId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { createdBy: true }
    });
    if (!ticket || ticket.type !== TicketType.REQUISITION) {
      throw new NotFoundException("Requisition not found");
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.ticketApproval.create({
        data: {
          ticketId: id,
          approverId: actorId,
          approvalRole: dto.approvalRole,
          decision: ApprovalDecision.REJECTED,
          comments: dto.comments || null,
          decidedAt: new Date()
        }
      });

      await tx.ticket.update({ where: { id }, data: { status: TicketStatus.REJECTED } });

      await tx.requisitionDetail.update({
        where: { ticketId: id },
        data: { procurementStatus: "Rejected" }
      });
    });

    await this.logAudit({
      actorId,
      action: "requisition.reject",
      entity: "Ticket",
      entityId: id,
      data: { approvalRole: dto.approvalRole }
    });

    await this.queueEmail(
      ticket.createdBy.email,
      `Requisition ${ticket.reference} rejected`,
      `Your requisition ${ticket.reference} was rejected. ${dto.comments || ""}`
    );

    return { id, status: TicketStatus.REJECTED };
  }

  async createPurchaseOrder(id: string, dto: CreatePurchaseOrderDto, actorId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { items: true, requisition: true }
    });
    if (!ticket || ticket.type !== TicketType.REQUISITION) {
      throw new NotFoundException("Requisition not found");
    }

    const reference = `PO-${ticket.sequence.toString().padStart(5, "0")}`;

    const po = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.purchaseOrder.create({
        data: {
          ticketId: id,
          reference,
          vendor: dto.vendor || ticket.requisition?.vendorPreference || null,
          expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : null,
          status: "ORDERED",
          createdById: actorId,
          items: {
            create: ticket.items.map((item: any) => ({
              requisitionItemId: item.id,
              name: item.itemName,
              quantity: item.quantity,
              unitCost: item.estimatedUnitCost ?? null,
              totalCost: item.totalCost ?? (item.estimatedUnitCost ?? 0) * item.quantity
            }))
          }
        },
        include: { items: true }
      });

      await tx.ticket.update({ where: { id }, data: { status: TicketStatus.ORDERED } });
      await tx.requisitionDetail.update({
        where: { ticketId: id },
        data: { procurementStatus: "Ordered" }
      });

      return created;
    });

    await this.logAudit({
      actorId,
      action: "requisition.purchase",
      entity: "PurchaseOrder",
      entityId: po.id,
      data: po as any
    });

    return po;
  }

  async deliver(id: string, dto: DeliverRequisitionDto, actorId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { items: true, requisition: true }
    });
    if (!ticket || ticket.type !== TicketType.REQUISITION) {
      throw new NotFoundException("Requisition not found");
    }

    const location = await this.prisma.inventoryLocation.findUnique({ where: { id: dto.locationId } });
    if (!location || !location.isActive) {
      throw new BadRequestException("Invalid delivery location");
    }

    const unit = await this.prisma.inventoryUnit.findFirst({ where: { name: "Each" } });
    const overrideMap = new Map(
      (dto.items || []).map((item) => [item.requisitionItemId, item])
    );

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let index = 1;
      for (const reqItem of ticket.items) {
        const override = overrideMap.get(reqItem.id);
        const quantity = override?.quantity ?? reqItem.quantity;
        if (!quantity || quantity <= 0) continue;
        const unitCost = override?.unitCost ?? reqItem.estimatedUnitCost ?? 0;
        const itemType = reqItem.itemType;

        if (itemType === RequisitionItemType.EXISTING_INVENTORY) {
          const inventoryItemId = override?.inventoryItemId ?? reqItem.inventoryItemId;
          if (!inventoryItemId) {
            throw new BadRequestException("Inventory item required for existing inventory line");
          }

          const balance = await this.getOrCreateBalance(tx, {
            itemId: inventoryItemId,
            locationId: dto.locationId,
            variantId: null
          });

          const newQty = balance.quantityOnHand + quantity;
          const newAvgCost = unitCost
            ? ((balance.averageCost || 0) * balance.quantityOnHand + unitCost * quantity) /
              Math.max(newQty, 1)
            : balance.averageCost || 0;

          await tx.inventoryStockBalance.update({
            where: { id: balance.id },
            data: { quantityOnHand: newQty, averageCost: newAvgCost }
          });

          await tx.inventoryStockMovement.create({
            data: {
              itemId: inventoryItemId,
              locationToId: dto.locationId,
              quantity,
              unitCost: unitCost || null,
              type: InventoryMovementType.RECEIVE,
              reference: ticket.reference || `REQ-${ticket.sequence}`,
              reason: "Requisition delivery",
              createdById: actorId
            }
          });

          await tx.inventoryTransaction.create({
            data: {
              inventoryItemId,
              ticketId: ticket.id,
              transactionType: "requisition_delivery",
              quantity,
              createdById: actorId
            }
          });
        } else {
          const category = reqItem.category
            ? await tx.inventoryCategory.findFirst({ where: { name: reqItem.category } })
            : null;
          const skuBase = `REQ-${ticket.sequence.toString().padStart(4, "0")}-${index}`;
          index += 1;

          let sku = skuBase;
          const existingSku = await tx.inventoryItem.findUnique({ where: { sku } });
          if (existingSku) {
            sku = `${skuBase}-${Date.now()}`;
          }

          const newItem = await tx.inventoryItem.create({
            data: {
              name: reqItem.itemName,
              sku,
              description: ticket.title,
              categoryId: category?.id || null,
              unitId: unit?.id || null,
              type: itemType === RequisitionItemType.CONSUMABLE ? InventoryItemType.CONSUMABLE : InventoryItemType.ASSET,
              tracking: "NONE",
              reorderPoint: 0,
              minStock: 0,
              maxStock: null,
              isTrackable: true
            }
          });

          const balance = await this.getOrCreateBalance(tx, {
            itemId: newItem.id,
            locationId: dto.locationId,
            variantId: null
          });

          await tx.inventoryStockBalance.update({
            where: { id: balance.id },
            data: { quantityOnHand: balance.quantityOnHand + quantity, averageCost: unitCost }
          });

          await tx.inventoryStockMovement.create({
            data: {
              itemId: newItem.id,
              locationToId: dto.locationId,
              quantity,
              unitCost: unitCost || null,
              type: InventoryMovementType.RECEIVE,
              reference: ticket.reference || `REQ-${ticket.sequence}`,
              reason: "Requisition delivery",
              createdById: actorId
            }
          });

          await tx.inventoryTransaction.create({
            data: {
              inventoryItemId: newItem.id,
              ticketId: ticket.id,
              transactionType: "requisition_delivery",
              quantity,
              createdById: actorId
            }
          });

          await tx.requisitionItem.update({
            where: { id: reqItem.id },
            data: { inventoryItemId: newItem.id }
          });
        }
      }

      await tx.ticket.update({
        where: { id },
        data: { status: TicketStatus.DELIVERED }
      });

      await tx.requisitionDetail.update({
        where: { ticketId: id },
        data: { procurementStatus: "Delivered" }
      });

      await tx.purchaseOrder.updateMany({
        where: { ticketId: id },
        data: { status: "RECEIVED" }
      });
    });

    await this.logAudit({
      actorId,
      action: "requisition.deliver",
      entity: "Ticket",
      entityId: id,
      data: { locationId: dto.locationId }
    });

    return { id, status: TicketStatus.DELIVERED };
  }
}
