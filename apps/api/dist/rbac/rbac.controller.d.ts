import { RbacService } from "./rbac.service";
import { AssignRoleDto, CreateRoleDto, UpdateRolePermissionsDto } from "./dto";
export declare class RbacController {
    private rbac;
    constructor(rbac: RbacService);
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
    createRole(dto: CreateRoleDto): import("@prisma/client").Prisma.Prisma__RoleClient<{
        id: string;
        name: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updatePermissions(dto: UpdateRolePermissionsDto): Promise<({
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
    assignRole(dto: AssignRoleDto): Promise<{
        roleId: string;
        userId: string;
    }>;
}
