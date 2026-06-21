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
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const integrations_service_1 = require("./integrations.service");
const dto_1 = require("./dto");
let IntegrationsController = class IntegrationsController {
    integrations;
    constructor(integrations) {
        this.integrations = integrations;
    }
    async getMarketing() {
        const integration = await this.integrations.getMarketingIntegration();
        return {
            id: integration.id,
            websiteBaseUrl: integration.websiteBaseUrl,
            shopApiEnabled: integration.shopApiEnabled,
            webhookEnabled: integration.webhookEnabled,
            webhookTargetUrl: integration.webhookTargetUrl,
            applicationFormApiEnabled: integration.applicationFormApiEnabled,
            publicApplyBaseUrl: integration.publicApplyBaseUrl,
            syncMode: integration.syncMode,
            defaultCatalogVisibility: integration.defaultCatalogVisibility,
            environment: integration.environment,
            requestSigningMode: integration.requestSigningMode,
            requestTimeoutSeconds: integration.requestTimeoutSeconds,
            retryPolicy: integration.retryPolicy,
            customHeaders: integration.customHeaders,
            catalogEndpoint: integration.catalogEndpoint,
            callbackEndpoint: integration.callbackEndpoint,
            lastApiCallAt: integration.lastApiCallAt,
            lastWebhookSentAt: integration.lastWebhookSentAt,
            lastCatalogSyncAt: integration.lastCatalogSyncAt,
            lastApplicationLinkRequestAt: integration.lastApplicationLinkRequestAt,
            hasApiSecret: Boolean(integration.apiSecretEncrypted),
            hasWebhookSecret: Boolean(integration.webhookSecretEncrypted)
        };
    }
    getMarketingStatus() {
        return this.integrations.getMarketingStatus();
    }
    updateMarketing(dto) {
        return this.integrations.updateMarketingIntegration(dto);
    }
    generateApiKey() {
        return this.integrations.generateApiKey();
    }
    rotateApiKey() {
        return this.integrations.rotateApiKey();
    }
    generateApiSecret() {
        return this.integrations.generateApiSecret();
    }
    rotateApiSecret() {
        return this.integrations.rotateApiSecret();
    }
    generateWebhookSecret() {
        return this.integrations.generateWebhookSecret();
    }
    rotateWebhookSecret() {
        return this.integrations.rotateWebhookSecret();
    }
    testConnection() {
        return this.integrations.testConnection();
    }
    sendTestWebhook() {
        return this.integrations.sendTestWebhook();
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Get)("marketing"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.manage" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getMarketing", null);
__decorate([
    (0, common_1.Get)("marketing/status"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.logs.view" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getMarketingStatus", null);
__decorate([
    (0, common_1.Put)("marketing"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateMarketingIntegrationDto]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "updateMarketing", null);
__decorate([
    (0, common_1.Post)("marketing/api-key/generate"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.credentials.generate" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "generateApiKey", null);
__decorate([
    (0, common_1.Post)("marketing/api-key/rotate"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.credentials.rotate" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "rotateApiKey", null);
__decorate([
    (0, common_1.Post)("marketing/api-secret/generate"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.credentials.generate" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "generateApiSecret", null);
__decorate([
    (0, common_1.Post)("marketing/api-secret/rotate"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.credentials.rotate" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "rotateApiSecret", null);
__decorate([
    (0, common_1.Post)("marketing/webhook-secret/generate"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.credentials.generate" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "generateWebhookSecret", null);
__decorate([
    (0, common_1.Post)("marketing/webhook-secret/rotate"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.credentials.rotate" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "rotateWebhookSecret", null);
__decorate([
    (0, common_1.Post)("marketing/test-connection"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.manage" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "testConnection", null);
__decorate([
    (0, common_1.Post)("marketing/send-test-webhook"),
    (0, permissions_decorator_1.Permissions)({ module: "integrations", action: "integrations.manage" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "sendTestWebhook", null);
exports.IntegrationsController = IntegrationsController = __decorate([
    (0, common_1.Controller)("integrations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map