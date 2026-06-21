import { RequisitionsService } from "./requisitions.service";
import { ApproveRequisitionDto, CreateRequisitionDto, PaginationQueryDto, RejectRequisitionDto } from "./dto";
export declare class RequisitionsController {
    private readonly requisitions;
    constructor(requisitions: RequisitionsService);
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
        approvals: ({
            approver: {
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
        } & {
            id: string;
            decidedAt: Date | null;
            comments: string | null;
            ticketId: string;
            approverId: string;
            approvalRole: string;
            decision: import("@prisma/client").$Enums.ApprovalDecision;
        })[];
        purchaseOrders: ({
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
        })[];
        items: {
            id: string;
            category: string | null;
            quantity: number;
            ticketId: string;
            itemName: string;
            estimatedUnitCost: number | null;
            totalCost: number | null;
            itemType: import("@prisma/client").$Enums.RequisitionItemType;
            inventoryItemId: string | null;
        }[];
        assignedTo: {
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
        requisition: {
            id: string;
            ticketId: string;
            budgetCode: string | null;
            requiredDate: Date | null;
            deliveryLocation: string | null;
            vendorPreference: string | null;
            procurementStatus: string | null;
            approvalLevel: number | null;
            estimatedTotalCost: number | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.TicketStatus;
        description: string | null;
        updatedAt: Date;
        priority: string | null;
        createdById: string;
        category: string | null;
        title: string;
        assignedToId: string | null;
        type: import("@prisma/client").$Enums.TicketType;
        reference: string | null;
        sequence: number;
        department: string | null;
    }>;
    create(dto: CreateRequisitionDto, req: any): Promise<({
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
        items: {
            id: string;
            category: string | null;
            quantity: number;
            ticketId: string;
            itemName: string;
            estimatedUnitCost: number | null;
            totalCost: number | null;
            itemType: import("@prisma/client").$Enums.RequisitionItemType;
            inventoryItemId: string | null;
        }[];
        requisition: {
            id: string;
            ticketId: string;
            budgetCode: string | null;
            requiredDate: Date | null;
            deliveryLocation: string | null;
            vendorPreference: string | null;
            procurementStatus: string | null;
            approvalLevel: number | null;
            estimatedTotalCost: number | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.TicketStatus;
        description: string | null;
        updatedAt: Date;
        priority: string | null;
        createdById: string;
        category: string | null;
        title: string;
        assignedToId: string | null;
        type: import("@prisma/client").$Enums.TicketType;
        reference: string | null;
        sequence: number;
        department: string | null;
    }) | null>;
    approve(id: string, dto: ApproveRequisitionDto, req: any): Promise<{
        id: string;
        status: "APPROVED";
    }>;
    reject(id: string, dto: RejectRequisitionDto, req: any): Promise<{
        id: string;
        status: "REJECTED";
    }>;
}
