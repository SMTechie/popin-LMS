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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const prisma_service_1 = require("../common/prisma.service");
const crypto_2 = require("../common/crypto");
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async signup(dto) {
        const email = dto.email.toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.BadRequestException("Email already exists");
        const passwordHash = await bcryptjs_1.default.hash(dto.password, 12);
        const parentRole = await this.prisma.role.findUnique({ where: { name: "Parent" } });
        const user = await this.prisma.user.create({
            data: {
                email,
                name: dto.name || null,
                passwordHash,
                status: "ACTIVE",
                userType: "PARENT",
                selfRegistered: true,
                roles: parentRole ? { create: { roleId: parentRole.id } } : undefined
            }
        });
        return this.issueToken(user.id, user.email);
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (!user || !user.passwordHash)
            throw new common_1.UnauthorizedException();
        if (user.status !== "ACTIVE")
            throw new common_1.UnauthorizedException("User inactive");
        const ok = await bcryptjs_1.default.compare(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException();
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });
        return this.issueToken(user.id, user.email);
    }
    async oauthSignin(dto) {
        void dto;
        throw new common_1.UnauthorizedException("Use the verified OAuth authorization flow");
    }
    issueToken(userId, email) {
        const token = this.jwt.sign({ sub: userId, email });
        return { accessToken: token };
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                userType: true,
                roles: {
                    include: {
                        role: { include: { permissions: { include: { permission: true } } } }
                    }
                }
            }
        });
        if (!user)
            throw new common_1.UnauthorizedException();
        const permissions = [...new Set(user.roles.flatMap((item) => item.role.permissions.map((entry) => `${entry.permission.module}:${entry.permission.action}`)))];
        return { id: user.id, email: user.email, name: user.name, userType: user.userType, roles: user.roles.map((item) => item.role.name), permissions };
    }
    async publicProviders() {
        const connections = await this.prisma.identityProviderConnection.findMany({ select: { provider: true, displayName: true, status: true, settings: true } });
        return connections.map((item) => ({ provider: item.provider, displayName: item.displayName, enabled: ["CONFIGURED", "CONNECTED"].includes(item.status), settings: item.settings }));
    }
    async oauthStart(provider, portal = "parent") {
        if (!["microsoft", "google", "apple"].includes(provider))
            throw new common_1.BadRequestException("Unsupported provider");
        const connection = await this.prisma.identityProviderConnection.findFirst({ where: { provider, status: { in: ["CONFIGURED", "CONNECTED"] } } });
        if (!connection?.clientId)
            throw new common_1.BadRequestException(`${provider} is not configured for this school`);
        const settings = (connection.settings || {});
        const allowedPortals = (settings.allowedPortals || ["parent", "teacher", "admin"]);
        if (!allowedPortals.includes(portal))
            throw new common_1.UnauthorizedException(`${provider} is disabled for the ${portal} portal`);
        const verifier = crypto_1.default.randomBytes(32).toString("base64url");
        const challenge = crypto_1.default.createHash("sha256").update(verifier).digest("base64url");
        const state = this.jwt.sign({ purpose: "oauth", provider, portal, tenantId: connection.tenantId, verifier }, { expiresIn: "10m" });
        const redirectUri = this.redirectUri(provider);
        const scope = provider === "microsoft" ? "openid profile email offline_access User.Read" : provider === "google" ? "openid profile email" : "name email";
        const endpoint = provider === "microsoft"
            ? `https://login.microsoftonline.com/${connection.externalTenantId || "organizations"}/oauth2/v2.0/authorize`
            : provider === "google" ? "https://accounts.google.com/o/oauth2/v2/auth" : "https://appleid.apple.com/auth/authorize";
        const params = new URLSearchParams({ client_id: connection.clientId, redirect_uri: redirectUri, response_type: "code", scope, state, response_mode: provider === "apple" ? "form_post" : "query", code_challenge: challenge, code_challenge_method: "S256" });
        if (provider === "google")
            params.set("access_type", "offline");
        return { authorizationUrl: `${endpoint}?${params.toString()}` };
    }
    async oauthCallback(provider, code, state) {
        let stateData;
        try {
            stateData = this.jwt.verify(state);
        }
        catch {
            throw new common_1.UnauthorizedException("Invalid or expired OAuth state");
        }
        if (stateData.purpose !== "oauth" || stateData.provider !== provider)
            throw new common_1.UnauthorizedException("OAuth state mismatch");
        const connection = await this.prisma.identityProviderConnection.findFirst({ where: { tenantId: stateData.tenantId, provider } });
        if (!connection?.clientId || !connection.encryptedCredentials)
            throw new common_1.BadRequestException("Provider credentials are incomplete");
        const credentials = (0, crypto_2.decryptJson)(connection.encryptedCredentials);
        const tokenEndpoint = provider === "microsoft"
            ? `https://login.microsoftonline.com/${connection.externalTenantId || "organizations"}/oauth2/v2.0/token`
            : provider === "google" ? "https://oauth2.googleapis.com/token" : "https://appleid.apple.com/auth/token";
        const tokenBody = new URLSearchParams({ client_id: connection.clientId, code, grant_type: "authorization_code", redirect_uri: this.redirectUri(provider), code_verifier: stateData.verifier });
        if (credentials.clientSecret)
            tokenBody.set("client_secret", credentials.clientSecret);
        const tokenResponse = await (0, node_fetch_1.default)(tokenEndpoint, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: tokenBody });
        const token = await tokenResponse.json();
        if (!tokenResponse.ok || !token.access_token && !token.id_token)
            throw new common_1.UnauthorizedException(token.error_description || "Provider token exchange failed");
        let profile;
        if (provider === "apple")
            profile = await this.verifyAppleToken(token.id_token, connection.clientId);
        else {
            const userInfoUrl = provider === "google" ? "https://openidconnect.googleapis.com/v1/userinfo" : "https://graph.microsoft.com/oidc/userinfo";
            const response = await (0, node_fetch_1.default)(userInfoUrl, { headers: { authorization: `Bearer ${token.access_token}` } });
            profile = await response.json();
            if (!response.ok)
                throw new common_1.UnauthorizedException("Could not verify provider identity");
        }
        const email = String(profile.email || profile.preferred_username || "").toLowerCase();
        const subject = String(profile.sub || profile.id || "");
        if (!email || !subject)
            throw new common_1.UnauthorizedException("Provider did not return a verified email identity");
        if (provider === "google" && profile.email_verified !== true)
            throw new common_1.UnauthorizedException("Google email is not verified");
        const domain = email.split("@")[1];
        if (connection.tenantDomain && stateData.portal !== "parent" && domain !== connection.tenantDomain.toLowerCase())
            throw new common_1.UnauthorizedException("Account is outside the approved school domain");
        const linkedAccount = await this.prisma.externalAccount.findUnique({ where: { provider_providerAccountId: { provider, providerAccountId: subject } }, include: { user: true } });
        let user = linkedAccount?.user || await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            const settings = (connection.settings || {});
            const userType = stateData.portal === "parent" ? "PARENT" : stateData.portal === "teacher" ? "TEACHER" : "ADMIN";
            if (userType === "TEACHER" && !settings.autoCreateTeachers)
                throw new common_1.UnauthorizedException("Teacher auto-provisioning is disabled; ask an administrator to create your account");
            if (userType === "ADMIN" && !settings.autoCreateAdmins)
                throw new common_1.UnauthorizedException("Administrator auto-provisioning is disabled");
            const roleName = userType === "PARENT" ? "Parent" : userType === "TEACHER" ? "Teacher" : "Administrator";
            const role = await this.prisma.role.findUnique({ where: { name: roleName } });
            user = await this.prisma.user.create({ data: { email, name: profile.name || null, userType, status: "ACTIVE", selfRegistered: userType === "PARENT", emailVerifiedAt: new Date(), roles: role ? { create: { roleId: role.id } } : undefined } });
        }
        if (user.status !== "ACTIVE")
            throw new common_1.UnauthorizedException("User inactive");
        if (linkedAccount && linkedAccount.userId !== user.id)
            throw new common_1.UnauthorizedException("Provider identity is already linked to another account");
        const encryptedTokens = (0, crypto_2.encryptJson)({ accessToken: token.access_token, refreshToken: token.refresh_token, idToken: token.id_token, expiresIn: token.expires_in, tokenType: token.token_type, obtainedAt: new Date().toISOString() });
        await this.prisma.externalAccount.upsert({ where: { provider_providerAccountId: { provider, providerAccountId: subject } }, update: { verifiedEmail: email, lastLoginAt: new Date(), metadata: { tenantId: connection.tenantId }, encryptedTokens }, create: { provider, providerAccountId: subject, userId: user.id, verifiedEmail: email, lastLoginAt: new Date(), metadata: { tenantId: connection.tenantId }, encryptedTokens } });
        await this.prisma.identityProviderConnection.update({ where: { id: connection.id }, data: { status: "CONNECTED", tokenHealth: "HEALTHY", connectedAt: connection.connectedAt || new Date(), lastError: null } });
        await this.prisma.auditLog.create({ data: { actorId: user.id, action: "identity.sso.login", entity: "ExternalAccount", entityId: `${provider}:${subject}`, data: { provider, email, portal: stateData.portal } } });
        return this.issueToken(user.id, user.email);
    }
    redirectUri(provider) { return `${process.env.OAUTH_CALLBACK_BASE_URL || "http://localhost:4000/auth/oauth"}/${provider}/callback`; }
    async verifyAppleToken(idToken, audience) {
        const [headerPart, payloadPart, signaturePart] = idToken.split(".");
        if (!headerPart || !payloadPart || !signaturePart)
            throw new common_1.UnauthorizedException("Invalid Apple identity token");
        const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
        const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
        const jwks = await (await (0, node_fetch_1.default)("https://appleid.apple.com/auth/keys")).json();
        const jwk = jwks.keys?.find((key) => key.kid === header.kid);
        if (!jwk)
            throw new common_1.UnauthorizedException("Apple signing key not found");
        const valid = crypto_1.default.verify("RSA-SHA256", Buffer.from(`${headerPart}.${payloadPart}`), crypto_1.default.createPublicKey({ key: jwk, format: "jwk" }), Buffer.from(signaturePart, "base64url"));
        if (!valid || payload.iss !== "https://appleid.apple.com" || payload.aud !== audience || Number(payload.exp) * 1000 < Date.now())
            throw new common_1.UnauthorizedException("Apple identity token validation failed");
        return payload;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map