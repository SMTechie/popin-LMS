import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { UpdateRolePermissionsDto } from "./dto";
import { PermissionScope } from "@popin/shared";

@Injectable()
export class RbacService {
  constructor(private prisma: PrismaService) {}

  async hasPermission(userId: string, scope: PermissionScope): Promise<boolean> {
    const roleIds = await this.prisma.userRole.findMany({
      where: { userId },
      select: { roleId: true }
    });

    if (roleIds.length === 0) return false;

    const permissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId: { in: roleIds.map((r: { roleId: string }) => r.roleId) },
        permission: {
          module: scope.module,
          action: scope.action,
          AND: [
            {
              OR: [{ boardId: scope.boardId || null }, { boardId: null }]
            },
            {
              OR: [{ stageId: scope.stageId || null }, { stageId: null }]
            }
          ]
        }
      },
      include: { permission: true }
    });

    return permissions.length > 0;
  }

  async isModuleEnabled(moduleKey: string) {
    const toggle = await this.prisma.moduleToggle.findUnique({ where: { moduleKey } });
    return toggle ? toggle.enabled : true;
  }

  listRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: { include: { permission: true } }
      }
    });
  }

  createRole(name: string, description?: string) {
    return this.prisma.role.create({ data: { name, description: description || null } });
  }

  async assignRole(userId: string, roleId: string) {
    return this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: {},
      create: { userId, roleId }
    });
  }

  async updateRolePermissions(dto: UpdateRolePermissionsDto) {
    const permissionIds = await Promise.all(
      dto.permissions.map(async (perm) => {
        const permission = await this.prisma.permission.upsert({
          where: {
            module_action_boardId_stageId: {
              module: perm.module,
              action: perm.action,
              boardId: (perm.boardId ?? null) as any,
              stageId: (perm.stageId ?? null) as any
            }
          },
          update: {},
          create: {
            module: perm.module,
            action: perm.action,
            boardId: perm.boardId ?? undefined,
            stageId: perm.stageId ?? undefined
          }
        });

        return permission.id;
      })
    );

    await this.prisma.rolePermission.deleteMany({ where: { roleId: dto.roleId } });

    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId: dto.roleId,
        permissionId
      }))
    });

    return this.listRoles();
  }
}
