import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";
import { decryptJson, encryptJson, generateSecret, hashApiKey } from "../common/crypto";
import { UpdateMarketingIntegrationDto } from "./dto";
import fetch from "node-fetch";
import { WebhookService } from "../webhooks/webhook.service";

const INTEGRATION_NAME = "Marketing Website";

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private tenants: TenantsService,
    private webhooks: WebhookService
  ) {}

  async getMarketingIntegration() {
    const tenant = await this.tenants.getDefaultTenant();
    const integration = await this.prisma.externalIntegration.findFirst({
      where: { tenantId: tenant.id, name: INTEGRATION_NAME }
    });

    if (integration) return integration;

    const bootstrapKey = generateSecret(24);
    const bootstrapSecret = generateSecret(32);

    const created = await this.prisma.externalIntegration.create({
      data: {
        tenantId: tenant.id,
        name: INTEGRATION_NAME,
        websiteBaseUrl: tenant.websiteUrl || "",
        apiKeyHash: hashApiKey(bootstrapKey),
        apiSecretEncrypted: encryptJson({ value: bootstrapSecret }),
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
        keyHash: hashApiKey(bootstrapKey),
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

  async updateMarketingIntegration(dto: UpdateMarketingIntegrationDto) {
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
    const apiKey = generateSecret(24);
    const keyHash = hashApiKey(apiKey);

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
    const apiSecret = generateSecret(32);

    await this.prisma.externalIntegration.update({
      where: { id: integration.id },
      data: { apiSecretEncrypted: encryptJson({ value: apiSecret }) }
    });

    return { apiSecret };
  }

  async rotateApiSecret() {
    return this.generateApiSecret();
  }

  async generateWebhookSecret() {
    const integration = await this.getMarketingIntegration();
    const webhookSecret = generateSecret(32);

    await this.prisma.externalIntegration.update({
      where: { id: integration.id },
      data: { webhookSecretEncrypted: encryptJson({ value: webhookSecret }) }
    });

    return { webhookSecret };
  }

  async rotateWebhookSecret() {
    return this.generateWebhookSecret();
  }

  async verifySecret(integrationId: string, secret: string) {
    const integration = await this.prisma.externalIntegration.findUnique({ where: { id: integrationId } });
    if (!integration) throw new BadRequestException("Integration not found");

    const decrypted = decryptJson<{ value: string }>(integration.apiSecretEncrypted as any);
    return decrypted.value === secret;
  }

  async testConnection() {
    const integration = await this.getMarketingIntegration();
    if (!integration.websiteBaseUrl) {
      throw new BadRequestException("Website base URL not configured");
    }

    try {
      const res = await fetch(integration.websiteBaseUrl, { method: "GET" });
      return { ok: res.ok, status: res.status };
    } catch (error) {
      return { ok: false, status: 0, error: "Connection failed" };
    }
  }

  async sendTestWebhook() {
    const integration = await this.getMarketingIntegration();
    if (!integration.webhookEnabled || !integration.webhookTargetUrl) {
      throw new BadRequestException("Webhook is disabled or target URL missing");
    }

    return this.webhooks.emitStoreEvent(integration.tenantId, integration.id, "store.catalog.updated", {
      test: true,
      timestamp: new Date().toISOString()
    });
  }

  private async enforceKeyRotationLimit(integrationId: string) {
    const activeKeys = await this.prisma.externalIntegrationKey.findMany({
      where: { integrationId, active: true },
      orderBy: { createdAt: "asc" }
    });

    if (activeKeys.length <= 2) return;
    const toDisable = activeKeys.slice(0, activeKeys.length - 2);

    await this.prisma.externalIntegrationKey.updateMany({
      where: { id: { in: toDisable.map((k: { id: string }) => k.id) } },
      data: { active: false, revokedAt: new Date() }
    });
  }
}
