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
exports.IdentityController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
const identity_service_1 = require("./identity.service");
let IdentityController = class IdentityController {
    identity;
    constructor(identity) {
        this.identity = identity;
    }
    list() { return this.identity.list(); }
    configure(provider, dto, req) { return this.identity.configure(provider, dto, req.user.id); }
    disconnect(provider, req) { return this.identity.disconnect(provider, req.user.id); }
    mapping(provider, dto, req) { return this.identity.addMapping(provider, dto, req.user.id); }
    sync(provider, req) { return this.identity.sync(provider, req.user.id); }
};
exports.IdentityController = IdentityController;
__decorate([
    (0, common_1.Get)("providers"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IdentityController.prototype, "list", null);
__decorate([
    (0, common_1.Put)("providers/:provider"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ConfigureIdentityProviderDto, Object]),
    __metadata("design:returntype", void 0)
], IdentityController.prototype, "configure", null);
__decorate([
    (0, common_1.Delete)("providers/:provider"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IdentityController.prototype, "disconnect", null);
__decorate([
    (0, common_1.Post)("providers/:provider/role-mappings"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.CreateRoleMappingDto, Object]),
    __metadata("design:returntype", void 0)
], IdentityController.prototype, "mapping", null);
__decorate([
    (0, common_1.Post)("providers/:provider/sync"),
    __param(0, (0, common_1.Param)("provider")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IdentityController.prototype, "sync", null);
exports.IdentityController = IdentityController = __decorate([
    (0, common_1.Controller)("identity"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.manage" }),
    __metadata("design:paramtypes", [identity_service_1.IdentityService])
], IdentityController);
//# sourceMappingURL=identity.controller.js.map