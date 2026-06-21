import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";
import { UpdateMarketingIntegrationDto } from "./dto";
import { WebhookService } from "../webhooks/webhook.service";
export declare class IntegrationsService {
    private prisma;
    private tenants;
    private webhooks;
    constructor(prisma: PrismaService, tenants: TenantsService, webhooks: WebhookService);
    getMarketingIntegration(): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        websiteBaseUrl: string;
        apiKeyHash: string;
        apiSecretEncrypted: import("@prisma/client/runtime/library").JsonValue;
        webhookSecretEncrypted: import("@prisma/client/runtime/library").JsonValue | null;
        shopApiEnabled: boolean;
        webhookEnabled: boolean;
        webhookTargetUrl: string | null;
        applicationFormApiEnabled: boolean;
        publicApplyBaseUrl: string | null;
        syncMode: string;
        defaultCatalogVisibility: string | null;
        requestTimeoutSeconds: number | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue | null;
        requestSigningMode: string | null;
        environment: string | null;
        customHeaders: import("@prisma/client/runtime/library").JsonValue | null;
        catalogEndpoint: string | null;
        callbackEndpoint: string | null;
        lastApiCallAt: Date | null;
        lastWebhookSentAt: Date | null;
        lastCatalogSyncAt: Date | null;
        lastApplicationLinkRequestAt: Date | null;
    }>;
    getMarketingStatus(): Promise<{
        integration: {
            id: string;
            tenantId: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            websiteBaseUrl: string;
            apiKeyHash: string;
            apiSecretEncrypted: import("@prisma/client/runtime/library").JsonValue;
            webhookSecretEncrypted: import("@prisma/client/runtime/library").JsonValue | null;
            shopApiEnabled: boolean;
            webhookEnabled: boolean;
            webhookTargetUrl: string | null;
            applicationFormApiEnabled: boolean;
            publicApplyBaseUrl: string | null;
            syncMode: string;
            defaultCatalogVisibility: string | null;
            requestTimeoutSeconds: number | null;
            retryPolicy: import("@prisma/client/runtime/library").JsonValue | null;
            requestSigningMode: string | null;
            environment: string | null;
            customHeaders: import("@prisma/client/runtime/library").JsonValue | null;
            catalogEndpoint: string | null;
            callbackEndpoint: string | null;
            lastApiCallAt: Date | null;
            lastWebhookSentAt: Date | null;
            lastCatalogSyncAt: Date | null;
            lastApplicationLinkRequestAt: Date | null;
        };
        lastApi: {
            id: string;
            tenantId: string;
            createdAt: Date;
            method: string;
            integrationId: string;
            statusCode: number;
            headers: import("@prisma/client/runtime/library").JsonValue | null;
            endpoint: string;
            latencyMs: number;
            ipAddress: string | null;
            userAgent: string | null;
        } | null;
        lastWebhook: {
            id: string;
            tenantId: string;
            createdAt: Date;
            lastError: string | null;
            eventType: string;
            payload: import("@prisma/client/runtime/library").JsonValue;
            targetUrl: string;
            deliveryId: string;
            attemptCount: number;
            lastStatusCode: number | null;
            lastAttemptAt: Date | null;
            integrationId: string;
        } | null;
        webhookFailureCount: number;
    }>;
    updateMarketingIntegration(dto: UpdateMarketingIntegrationDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        websiteBaseUrl: string;
        apiKeyHash: string;
        apiSecretEncrypted: import("@prisma/client/runtime/library").JsonValue;
        webhookSecretEncrypted: import("@prisma/client/runtime/library").JsonValue | null;
        shopApiEnabled: boolean;
        webhookEnabled: boolean;
        webhookTargetUrl: string | null;
        applicationFormApiEnabled: boolean;
        publicApplyBaseUrl: string | null;
        syncMode: string;
        defaultCatalogVisibility: string | null;
        requestTimeoutSeconds: number | null;
        retryPolicy: import("@prisma/client/runtime/library").JsonValue | null;
        requestSigningMode: string | null;
        environment: string | null;
        customHeaders: import("@prisma/client/runtime/library").JsonValue | null;
        catalogEndpoint: string | null;
        callbackEndpoint: string | null;
        lastApiCallAt: Date | null;
        lastWebhookSentAt: Date | null;
        lastCatalogSyncAt: Date | null;
        lastApplicationLinkRequestAt: Date | null;
    }>;
    generateApiKey(): Promise<{
        apiKey: string;
    }>;
    rotateApiKey(): Promise<{
        apiKey: string;
    }>;
    generateApiSecret(): Promise<{
        apiSecret: string;
    }>;
    rotateApiSecret(): Promise<{
        apiSecret: string;
    }>;
    generateWebhookSecret(): Promise<{
        webhookSecret: string;
    }>;
    rotateWebhookSecret(): Promise<{
        webhookSecret: string;
    }>;
    verifySecret(integrationId: string, secret: string): Promise<boolean>;
    testConnection(): Promise<{
        ok: boolean;
        status: number;
        error?: undefined;
    } | {
        ok: boolean;
        status: number;
        error: string;
    }>;
    sendTestWebhook(): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        lastError: string | null;
        eventType: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
        targetUrl: string;
        deliveryId: string;
        attemptCount: number;
        lastStatusCode: number | null;
        lastAttemptAt: Date | null;
        integrationId: string;
    } | undefined>;
    private enforceKeyRotationLimit;
}
