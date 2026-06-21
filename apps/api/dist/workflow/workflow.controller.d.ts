import { WorkflowService } from "./workflow.service";
import { CreateRuleDto } from "./dto";
export declare class WorkflowController {
    private workflow;
    constructor(workflow: WorkflowService);
    listRules(): Promise<({
        versions: {
            id: string;
            createdAt: Date;
            createdById: string;
            version: number;
            conditions: import("@prisma/client/runtime/library").JsonValue;
            actions: import("@prisma/client/runtime/library").JsonValue;
            ruleId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.AutomationStatus;
        boardId: string | null;
        trigger: string;
    })[]>;
    createRule(dto: CreateRuleDto, user: {
        id: string;
    }): Promise<{
        versions: {
            id: string;
            createdAt: Date;
            createdById: string;
            version: number;
            conditions: import("@prisma/client/runtime/library").JsonValue;
            actions: import("@prisma/client/runtime/library").JsonValue;
            ruleId: string;
        }[];
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.AutomationStatus;
        boardId: string | null;
        trigger: string;
    }>;
}
