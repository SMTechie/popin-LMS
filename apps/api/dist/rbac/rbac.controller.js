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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const rbac_service_1 = require("./rbac.service");
const dto_1 = require("./dto");
let RbacController = class RbacController {
    rbac;
    constructor(rbac) {
        this.rbac = rbac;
    }
    listRoles() {
        return this.rbac.listRoles();
    }
    createRole(dto) {
        return this.rbac.createRole(dto.name, dto.description);
    }
    updatePermissions(dto) {
        return this.rbac.updateRolePermissions(dto);
    }
    assignRole(dto) {
        return this.rbac.assignRole(dto.userId, dto.roleId);
    }
};
exports.RbacController = RbacController;
__decorate([
    (0, common_1.Get)("roles"),
    (0, permissions_decorator_1.Permissions)({ module: "licensing", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Post)("roles"),
    (0, permissions_decorator_1.Permissions)({ module: "licensing", action: "create" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "createRole", null);
__decorate([
    (0, common_1.Post)("roles/permissions"),
    (0, permissions_decorator_1.Permissions)({ module: "licensing", action: "edit" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateRolePermissionsDto]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "updatePermissions", null);
__decorate([
    (0, common_1.Post)("roles/assign"),
    (0, permissions_decorator_1.Permissions)({ module: "licensing", action: "edit" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AssignRoleDto]),
    __metadata("design:returntype", void 0)
], RbacController.prototype, "assignRole", null);
exports.RbacController = RbacController = __decorate([
    (0, common_1.Controller)("rbac"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [rbac_service_1.RbacService])
], RbacController);
//# sourceMappingURL=rbac.controller.js.map