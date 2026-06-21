export declare class CreateRuleDto {
    name: string;
    trigger: string;
    conditions: Record<string, unknown>[];
    actions: Record<string, unknown>[];
    boardId?: string;
}
