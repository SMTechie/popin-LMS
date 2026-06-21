import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException
} from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { decryptJson, hashApiKey } from "../common/crypto";
import crypto from "crypto";

@Injectable()
export class ExternalIntegrationAuthGuard implements CanActivate {
  private static rateWindowMs = 60_000;
  private static rateLimit = 120;
  private static requestMap = new Map<string, number[]>();

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers["authorization"] || "";
    const secretHeader = req.headers["x-popin-secret"] || "";

    if (!authHeader.startsWith("Bearer ")) throw new UnauthorizedException("Missing API key");
    if (!secretHeader) throw new UnauthorizedException("Missing API secret");

    const apiKey = authHeader.replace("Bearer ", "").trim();
    const apiSecret = String(secretHeader);
    const keyHash = hashApiKey(apiKey);

    const keyRecord = await this.prisma.externalIntegrationKey.findFirst({
      where: { keyHash, active: true },
      include: { integration: true }
    });

    const integration = keyRecord?.integration
      ? keyRecord.integration
      : await this.prisma.externalIntegration.findFirst({ where: { apiKeyHash: keyHash } });

    if (!integration) throw new UnauthorizedException("Invalid API key");

    const decrypted = decryptJson<{ value: string }>(integration.apiSecretEncrypted as any);
    const secretOk = timingSafeEqual(decrypted.value, apiSecret);

    if (!secretOk) throw new UnauthorizedException("Secret mismatch");

    this.enforceRateLimit(integration.id);

    req.integration = integration;
    req.tenantId = integration.tenantId;

    return true;
  }

  private enforceRateLimit(integrationId: string) {
    const now = Date.now();
    const windowStart = now - ExternalIntegrationAuthGuard.rateWindowMs;
    const existing = ExternalIntegrationAuthGuard.requestMap.get(integrationId) || [];
    const updated = existing.filter((ts) => ts > windowStart);
    updated.push(now);
    ExternalIntegrationAuthGuard.requestMap.set(integrationId, updated);
    if (updated.length > ExternalIntegrationAuthGuard.rateLimit) {
      throw new ForbiddenException("Rate limit exceeded");
    }
  }
}

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}
