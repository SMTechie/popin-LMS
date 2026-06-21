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
exports.StoreAdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const tenants_service_1 = require("../tenants/tenants.service");
const shop_service_1 = require("./shop.service");
const dto_1 = require("./dto");
let StoreAdminController = class StoreAdminController {
    shop;
    tenants;
    constructor(shop, tenants) {
        this.shop = shop;
        this.tenants = tenants;
    }
    async getCatalog(query) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.getCatalog({
            tenantId: tenant.id,
            since: query.since ? new Date(query.since) : undefined,
            page: Number(query.page || 1),
            pageSize: Number(query.pageSize || 50),
            category: query.category,
            visibility: query.visibility,
            includeVariants: query.includeVariants !== "false",
            includeImages: query.includeImages !== "false",
            status: query.status
        });
    }
    async createCatalog(dto) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.createCatalog(tenant.id, dto);
    }
    async updateCatalogStatus(id, dto) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.publishCatalog(tenant.id, id, dto.status);
    }
    async createCategory(dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.createCategory(tenant.id, dto, req.user?.integrationId);
    }
    async updateCategory(id, dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.updateCategory(tenant.id, id, dto, req.user?.integrationId);
    }
    async createProduct(dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.createProduct(tenant.id, dto, req.user?.integrationId);
    }
    async updateProduct(id, dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.updateProduct(tenant.id, id, dto, req.user?.integrationId);
    }
    async duplicateProduct(id, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.duplicateProduct(tenant.id, id, req.user?.id);
    }
    async updateProductStatus(id, dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.updateProductStatus(tenant.id, id, dto.isActive, req.user?.id);
    }
    async adjustProductStock(id, dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.adjustProductStock(tenant.id, id, dto, req.user?.id);
    }
    async productHistory(id) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.productHistory(tenant.id, id);
    }
    async deleteProduct(id) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.deleteProduct(tenant.id, id);
    }
    async createOrder(dto, req) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.shop.createOrder(tenant.id, req.user.id, dto);
    }
    myOrders(req) {
        return this.shop.myOrders(req.user.id);
    }
};
exports.StoreAdminController = StoreAdminController;
__decorate([
    (0, common_1.Get)("catalog"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.view" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "getCatalog", null);
__decorate([
    (0, common_1.Post)("catalogs"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCatalogDto]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "createCatalog", null);
__decorate([
    (0, common_1.Patch)("catalogs/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.publish" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCatalogStatusDto]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "updateCatalogStatus", null);
__decorate([
    (0, common_1.Post)("categories"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)("categories/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Post)("products"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)("products/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)("products/:id/duplicate"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "duplicateProduct", null);
__decorate([
    (0, common_1.Patch)("products/:id/status"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateProductStatusDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "updateProductStatus", null);
__decorate([
    (0, common_1.Post)("products/:id/stock"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AdjustProductStockDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "adjustProductStock", null);
__decorate([
    (0, common_1.Get)("products/:id/history"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.view" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "productHistory", null);
__decorate([
    (0, common_1.Delete)("products/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Post)("orders"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.view" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateStoreOrderDto, Object]),
    __metadata("design:returntype", Promise)
], StoreAdminController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)("orders/mine"),
    (0, permissions_decorator_1.Permissions)({ module: "uniform_store", action: "store.view" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StoreAdminController.prototype, "myOrders", null);
exports.StoreAdminController = StoreAdminController = __decorate([
    (0, common_1.Controller)("store"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [shop_service_1.ShopService, tenants_service_1.TenantsService])
], StoreAdminController);
//# sourceMappingURL=store-admin.controller.js.map