import { IsArray, IsBoolean, IsIn, IsObject, IsOptional, IsString } from "class-validator";

export class ConfigureIdentityProviderDto {
  @IsString() displayName!: string;
  @IsOptional() @IsString() tenantDomain?: string;
  @IsOptional() @IsString() externalTenantId?: string;
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() clientSecret?: string;
  @IsOptional() @IsString() teamId?: string;
  @IsOptional() @IsString() keyId?: string;
  @IsOptional() @IsString() privateKey?: string;
  @IsOptional() @IsArray() scopes?: string[];
  @IsOptional() @IsObject() settings?: Record<string, unknown>;
}

export class CreateRoleMappingDto {
  @IsString() externalGroupId!: string;
  @IsString() externalGroupName!: string;
  @IsString() roleId!: string;
  @IsOptional() @IsString() gradeId?: string;
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @IsString() subject?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsBoolean() autoDisable?: boolean;
  @IsOptional() @IsBoolean() manualOverride?: boolean;
}
