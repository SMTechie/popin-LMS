import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { IntegrationsService } from "./integrations.service";
import { UpdateMarketingIntegrationDto } from "./dto";

@Controller("integrations")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class IntegrationsController {
  constructor(private integrations: IntegrationsService) {}

  @Get("marketing")
  @Permissions({ module: "integrations", action: "integrations.manage" })
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

  @Get("marketing/status")
  @Permissions({ module: "integrations", action: "integrations.logs.view" })
  getMarketingStatus() {
    return this.integrations.getMarketingStatus();
  }

  @Put("marketing")
  @Permissions({ module: "integrations", action: "integrations.manage" })
  updateMarketing(@Body() dto: UpdateMarketingIntegrationDto) {
    return this.integrations.updateMarketingIntegration(dto);
  }

  @Post("marketing/api-key/generate")
  @Permissions({ module: "integrations", action: "integrations.credentials.generate" })
  generateApiKey() {
    return this.integrations.generateApiKey();
  }

  @Post("marketing/api-key/rotate")
  @Permissions({ module: "integrations", action: "integrations.credentials.rotate" })
  rotateApiKey() {
    return this.integrations.rotateApiKey();
  }

  @Post("marketing/api-secret/generate")
  @Permissions({ module: "integrations", action: "integrations.credentials.generate" })
  generateApiSecret() {
    return this.integrations.generateApiSecret();
  }

  @Post("marketing/api-secret/rotate")
  @Permissions({ module: "integrations", action: "integrations.credentials.rotate" })
  rotateApiSecret() {
    return this.integrations.rotateApiSecret();
  }

  @Post("marketing/webhook-secret/generate")
  @Permissions({ module: "integrations", action: "integrations.credentials.generate" })
  generateWebhookSecret() {
    return this.integrations.generateWebhookSecret();
  }

  @Post("marketing/webhook-secret/rotate")
  @Permissions({ module: "integrations", action: "integrations.credentials.rotate" })
  rotateWebhookSecret() {
    return this.integrations.rotateWebhookSecret();
  }

  @Post("marketing/test-connection")
  @Permissions({ module: "integrations", action: "integrations.manage" })
  testConnection() {
    return this.integrations.testConnection();
  }

  @Post("marketing/send-test-webhook")
  @Permissions({ module: "integrations", action: "integrations.manage" })
  sendTestWebhook() {
    return this.integrations.sendTestWebhook();
  }
}
