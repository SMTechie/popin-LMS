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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
let InventoryController = class InventoryController {
    inventory;
    constructor(inventory) {
        this.inventory = inventory;
    }
    overview() {
        return this.inventory.overview();
    }
    listItems(query) {
        return this.inventory.listItems(query);
    }
    getItem(id) {
        return this.inventory.getItem(id);
    }
    createItem(dto, req) {
        return this.inventory.createItem(dto, req.user.id);
    }
    updateItem(id, dto, req) {
        return this.inventory.updateItem(id, dto, req.user.id);
    }
    archiveItem(id, req) {
        return this.inventory.archiveItem(id, req.user.id);
    }
    listCategories() {
        return this.inventory.listCategories();
    }
    createCategory(dto) {
        return this.inventory.createCategory(dto);
    }
    listUnits() {
        return this.inventory.listUnits();
    }
    createUnit(dto) {
        return this.inventory.createUnit(dto);
    }
    listLocations() {
        return this.inventory.listLocations();
    }
    createLocation(dto) {
        return this.inventory.createLocation(dto);
    }
    updateLocation(id, dto) {
        return this.inventory.updateLocation(id, dto);
    }
    setLocationAccess(dto) {
        return this.inventory.setLocationAccess(dto);
    }
    listBalances(locationId) {
        return this.inventory.listBalances(locationId);
    }
    listMovements(query) {
        return this.inventory.listMovements(query);
    }
    receiveStock(dto, req) {
        return this.inventory.receiveStock(dto, req.user.id);
    }
    issueStock(dto, req) {
        return this.inventory.issueStock(dto, req.user.id);
    }
    createTransfer(dto, req) {
        return this.inventory.createTransfer(dto, req.user.id);
    }
    updateTransferStatus(id, dto, req) {
        return this.inventory.updateTransferStatus(id, dto, req.user.id);
    }
    listRequests(query) {
        return this.inventory.listRequests(query);
    }
    listTransfers(query) {
        return this.inventory.listTransfers(query);
    }
    listAdjustments(query) {
        return this.inventory.listAdjustments(query);
    }
    listCounts(query) {
        return this.inventory.listCounts(query);
    }
    createRequest(dto, req) {
        return this.inventory.createRequest(dto, req.user.id);
    }
    approveRequest(id, dto, req) {
        return this.inventory.approveRequest(id, dto, req.user.id);
    }
    fulfillRequest(id, dto, req) {
        return this.inventory.fulfillRequest(id, dto, req.user.id);
    }
    createAdjustment(dto, req) {
        return this.inventory.createAdjustment(dto, req.user.id);
    }
    updateAdjustmentStatus(id, dto, req) {
        return this.inventory.updateAdjustmentStatus(id, dto, req.user.id);
    }
    createCountSession(dto, req) {
        return this.inventory.createCountSession(dto, req.user.id);
    }
    submitCount(id, dto, req) {
        return this.inventory.submitCount(id, dto, req.user.id);
    }
    updateCountStatus(id, dto, req) {
        return this.inventory.updateCountStatus(id, dto, req.user.id);
    }
    listAlerts() {
        return this.inventory.listAlerts();
    }
    lowStockReport() {
        return this.inventory.reportLowStock();
    }
    valuationReport() {
        return this.inventory.reportValuation();
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)("overview"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("items"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listItems", null);
__decorate([
    (0, common_1.Get)("items/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getItem", null);
__decorate([
    (0, common_1.Post)("items"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.item.create" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInventoryItemDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createItem", null);
__decorate([
    (0, common_1.Patch)("items/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.item.update" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateInventoryItemDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)("items/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.item.archive" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "archiveItem", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listCategories", null);
__decorate([
    (0, common_1.Post)("categories"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.settings.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInventoryCategoryDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)("units"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listUnits", null);
__decorate([
    (0, common_1.Post)("units"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.settings.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInventoryUnitDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createUnit", null);
__decorate([
    (0, common_1.Get)("locations"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listLocations", null);
__decorate([
    (0, common_1.Post)("locations"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.location.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateInventoryLocationDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Patch)("locations/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.location.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateInventoryLocationDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)("location-access"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.location.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LocationAccessDto]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "setLocationAccess", null);
__decorate([
    (0, common_1.Get)("balances"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)("locationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listBalances", null);
__decorate([
    (0, common_1.Get)("movements"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listMovements", null);
__decorate([
    (0, common_1.Post)("stock/receive"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.stock.receive" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ReceiveStockDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "receiveStock", null);
__decorate([
    (0, common_1.Post)("stock/issue"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.stock.issue" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.IssueStockDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "issueStock", null);
__decorate([
    (0, common_1.Post)("transfers"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.stock.transfer" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTransferDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createTransfer", null);
__decorate([
    (0, common_1.Patch)("transfers/:id/status"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.stock.transfer" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTransferStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateTransferStatus", null);
__decorate([
    (0, common_1.Get)("requests"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listRequests", null);
__decorate([
    (0, common_1.Get)("transfers"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listTransfers", null);
__decorate([
    (0, common_1.Get)("adjustments"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listAdjustments", null);
__decorate([
    (0, common_1.Get)("counts"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listCounts", null);
__decorate([
    (0, common_1.Post)("requests"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.request.create" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRequestDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Patch)("requests/:id/approve"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.request.approve" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveRequestDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "approveRequest", null);
__decorate([
    (0, common_1.Post)("requests/:id/fulfill"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.request.fulfill" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.FulfillRequestDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "fulfillRequest", null);
__decorate([
    (0, common_1.Post)("adjustments"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.stock.adjust" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAdjustmentDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createAdjustment", null);
__decorate([
    (0, common_1.Patch)("adjustments/:id/status"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.stock.adjust" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAdjustmentStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateAdjustmentStatus", null);
__decorate([
    (0, common_1.Post)("counts"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.count.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCountSessionDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createCountSession", null);
__decorate([
    (0, common_1.Post)("counts/:id/submit"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.count.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SubmitCountDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "submitCount", null);
__decorate([
    (0, common_1.Patch)("counts/:id/status"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.count.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCountStatusDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateCountStatus", null);
__decorate([
    (0, common_1.Get)("alerts"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "listAlerts", null);
__decorate([
    (0, common_1.Get)("reports/low-stock"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.reports.view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "lowStockReport", null);
__decorate([
    (0, common_1.Get)("reports/valuation"),
    (0, permissions_decorator_1.Permissions)({ module: "inventory", action: "inventory.valuation.view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "valuationReport", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)("inventory"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map