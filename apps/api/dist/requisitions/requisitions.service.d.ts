import { PrismaService } from "../common/prisma.service";
import { ApproveRequisitionDto, CreatePurchaseOrderDto, CreateRequisitionDto, DeliverRequisitionDto, PaginationQueryDto, RejectRequisitionDto } from "./dto";
export declare class RequisitionsService {
    private prisma;
    constructor(prisma: PrismaService);
    private logAudit;
    private queueEmail;
    private getOrCreateBalance;
    overview(): Promise<{
        totalRequisitions: number;
        pendingApprovals: number;
        ordersInProgress: number;
        deliveredItems: number;
        monthlySpend: number;
        byDepartment: {
            name: any;
            value: any;
        }[];
        spendByCategory: {
            name: any;
            value: any;
        }[];
        approvalMetrics: {
            averageHours: number;
        };
    }>;
    list(query: PaginationQueryDto): Promise<{
        items: any[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    get(id: string): Promise<{
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
        assignedTo: {
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
        requisition: {
            id: string;
            estimatedTotalCost: number | null;
            approvalLevel: number | null;
            ticketId: string;
            budgetCode: string | null;
            requiredDate: Date | null;
            deliveryLocation: string | null;
            vendorPreference: string | null;
            procurementStatus: string | null;
        } | null;
        items: {
            id: string;
            category: string | null;
            ticketId: string;
            itemName: string;
            quantity: number;
            estimatedUnitCost: number | null;
            totalCost: number | null;
            itemType: import("@prisma/client").$Enums.RequisitionItemType;
            inventoryItemId: string | null;
        }[];
        approvals: ({
            approver: {
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
        } & {
            id: string;
            ticketId: string;
            approverId: string;
            approvalRole: string;
            decision: import("@prisma/client").$Enums.ApprovalDecision;
            comments: string | null;
            decidedAt: Date | null;
        })[];
        purchaseOrders: ({
            items: {
                id: string;
                name: string;
                quantity: number;
                totalCost: number | null;
                purchaseOrderId: string;
                requisitionItemId: string | null;
                unitCost: number | null;
            }[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.PurchaseOrderStatus;
            reference: string;
            createdById: string | null;
            ticketId: string;
            vendor: string | null;
            orderDate: Date;
            expectedDeliveryDate: Date | null;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        department: string | null;
        type: import("@prisma/client").$Enums.TicketType;
        sequence: number;
        reference: string | null;
        category: string | null;
        title: string;
        description: string | null;
        priority: string | null;
        createdById: string;
        assignedToId: string | null;
    }>;
    create(dto: CreateRequisitionDto, actorId: string): Promise<({
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
        requisition: {
            id: string;
            estimatedTotalCost: number | null;
            approvalLevel: number | null;
            ticketId: string;
            budgetCode: string | null;
            requiredDate: Date | null;
            deliveryLocation: string | null;
            vendorPreference: string | null;
            procurementStatus: string | null;
        } | null;
        items: {
            id: string;
            category: string | null;
            ticketId: string;
            itemName: string;
            quantity: number;
            estimatedUnitCost: number | null;
            totalCost: number | null;
            itemType: import("@prisma/client").$Enums.RequisitionItemType;
            inventoryItemId: string | null;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.TicketStatus;
        createdAt: Date;
        updatedAt: Date;
        department: string | null;
        type: import("@prisma/client").$Enums.TicketType;
        sequence: number;
        reference: string | null;
        category: string | null;
        title: string;
        description: string | null;
        priority: string | null;
        createdById: string;
        assignedToId: string | null;
    }) | null>;
    approve(id: string, dto: ApproveRequisitionDto, actorId: string): Promise<{
        id: string;
        status: "APPROVED";
    }>;
    reject(id: string, dto: RejectRequisitionDto, actorId: string): Promise<{
        id: string;
        status: "REJECTED";
    }>;
    createPurchaseOrder(id: string, dto: CreatePurchaseOrderDto, actorId: string): Promise<{
        items: {
            id: string;
            name: string;
            quantity: number;
            totalCost: number | null;
            purchaseOrderId: string;
            requisitionItemId: string | null;
            unitCost: number | null;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.PurchaseOrderStatus;
        reference: string;
        createdById: string | null;
        ticketId: string;
        vendor: string | null;
        orderDate: Date;
        expectedDeliveryDate: Date | null;
    }>;
    deliver(id: string, dto: DeliverRequisitionDto, actorId: string): Promise<{
        id: string;
        status: "DELIVERED";
    }>;
}
