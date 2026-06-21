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
exports.RequisitionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const requisitions_service_1 = require("./requisitions.service");
const dto_1 = require("./dto");
let RequisitionsController = class RequisitionsController {
    requisitions;
    constructor(requisitions) {
        this.requisitions = requisitions;
    }
    overview() {
        return this.requisitions.overview();
    }
    list(query) {
        return this.requisitions.list(query);
    }
    get(id) {
        return this.requisitions.get(id);
    }
    create(dto, req) {
        return this.requisitions.create(dto, req.user.id);
    }
    approve(id, dto, req) {
        return this.requisitions.approve(id, dto, req.user.id);
    }
    reject(id, dto, req) {
        return this.requisitions.reject(id, dto, req.user.id);
    }
};
exports.RequisitionsController = RequisitionsController;
__decorate([
    (0, common_1.Get)("requisitions/overview"),
    (0, permissions_decorator_1.Permissions)({ module: "requisition", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RequisitionsController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("requisitions"),
    (0, permissions_decorator_1.Permissions)({ module: "requisition", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], RequisitionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("requisitions/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "requisition", action: "view" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequisitionsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)("requisitions"),
    (0, permissions_decorator_1.Permissions)({ module: "requisition", action: "create" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRequisitionDto, Object]),
    __metadata("design:returntype", void 0)
], RequisitionsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    (0, permissions_decorator_1.Permissions)({ module: "requisition", action: "approve" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveRequisitionDto, Object]),
    __metadata("design:returntype", void 0)
], RequisitionsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(":id/reject"),
    (0, permissions_decorator_1.Permissions)({ module: "requisition", action: "approve" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.RejectRequisitionDto, Object]),
    __metadata("design:returntype", void 0)
], RequisitionsController.prototype, "reject", null);
exports.RequisitionsController = RequisitionsController = __decorate([
    (0, common_1.Controller)("tickets"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [requisitions_service_1.RequisitionsService])
], RequisitionsController);
//# sourceMappingURL=requisitions.controller.js.map