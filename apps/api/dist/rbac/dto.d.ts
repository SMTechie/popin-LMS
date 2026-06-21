import { ModuleKey, PermissionAction } from "@popin/shared";
export declare class CreateRoleDto {
    name: string;
    description?: string;
}
export declare class AssignRoleDto {
    userId: string;
    roleId: string;
}
export declare class UpsertPermissionDto {
    module: ModuleKey;
    action: PermissionAction;
    boardId?: string;
    stageId?: string;
}
export declare class UpdateRolePermissionsDto {
    roleId: string;
    permissions: UpsertPermissionDto[];
}
