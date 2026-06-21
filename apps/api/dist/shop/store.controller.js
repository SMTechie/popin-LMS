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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreCatalogController = void 0;
const common_1 = require("@nestjs/common");
const shop_service_1 = require("./shop.service");
const integration_auth_guard_1 = require("../integrations/integration-auth.guard");
const api_request_log_interceptor_1 = require("../integrations/api-request-log.interceptor");
const swagger_1 = require("@nestjs/swagger");
const crypto_1 = __importDefault(require("crypto"));
let StoreCatalogController = class StoreCatalogController {
    shop;
    constructor(shop) {
        this.shop = shop;
    }
    async getCatalog(since, page = "1", pageSize = "50", category, visibility, includeVariants = "true", includeImages = "true", status, ifNoneMatch, res, req) {
        if (!req.integration?.shopApiEnabled)
            throw new common_1.ForbiddenException("Store API disabled");
        const data = await this.shop.getCatalog({
            tenantId: req.tenantId,
            since: since ? new Date(since) : undefined,
            page: Number(page),
            pageSize: Number(pageSize),
            category,
            visibility,
            includeVariants: includeVariants !== "false",
            includeImages: includeImages !== "false",
            status
        });
        if (req.integration?.id) {
            await this.shop.markCatalogSync(req.integration.id);
        }
        const etag = crypto_1.default.createHash("sha256").update(JSON.stringify(data)).digest("hex");
        if (ifNoneMatch && ifNoneMatch === etag) {
            return res.status(304).send();
        }
        res.setHeader("ETag", etag);
        res.setHeader("Cache-Control", "private, max-age=60");
        res.status(200).json(data);
    }
};
exports.StoreCatalogController = StoreCatalogController;
__decorate([
    (0, common_1.Get)("catalog"),
    (0, swagger_1.ApiOperation)({ summary: "Get store catalog" }),
    (0, swagger_1.ApiHeader)({ name: "Authorization", required: true, description: "Bearer <API_KEY>" }),
    (0, swagger_1.ApiHeader)({ name: "X-Popin-Secret", required: true }),
    (0, swagger_1.ApiQuery)({ name: "since", required: false }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false }),
    (0, swagger_1.ApiQuery)({ name: "pageSize", required: false }),
    (0, swagger_1.ApiQuery)({ name: "category", required: false }),
    (0, swagger_1.ApiQuery)({ name: "visibility", required: false }),
    (0, swagger_1.ApiQuery)({ name: "includeVariants", required: false }),
    (0, swagger_1.ApiQuery)({ name: "includeImages", required: false }),
    (0, swagger_1.ApiQuery)({ name: "status", required: false }),
    __param(0, (0, common_1.Query)("since")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("pageSize")),
    __param(3, (0, common_1.Query)("category")),
    __param(4, (0, common_1.Query)("visibility")),
    __param(5, (0, common_1.Query)("includeVariants")),
    __param(6, (0, common_1.Query)("includeImages")),
    __param(7, (0, common_1.Query)("status")),
    __param(8, (0, common_1.Headers)("if-none-match")),
    __param(9, (0, common_1.Res)()),
    __param(10, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], StoreCatalogController.prototype, "getCatalog", null);
exports.StoreCatalogController = StoreCatalogController = __decorate([
    (0, swagger_1.ApiTags)("Store Catalog"),
    (0, common_1.Controller)("api/v1/store"),
    (0, common_1.UseGuards)(integration_auth_guard_1.ExternalIntegrationAuthGuard),
    (0, common_1.UseInterceptors)(api_request_log_interceptor_1.ApiRequestLogInterceptor),
    __metadata("design:paramtypes", [shop_service_1.ShopService])
], StoreCatalogController);
//# sourceMappingURL=store.controller.js.map