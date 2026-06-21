"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let RbacService = class RbacService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hasPermission(userId, scope) {
        const roleIds = await this.prisma.userRole.findMany({
            where: { userId },
            select: { roleId: true }
        });
        if (roleIds.length === 0)
            return false;
        const permissions = await this.prisma.rolePermission.findMany({
            where: {
                roleId: { in: roleIds.map((r) => r.roleId) },
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
    async isModuleEnabled(moduleKey) {
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
    createRole(name, description) {
        return this.prisma.role.create({ data: { name, description: description || null } });
    }
    async assignRole(userId, roleId) {
        return this.prisma.userRole.upsert({
            where: { userId_roleId: { userId, roleId } },
            update: {},
            create: { userId, roleId }
        });
    }
    async updateRolePermissions(dto) {
        const permissionIds = await Promise.all(dto.permissions.map(async (perm) => {
            const permission = await this.prisma.permission.upsert({
                where: {
                    module_action_boardId_stageId: {
                        module: perm.module,
                        action: perm.action,
                        boardId: (perm.boardId ?? null),
                        stageId: (perm.stageId ?? null)
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
        }));
        await this.prisma.rolePermission.deleteMany({ where: { roleId: dto.roleId } });
        await this.prisma.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({
                roleId: dto.roleId,
                permissionId
            }))
        });
        return this.listRoles();
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map