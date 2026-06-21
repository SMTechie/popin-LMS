export declare class UpdateMarketingIntegrationDto {
    websiteBaseUrl: string;
    shopApiEnabled: boolean;
    webhookEnabled: boolean;
    webhookTargetUrl?: string;
    applicationFormApiEnabled?: boolean;
    publicApplyBaseUrl?: string;
    syncMode?: string;
    defaultCatalogVisibility?: string;
    environment?: string;
    requestSigningMode?: string;
    requestTimeoutSeconds?: number;
    retryPolicy?: Record<string, any>;
    customHeaders?: Record<string, any>;
    catalogEndpoint?: string;
    callbackEndpoint?: string;
}
export declare class GenerateSecretDto {
    reason?: string;
}
