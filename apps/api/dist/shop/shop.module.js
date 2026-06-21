"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopModule = void 0;
const common_1 = require("@nestjs/common");
const shop_controller_1 = require("./shop.controller");
const store_controller_1 = require("./store.controller");
const store_admin_controller_1 = require("./store-admin.controller");
const shop_service_1 = require("./shop.service");
const prisma_service_1 = require("../common/prisma.service");
const api_request_log_interceptor_1 = require("../integrations/api-request-log.interceptor");
const integration_auth_guard_1 = require("../integrations/integration-auth.guard");
const webhooks_module_1 = require("../webhooks/webhooks.module");
const tenants_module_1 = require("../tenants/tenants.module");
let ShopModule = class ShopModule {
};
exports.ShopModule = ShopModule;
exports.ShopModule = ShopModule = __decorate([
    (0, common_1.Module)({
        imports: [webhooks_module_1.WebhooksModule, tenants_module_1.TenantsModule],
        controllers: [shop_controller_1.ShopController, store_controller_1.StoreCatalogController, store_admin_controller_1.StoreAdminController],
        providers: [shop_service_1.ShopService, prisma_service_1.PrismaService, api_request_log_interceptor_1.ApiRequestLogInterceptor, integration_auth_guard_1.ExternalIntegrationAuthGuard]
    })
], ShopModule);
//# sourceMappingURL=shop.module.js.map