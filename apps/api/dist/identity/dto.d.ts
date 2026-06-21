export declare class ConfigureIdentityProviderDto {
    displayName: string;
    tenantDomain?: string;
    externalTenantId?: string;
    clientId?: string;
    clientSecret?: string;
    teamId?: string;
    keyId?: string;
    privateKey?: string;
    scopes?: string[];
    settings?: Record<string, unknown>;
}
export declare class CreateRoleMappingDto {
    externalGroupId: string;
    externalGroupName: string;
    roleId: string;
    gradeId?: string;
    classId?: string;
    subject?: string;
    department?: string;
    autoDisable?: boolean;
    manualOverride?: boolean;
}
