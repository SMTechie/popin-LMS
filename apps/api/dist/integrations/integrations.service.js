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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const crypto_1 = require("../common/crypto");
const node_fetch_1 = __importDefault(require("node-fetch"));
const webhook_service_1 = require("../webhooks/webhook.service");
const INTEGRATION_NAME = "Marketing Website";
let IntegrationsService = class IntegrationsService {
    prisma;
    tenants;
    webhooks;
    constructor(prisma, tenants, webhooks) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.webhooks = webhooks;
    }
    async getMarketingIntegration() {
        const tenant = await this.tenants.getDefaultTenant();
        const integration = await this.prisma.externalIntegration.findFirst({
            where: { tenantId: tenant.id, name: INTEGRATION_NAME }
        });
        if (integration)
            return integration;
        const bootstrapKey = (0, crypto_1.generateSecret)(24);
        const bootstrapSecret = (0, crypto_1.generateSecret)(32);
        const created = await this.prisma.externalIntegration.create({
            data: {
                tenantId: tenant.id,
                name: INTEGRATION_NAME,
                websiteBaseUrl: tenant.websiteUrl || "",
                apiKeyHash: (0, crypto_1.hashApiKey)(bootstrapKey),
                apiSecretEncrypted: (0, crypto_1.encryptJson)({ value: bootstrapSecret }),
                shopApiEnabled: true,
                webhookEnabled: false,
                applicationFormApiEnabled: true,
                publicApplyBaseUrl: tenant.portalUrl || "http://localhost:3000",
                syncMode: "api_pull",
                defaultCatalogVisibility: "universal",
                requestSigningMode: "hmac",
                requestTimeoutSeconds: 15,
                environment: "development"
            }
        });
        await this.prisma.externalIntegrationKey.create({
            data: {
                integrationId: created.id,
                keyHash: (0, crypto_1.hashApiKey)(bootstrapKey),
                active: true
            }
        });
        return created;
    }
    async getMarketingStatus() {
        const integration = await this.getMarketingIntegration();
        const lastApi = await this.prisma.apiRequestLog.findFirst({
            where: { integrationId: integration.id },
            orderBy: { createdAt: "desc" }
        });
        const lastWebhook = await this.prisma.webhookDelivery.findFirst({
            where: { integrationId: integration.id },
            orderBy: { createdAt: "desc" }
        });
        const recentFailures = await this.prisma.webhookDelivery.count({
            where: {
                integrationId: integration.id,
                lastStatusCode: { gte: 400 },
                lastAttemptAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            }
        });
        return {
            integration,
            lastApi,
            lastWebhook,
            webhookFailureCount: recentFailures
        };
    }
    async updateMarketingIntegration(dto) {
        const integration = await this.getMarketingIntegration();
        return this.prisma.externalIntegration.update({
            where: { id: integration.id },
            data: {
                websiteBaseUrl: dto.websiteBaseUrl,
                shopApiEnabled: dto.shopApiEnabled,
                webhookEnabled: dto.webhookEnabled,
                webhookTargetUrl: dto.webhookTargetUrl || null,
                applicationFormApiEnabled: dto.applicationFormApiEnabled ?? integration.applicationFormApiEnabled,
                publicApplyBaseUrl: dto.publicApplyBaseUrl || integration.publicApplyBaseUrl,
                syncMode: dto.syncMode || integration.syncMode,
                defaultCatalogVisibility: dto.defaultCatalogVisibility || integration.defaultCatalogVisibility,
                environment: dto.environment || integration.environment,
                requestSigningMode: dto.requestSigningMode || integration.requestSigningMode,
                requestTimeoutSeconds: dto.requestTimeoutSeconds ?? integration.requestTimeoutSeconds,
                retryPolicy: dto.retryPolicy ?? integration.retryPolicy ?? undefined,
                customHeaders: dto.customHeaders ?? integration.customHeaders ?? undefined,
                catalogEndpoint: dto.catalogEndpoint || integration.catalogEndpoint,
                callbackEndpoint: dto.callbackEndpoint || integration.callbackEndpoint
            }
        });
    }
    async generateApiKey() {
        const integration = await this.getMarketingIntegration();
        const apiKey = (0, crypto_1.generateSecret)(24);
        const keyHash = (0, crypto_1.hashApiKey)(apiKey);
        await this.prisma.externalIntegration.update({
            where: { id: integration.id },
            data: { apiKeyHash: keyHash }
        });
        await this.prisma.externalIntegrationKey.create({
            data: {
                integrationId: integration.id,
                keyHash,
                active: true
            }
        });
        await this.enforceKeyRotationLimit(integration.id);
        return { apiKey };
    }
    async rotateApiKey() {
        return this.generateApiKey();
    }
    async generateApiSecret() {
        const integration = await this.getMarketingIntegration();
        const apiSecret = (0, crypto_1.generateSecret)(32);
        await this.prisma.externalIntegration.update({
            where: { id: integration.id },
            data: { apiSecretEncrypted: (0, crypto_1.encryptJson)({ value: apiSecret }) }
        });
        return { apiSecret };
    }
    async rotateApiSecret() {
        return this.generateApiSecret();
    }
    async generateWebhookSecret() {
        const integration = await this.getMarketingIntegration();
        const webhookSecret = (0, crypto_1.generateSecret)(32);
        await this.prisma.externalIntegration.update({
            where: { id: integration.id },
            data: { webhookSecretEncrypted: (0, crypto_1.encryptJson)({ value: webhookSecret }) }
        });
        return { webhookSecret };
    }
    async rotateWebhookSecret() {
        return this.generateWebhookSecret();
    }
    async verifySecret(integrationId, secret) {
        const integration = await this.prisma.externalIntegration.findUnique({ where: { id: integrationId } });
        if (!integration)
            throw new common_1.BadRequestException("Integration not found");
        const decrypted = (0, crypto_1.decryptJson)(integration.apiSecretEncrypted);
        return decrypted.value === secret;
    }
    async testConnection() {
        const integration = await this.getMarketingIntegration();
        if (!integration.websiteBaseUrl) {
            throw new common_1.BadRequestException("Website base URL not configured");
        }
        try {
            const res = await (0, node_fetch_1.default)(integration.websiteBaseUrl, { method: "GET" });
            return { ok: res.ok, status: res.status };
        }
        catch (error) {
            return { ok: false, status: 0, error: "Connection failed" };
        }
    }
    async sendTestWebhook() {
        const integration = await this.getMarketingIntegration();
        if (!integration.webhookEnabled || !integration.webhookTargetUrl) {
            throw new common_1.BadRequestException("Webhook is disabled or target URL missing");
        }
        return this.webhooks.emitStoreEvent(integration.tenantId, integration.id, "store.catalog.updated", {
            test: true,
            timestamp: new Date().toISOString()
        });
    }
    async enforceKeyRotationLimit(integrationId) {
        const activeKeys = await this.prisma.externalIntegrationKey.findMany({
            where: { integrationId, active: true },
            orderBy: { createdAt: "asc" }
        });
        if (activeKeys.length <= 2)
            return;
        const toDisable = activeKeys.slice(0, activeKeys.length - 2);
        await this.prisma.externalIntegrationKey.updateMany({
            where: { id: { in: toDisable.map((k) => k.id) } },
            data: { active: false, revokedAt: new Date() }
        });
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenants_service_1.TenantsService,
        webhook_service_1.WebhookService])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map