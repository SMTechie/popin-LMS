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
var ExternalIntegrationAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalIntegrationAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const crypto_1 = require("../common/crypto");
const crypto_2 = __importDefault(require("crypto"));
let ExternalIntegrationAuthGuard = class ExternalIntegrationAuthGuard {
    static { ExternalIntegrationAuthGuard_1 = this; }
    prisma;
    static rateWindowMs = 60_000;
    static rateLimit = 120;
    static requestMap = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers["authorization"] || "";
        const secretHeader = req.headers["x-popin-secret"] || "";
        if (!authHeader.startsWith("Bearer "))
            throw new common_1.UnauthorizedException("Missing API key");
        if (!secretHeader)
            throw new common_1.UnauthorizedException("Missing API secret");
        const apiKey = authHeader.replace("Bearer ", "").trim();
        const apiSecret = String(secretHeader);
        const keyHash = (0, crypto_1.hashApiKey)(apiKey);
        const keyRecord = await this.prisma.externalIntegrationKey.findFirst({
            where: { keyHash, active: true },
            include: { integration: true }
        });
        const integration = keyRecord?.integration
            ? keyRecord.integration
            : await this.prisma.externalIntegration.findFirst({ where: { apiKeyHash: keyHash } });
        if (!integration)
            throw new common_1.UnauthorizedException("Invalid API key");
        const decrypted = (0, crypto_1.decryptJson)(integration.apiSecretEncrypted);
        const secretOk = timingSafeEqual(decrypted.value, apiSecret);
        if (!secretOk)
            throw new common_1.UnauthorizedException("Secret mismatch");
        this.enforceRateLimit(integration.id);
        req.integration = integration;
        req.tenantId = integration.tenantId;
        return true;
    }
    enforceRateLimit(integrationId) {
        const now = Date.now();
        const windowStart = now - ExternalIntegrationAuthGuard_1.rateWindowMs;
        const existing = ExternalIntegrationAuthGuard_1.requestMap.get(integrationId) || [];
        const updated = existing.filter((ts) => ts > windowStart);
        updated.push(now);
        ExternalIntegrationAuthGuard_1.requestMap.set(integrationId, updated);
        if (updated.length > ExternalIntegrationAuthGuard_1.rateLimit) {
            throw new common_1.ForbiddenException("Rate limit exceeded");
        }
    }
};
exports.ExternalIntegrationAuthGuard = ExternalIntegrationAuthGuard;
exports.ExternalIntegrationAuthGuard = ExternalIntegrationAuthGuard = ExternalIntegrationAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExternalIntegrationAuthGuard);
function timingSafeEqual(a, b) {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length)
        return false;
    return crypto_2.default.timingSafeEqual(aBuf, bBuf);
}
//# sourceMappingURL=integration-auth.guard.js.map