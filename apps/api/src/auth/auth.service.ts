import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fetch from "node-fetch";
import { PrismaService } from "../common/prisma.service";
import { LoginDto, SignupDto, OAuthSigninDto } from "./dto";
import { decryptJson, encryptJson } from "../common/crypto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(dto: SignupDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException("Email already exists");

    const passwordHash = await bcrypt.hash(dto.password, 12);
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.passwordHash) throw new UnauthorizedException();
    if (user.status !== "ACTIVE") throw new UnauthorizedException("User inactive");

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return this.issueToken(user.id, user.email);
  }

  async oauthSignin(dto: OAuthSigninDto) {
    void dto;
    throw new UnauthorizedException("Use the verified OAuth authorization flow");
  }

  private issueToken(userId: string, email: string) {
    const token = this.jwt.sign({ sub: userId, email });
    return { accessToken: token };
  }

  async me(userId: string) {
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
    if (!user) throw new UnauthorizedException();
    const permissions = [...new Set(user.roles.flatMap((item) => item.role.permissions.map((entry) => `${entry.permission.module}:${entry.permission.action}`)))];
    return { id: user.id, email: user.email, name: user.name, userType: user.userType, roles: user.roles.map((item) => item.role.name), permissions };
  }

  async publicProviders() {
    const connections = await this.prisma.identityProviderConnection.findMany({ select: { provider: true, displayName: true, status: true, settings: true } });
    return connections.map((item) => ({ provider: item.provider, displayName: item.displayName, enabled: ["CONFIGURED", "CONNECTED"].includes(item.status), settings: item.settings }));
  }

  async oauthStart(provider: string, portal = "parent") {
    if (!["microsoft", "google", "apple"].includes(provider)) throw new BadRequestException("Unsupported provider");
    const connection = await this.prisma.identityProviderConnection.findFirst({ where: { provider, status: { in: ["CONFIGURED", "CONNECTED"] } } });
    if (!connection?.clientId) throw new BadRequestException(`${provider} is not configured for this school`);
    const settings = (connection.settings || {}) as Record<string, any>;
    const allowedPortals = (settings.allowedPortals || ["parent", "teacher", "admin"]) as string[];
    if (!allowedPortals.includes(portal)) throw new UnauthorizedException(`${provider} is disabled for the ${portal} portal`);
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    const state = this.jwt.sign({ purpose: "oauth", provider, portal, tenantId: connection.tenantId, verifier }, { expiresIn: "10m" });
    const redirectUri = this.redirectUri(provider);
    const scope = provider === "microsoft" ? "openid profile email offline_access User.Read" : provider === "google" ? "openid profile email" : "name email";
    const endpoint = provider === "microsoft"
      ? `https://login.microsoftonline.com/${connection.externalTenantId || "organizations"}/oauth2/v2.0/authorize`
      : provider === "google" ? "https://accounts.google.com/o/oauth2/v2/auth" : "https://appleid.apple.com/auth/authorize";
    const params = new URLSearchParams({ client_id: connection.clientId, redirect_uri: redirectUri, response_type: "code", scope, state, response_mode: provider === "apple" ? "form_post" : "query", code_challenge: challenge, code_challenge_method: "S256" });
    if (provider === "google") params.set("access_type", "offline");
    return { authorizationUrl: `${endpoint}?${params.toString()}` };
  }

  async oauthCallback(provider: string, code: string, state: string) {
    let stateData: any;
    try { stateData = this.jwt.verify(state); } catch { throw new UnauthorizedException("Invalid or expired OAuth state"); }
    if (stateData.purpose !== "oauth" || stateData.provider !== provider) throw new UnauthorizedException("OAuth state mismatch");
    const connection = await this.prisma.identityProviderConnection.findFirst({ where: { tenantId: stateData.tenantId, provider } });
    if (!connection?.clientId || !connection.encryptedCredentials) throw new BadRequestException("Provider credentials are incomplete");
    const credentials = decryptJson<{ clientSecret?: string; privateKey?: string; teamId?: string; keyId?: string }>(connection.encryptedCredentials as any);
    const tokenEndpoint = provider === "microsoft"
      ? `https://login.microsoftonline.com/${connection.externalTenantId || "organizations"}/oauth2/v2.0/token`
      : provider === "google" ? "https://oauth2.googleapis.com/token" : "https://appleid.apple.com/auth/token";
    const tokenBody = new URLSearchParams({ client_id: connection.clientId, code, grant_type: "authorization_code", redirect_uri: this.redirectUri(provider), code_verifier: stateData.verifier });
    if (credentials.clientSecret) tokenBody.set("client_secret", credentials.clientSecret);
    const tokenResponse = await fetch(tokenEndpoint, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: tokenBody });
    const token: any = await tokenResponse.json();
    if (!tokenResponse.ok || !token.access_token && !token.id_token) throw new UnauthorizedException(token.error_description || "Provider token exchange failed");
    let profile: any;
    if (provider === "apple") profile = await this.verifyAppleToken(token.id_token, connection.clientId);
    else {
      const userInfoUrl = provider === "google" ? "https://openidconnect.googleapis.com/v1/userinfo" : "https://graph.microsoft.com/oidc/userinfo";
      const response = await fetch(userInfoUrl, { headers: { authorization: `Bearer ${token.access_token}` } });
      profile = await response.json();
      if (!response.ok) throw new UnauthorizedException("Could not verify provider identity");
    }
    const email = String(profile.email || profile.preferred_username || "").toLowerCase();
    const subject = String(profile.sub || profile.id || "");
    if (!email || !subject) throw new UnauthorizedException("Provider did not return a verified email identity");
    if (provider === "google" && profile.email_verified !== true) throw new UnauthorizedException("Google email is not verified");
    const domain = email.split("@")[1];
    if (connection.tenantDomain && stateData.portal !== "parent" && domain !== connection.tenantDomain.toLowerCase()) throw new UnauthorizedException("Account is outside the approved school domain");
    const linkedAccount = await this.prisma.externalAccount.findUnique({ where: { provider_providerAccountId: { provider, providerAccountId: subject } }, include: { user: true } });
    let user = linkedAccount?.user || await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      const settings = (connection.settings || {}) as Record<string, any>;
      const userType = stateData.portal === "parent" ? "PARENT" : stateData.portal === "teacher" ? "TEACHER" : "ADMIN";
      if (userType === "TEACHER" && !settings.autoCreateTeachers) throw new UnauthorizedException("Teacher auto-provisioning is disabled; ask an administrator to create your account");
      if (userType === "ADMIN" && !settings.autoCreateAdmins) throw new UnauthorizedException("Administrator auto-provisioning is disabled");
      const roleName = userType === "PARENT" ? "Parent" : userType === "TEACHER" ? "Teacher" : "Administrator";
      const role = await this.prisma.role.findUnique({ where: { name: roleName } });
      user = await this.prisma.user.create({ data: { email, name: profile.name || null, userType, status: "ACTIVE", selfRegistered: userType === "PARENT", emailVerifiedAt: new Date(), roles: role ? { create: { roleId: role.id } } : undefined } });
    }
    if (user.status !== "ACTIVE") throw new UnauthorizedException("User inactive");
    if (linkedAccount && linkedAccount.userId !== user.id) throw new UnauthorizedException("Provider identity is already linked to another account");
    const encryptedTokens = encryptJson({ accessToken: token.access_token, refreshToken: token.refresh_token, idToken: token.id_token, expiresIn: token.expires_in, tokenType: token.token_type, obtainedAt: new Date().toISOString() });
    await this.prisma.externalAccount.upsert({ where: { provider_providerAccountId: { provider, providerAccountId: subject } }, update: { verifiedEmail: email, lastLoginAt: new Date(), metadata: { tenantId: connection.tenantId }, encryptedTokens }, create: { provider, providerAccountId: subject, userId: user.id, verifiedEmail: email, lastLoginAt: new Date(), metadata: { tenantId: connection.tenantId }, encryptedTokens } });
    await this.prisma.identityProviderConnection.update({ where: { id: connection.id }, data: { status: "CONNECTED", tokenHealth: "HEALTHY", connectedAt: connection.connectedAt || new Date(), lastError: null } });
    await this.prisma.auditLog.create({ data: { actorId: user.id, action: "identity.sso.login", entity: "ExternalAccount", entityId: `${provider}:${subject}`, data: { provider, email, portal: stateData.portal } } });
    return this.issueToken(user.id, user.email);
  }

  private redirectUri(provider: string) { return `${process.env.OAUTH_CALLBACK_BASE_URL || "http://localhost:4000/auth/oauth"}/${provider}/callback`; }

  private async verifyAppleToken(idToken: string, audience: string) {
    const [headerPart, payloadPart, signaturePart] = idToken.split(".");
    if (!headerPart || !payloadPart || !signaturePart) throw new UnauthorizedException("Invalid Apple identity token");
    const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    const jwks: any = await (await fetch("https://appleid.apple.com/auth/keys")).json();
    const jwk = jwks.keys?.find((key: any) => key.kid === header.kid);
    if (!jwk) throw new UnauthorizedException("Apple signing key not found");
    const valid = crypto.verify("RSA-SHA256", Buffer.from(`${headerPart}.${payloadPart}`), crypto.createPublicKey({ key: jwk, format: "jwk" }), Buffer.from(signaturePart, "base64url"));
    if (!valid || payload.iss !== "https://appleid.apple.com" || payload.aud !== audience || Number(payload.exp) * 1000 < Date.now()) throw new UnauthorizedException("Apple identity token validation failed");
    return payload;
  }
}
