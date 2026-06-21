import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateMarketingIntegrationDto {
  @IsUrl()
  websiteBaseUrl!: string;

  @IsBoolean()
  shopApiEnabled!: boolean;

  @IsBoolean()
  webhookEnabled!: boolean;

  @IsOptional()
  @IsUrl()
  webhookTargetUrl?: string;

  @IsOptional()
  @IsBoolean()
  applicationFormApiEnabled?: boolean;

  @IsOptional()
  @IsUrl()
  publicApplyBaseUrl?: string;

  @IsOptional()
  @IsString()
  syncMode?: string;

  @IsOptional()
  @IsString()
  defaultCatalogVisibility?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsString()
  requestSigningMode?: string;

  @IsOptional()
  requestTimeoutSeconds?: number;

  @IsOptional()
  retryPolicy?: Record<string, any>;

  @IsOptional()
  customHeaders?: Record<string, any>;

  @IsOptional()
  @IsString()
  catalogEndpoint?: string;

  @IsOptional()
  @IsString()
  callbackEndpoint?: string;
}

export class GenerateSecretDto {
  @IsOptional()
  @IsString()
  reason?: string;
}
