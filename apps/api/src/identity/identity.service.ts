import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";
import { AuditService } from "../audit/audit.service";
import { encryptJson } from "../common/crypto";
import { ConfigureIdentityProviderDto, CreateRoleMappingDto } from "./dto";

const providers = [
  { provider: "microsoft", displayName: "Microsoft 365 / Entra ID" },
  { provider: "google", displayName: "Google Workspace" },
  { provider: "apple", displayName: "Sign in with Apple" }
] as const;

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService, private tenants: TenantsService, private audit: AuditService) {}

  async list() {
    const tenant = await this.tenants.getDefaultTenant();
    for (const item of providers) await this.prisma.identityProviderConnection.upsert({ where: { tenantId_provider: { tenantId: tenant.id, provider: item.provider } }, update: {}, create: { tenantId: tenant.id, ...item } });
    const connections = await this.prisma.identityProviderConnection.findMany({ where: { tenantId: tenant.id }, include: { roleMappings: true, syncLogs: { orderBy: { createdAt: "desc" }, take: 20 } }, orderBy: { provider: "asc" } });
    return connections.map(({ encryptedCredentials, ...connection }) => ({ ...connection, credentialsConfigured: !!encryptedCredentials }));
  }

  async configure(provider: string, dto: ConfigureIdentityProviderDto, actorId: string) {
    if (!providers.some((item) => item.provider === provider)) throw new BadRequestException("Unsupported identity provider");
    const tenant = await this.tenants.getDefaultTenant();
    const credentials = dto.clientSecret || dto.privateKey ? encryptJson({ clientSecret: dto.clientSecret, privateKey: dto.privateKey, teamId: dto.teamId, keyId: dto.keyId }) : undefined;
    const connection = await this.prisma.identityProviderConnection.upsert({
      where: { tenantId_provider: { tenantId: tenant.id, provider } },
      update: { displayName: dto.displayName, tenantDomain: dto.tenantDomain || null, externalTenantId: dto.externalTenantId || null, clientId: dto.clientId || null, ...(credentials ? { encryptedCredentials: credentials } : {}), scopes: dto.scopes as Prisma.InputJsonValue | undefined, settings: dto.settings as Prisma.InputJsonValue | undefined, status: dto.clientId ? "CONFIGURED" : "DISCONNECTED", tokenHealth: "NOT_CONNECTED", connectedById: actorId },
      create: { tenantId: tenant.id, provider, displayName: dto.displayName, tenantDomain: dto.tenantDomain || null, externalTenantId: dto.externalTenantId || null, clientId: dto.clientId || null, encryptedCredentials: credentials, scopes: dto.scopes as Prisma.InputJsonValue | undefined, settings: dto.settings as Prisma.InputJsonValue | undefined, status: dto.clientId ? "CONFIGURED" : "DISCONNECTED", connectedById: actorId }
    });
    await this.audit.log({ actorId, action: "identity.provider.configure", entity: "IdentityProviderConnection", entityId: connection.id, data: { provider, tenantDomain: dto.tenantDomain, credentialsChanged: !!credentials } });
    return { ...connection, encryptedCredentials: undefined, credentialsConfigured: !!connection.encryptedCredentials };
  }

  async disconnect(provider: string, actorId: string) {
    const tenant = await this.tenants.getDefaultTenant();
    const connection = await this.prisma.identityProviderConnection.update({ where: { tenantId_provider: { tenantId: tenant.id, provider } }, data: { status: "DISCONNECTED", tokenHealth: "REVOKED", encryptedCredentials: Prisma.JsonNull, connectedAt: null, lastError: null } });
    await this.audit.log({ actorId, action: "identity.provider.disconnect", entity: "IdentityProviderConnection", entityId: connection.id, data: { provider } });
    return connection;
  }

  async addMapping(provider: string, dto: CreateRoleMappingDto, actorId: string) {
    const tenant = await this.tenants.getDefaultTenant();
    const connection = await this.prisma.identityProviderConnection.findUnique({ where: { tenantId_provider: { tenantId: tenant.id, provider } } });
    if (!connection) throw new BadRequestException("Provider is not configured");
    const mapping = await this.prisma.externalGroupRoleMapping.upsert({ where: { connectionId_externalGroupId: { connectionId: connection.id, externalGroupId: dto.externalGroupId } }, update: dto, create: { connectionId: connection.id, ...dto } });
    await this.audit.log({ actorId, action: "identity.role-mapping.update", entity: "ExternalGroupRoleMapping", entityId: mapping.id, data: { provider, group: dto.externalGroupName, roleId: dto.roleId } });
    return mapping;
  }

  async sync(provider: string, actorId: string) {
    const tenant = await this.tenants.getDefaultTenant();
    const connection = await this.prisma.identityProviderConnection.findUnique({ where: { tenantId_provider: { tenantId: tenant.id, provider } } });
    if (!connection || !["CONNECTED", "CONFIGURED"].includes(connection.status)) throw new BadRequestException("Provider must be configured before sync");
    const status = connection.status === "CONNECTED" ? "QUEUED" : "REQUIRES_CONSENT";
    const log = await this.prisma.identitySyncLog.create({ data: { tenantId: tenant.id, connectionId: connection.id, operation: "USER_CALENDAR_EMAIL_SYNC", status, summary: { roleMappings: await this.prisma.externalGroupRoleMapping.count({ where: { connectionId: connection.id } }) } } });
    await this.audit.log({ actorId, action: "identity.sync.requested", entity: "IdentitySyncLog", entityId: log.id, data: { provider, status } });
    return log;
  }
}
