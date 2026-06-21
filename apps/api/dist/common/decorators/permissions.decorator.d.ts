import { ExtendedPermissionAction, ModuleKey } from "@popin/shared";
export type PermissionRequirement = {
    module: ModuleKey;
    action: ExtendedPermissionAction;
    boardIdParam?: string;
    stageIdParam?: string;
};
export declare const PERMISSIONS_KEY = "permissions";
export declare const Permissions: (...permissions: PermissionRequirement[]) => import("@nestjs/common").CustomDecorator<string>;
