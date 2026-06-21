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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const audit_service_1 = require("../audit/audit.service");
const crypto_1 = require("../common/crypto");
const providers = [
    { provider: "microsoft", displayName: "Microsoft 365 / Entra ID" },
    { provider: "google", displayName: "Google Workspace" },
    { provider: "apple", displayName: "Sign in with Apple" }
];
let IdentityService = class IdentityService {
    prisma;
    tenants;
    audit;
    constructor(prisma, tenants, audit) {
        this.prisma = prisma;
        this.tenants = tenants;
        this.audit = audit;
    }
    async list() {
        const tenant = await this.tenants.getDefaultTenant();
        for (const item of providers)
            await this.prisma.identityProviderConnection.upsert({ where: { tenantId_provider: { tenantId: tenant.id, provider: item.provider } }, update: {}, create: { tenantId: tenant.id, ...item } });
        const connections = await this.prisma.identityProviderConnection.findMany({ where: { tenantId: tenant.id }, include: { roleMappings: true, syncLogs: { orderBy: { createdAt: "desc" }, take: 20 } }, orderBy: { provider: "asc" } });
        return connections.map(({ encryptedCredentials, ...connection }) => ({ ...connection, credentialsConfigured: !!encryptedCredentials }));
    }
    async configure(provider, dto, actorId) {
        if (!providers.some((item) => item.provider === provider))
            throw new common_1.BadRequestException("Unsupported identity provider");
        const tenant = await this.tenants.getDefaultTenant();
        const credentials = dto.clientSecret || dto.privateKey ? (0, crypto_1.encryptJson)({ clientSecret: dto.clientSecret, privateKey: dto.privateKey, teamId: dto.teamId, keyId: dto.keyId }) : undefined;
        const connection = await this.prisma.identityProviderConnection.upsert({
            where: { tenantId_provider: { tenantId: tenant.id, provider } },
            update: { displayName: dto.displayName, tenantDomain: dto.tenantDomain || null, externalTenantId: dto.externalTenantId || null, clientId: dto.clientId || null, ...(credentials ? { encryptedCredentials: credentials } : {}), scopes: dto.scopes, settings: dto.settings, status: dto.clientId ? "CONFIGURED" : "DISCONNECTED", tokenHealth: "NOT_CONNECTED", connectedById: actorId },
            create: { tenantId: tenant.id, provider, displayName: dto.displayName, tenantDomain: dto.tenantDomain || null, externalTenantId: dto.externalTenantId || null, clientId: dto.clientId || null, encryptedCredentials: credentials, scopes: dto.scopes, settings: dto.settings, status: dto.clientId ? "CONFIGURED" : "DISCONNECTED", connectedById: actorId }
        });
        await this.audit.log({ actorId, action: "identity.provider.configure", entity: "IdentityProviderConnection", entityId: connection.id, data: { provider, tenantDomain: dto.tenantDomain, credentialsChanged: !!credentials } });
        return { ...connection, encryptedCredentials: undefined, credentialsConfigured: !!connection.encryptedCredentials };
    }
    async disconnect(provider, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const connection = await this.prisma.identityProviderConnection.update({ where: { tenantId_provider: { tenantId: tenant.id, provider } }, data: { status: "DISCONNECTED", tokenHealth: "REVOKED", encryptedCredentials: client_1.Prisma.JsonNull, connectedAt: null, lastError: null } });
        await this.audit.log({ actorId, action: "identity.provider.disconnect", entity: "IdentityProviderConnection", entityId: connection.id, data: { provider } });
        return connection;
    }
    async addMapping(provider, dto, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const connection = await this.prisma.identityProviderConnection.findUnique({ where: { tenantId_provider: { tenantId: tenant.id, provider } } });
        if (!connection)
            throw new common_1.BadRequestException("Provider is not configured");
        const mapping = await this.prisma.externalGroupRoleMapping.upsert({ where: { connectionId_externalGroupId: { connectionId: connection.id, externalGroupId: dto.externalGroupId } }, update: dto, create: { connectionId: connection.id, ...dto } });
        await this.audit.log({ actorId, action: "identity.role-mapping.update", entity: "ExternalGroupRoleMapping", entityId: mapping.id, data: { provider, group: dto.externalGroupName, roleId: dto.roleId } });
        return mapping;
    }
    async sync(provider, actorId) {
        const tenant = await this.tenants.getDefaultTenant();
        const connection = await this.prisma.identityProviderConnection.findUnique({ where: { tenantId_provider: { tenantId: tenant.id, provider } } });
        if (!connection || !["CONNECTED", "CONFIGURED"].includes(connection.status))
            throw new common_1.BadRequestException("Provider must be configured before sync");
        const status = connection.status === "CONNECTED" ? "QUEUED" : "REQUIRES_CONSENT";
        const log = await this.prisma.identitySyncLog.create({ data: { tenantId: tenant.id, connectionId: connection.id, operation: "USER_CALENDAR_EMAIL_SYNC", status, summary: { roleMappings: await this.prisma.externalGroupRoleMapping.count({ where: { connectionId: connection.id } }) } } });
        await this.audit.log({ actorId, action: "identity.sync.requested", entity: "IdentitySyncLog", entityId: log.id, data: { provider, status } });
        return log;
    }
};
exports.IdentityService = IdentityService;
exports.IdentityService = IdentityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, tenants_service_1.TenantsService, audit_service_1.AuditService])
], IdentityService);
//# sourceMappingURL=identity.service.js.map