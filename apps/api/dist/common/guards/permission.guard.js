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
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const allow_anon_decorator_1 = require("../decorators/allow-anon.decorator");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const rbac_service_1 = require("../../rbac/rbac.service");
let PermissionGuard = class PermissionGuard {
    reflector;
    rbac;
    constructor(reflector, rbac) {
        this.reflector = reflector;
        this.rbac = rbac;
    }
    async canActivate(context) {
        const allowAnon = this.reflector.getAllAndOverride(allow_anon_decorator_1.ALLOW_ANON_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            if (allowAnon)
                return true;
            throw new common_1.UnauthorizedException();
        }
        const permissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!permissions || permissions.length === 0) {
            return true;
        }
        const hasAll = await Promise.all(permissions.map(async (perm) => {
            const enabled = await this.rbac.isModuleEnabled(perm.module);
            if (!enabled)
                return false;
            return this.rbac.hasPermission(user.id, {
                module: perm.module,
                action: perm.action,
                boardId: perm.boardIdParam ? req.params[perm.boardIdParam] : undefined,
                stageId: perm.stageIdParam ? req.params[perm.stageIdParam] : undefined
            });
        }));
        if (hasAll.every(Boolean))
            return true;
        throw new common_1.ForbiddenException("Insufficient permissions");
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector, rbac_service_1.RbacService])
], PermissionGuard);
//# sourceMappingURL=permission.guard.js.map