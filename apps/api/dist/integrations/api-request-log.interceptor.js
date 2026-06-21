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
exports.ApiRequestLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../common/prisma.service");
let ApiRequestLogInterceptor = class ApiRequestLogInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const start = Date.now();
        return next.handle().pipe((0, operators_1.tap)(async () => {
            const integration = req.integration;
            if (!integration)
                return;
            const latencyMs = Date.now() - start;
            const statusCode = req.res?.statusCode || 200;
            const ipAddress = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;
            const userAgent = req.headers["user-agent"];
            const headers = {
                "x-popin-secret": req.headers["x-popin-secret"] ? "***" : undefined,
                authorization: req.headers["authorization"] ? "Bearer ***" : undefined,
                "user-agent": userAgent
            };
            await this.prisma.apiRequestLog.create({
                data: {
                    tenantId: integration.tenantId,
                    integrationId: integration.id,
                    endpoint: req.originalUrl,
                    method: req.method,
                    statusCode,
                    latencyMs,
                    ipAddress,
                    userAgent: userAgent || null,
                    headers
                }
            });
            await this.prisma.externalIntegration.update({
                where: { id: integration.id },
                data: { lastApiCallAt: new Date() }
            });
        }));
    }
};
exports.ApiRequestLogInterceptor = ApiRequestLogInterceptor;
exports.ApiRequestLogInterceptor = ApiRequestLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiRequestLogInterceptor);
//# sourceMappingURL=api-request-log.interceptor.js.map