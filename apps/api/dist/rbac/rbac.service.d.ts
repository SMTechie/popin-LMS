import { PrismaService } from "../common/prisma.service";
import { UpdateRolePermissionsDto } from "./dto";
import { PermissionScope } from "@popin/shared";
export declare class RbacService {
    private prisma;
    constructor(prisma: PrismaService);
    hasPermission(userId: string, scope: PermissionScope): Promise<boolean>;
    isModuleEnabled(moduleKey: string): Promise<boolean>;
    listRoles(): import("@prisma/client").Prisma.PrismaPromise<({
        permissions: ({
            permission: {
                id: string;
                action: string;
                module: string;
                boardId: string | null;
                stageId: string | null;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[]>;
    createRole(name: string, description?: string): import("@prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    assignRole(userId: string, roleId: string): Promise<{
        roleId: string;
        userId: string;
    }>;
    updateRolePermissions(dto: UpdateRolePermissionsDto): Promise<({
        permissions: ({
            permission: {
                id: string;
                action: string;
                module: string;
                boardId: string | null;
                stageId: string | null;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[]>;
}
