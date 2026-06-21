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
exports.PublicFormsService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const tenants_service_1 = require("../tenants/tenants.service");
const prisma_service_1 = require("../common/prisma.service");
let PublicFormsService = class PublicFormsService {
    jwt;
    tenants;
    prisma;
    constructor(jwt, tenants, prisma) {
        this.jwt = jwt;
        this.tenants = tenants;
        this.prisma = prisma;
    }
    async createApplicationLink(expiresInMinutes = 60 * 24, integration) {
        const tenant = await this.tenants.getDefaultTenant();
        const payload = { tenantId: tenant.id, formType: "application" };
        const token = this.jwt.sign(payload, {
            secret: process.env.FORM_LINK_SECRET || "change-me",
            expiresIn: `${expiresInMinutes}m`
        });
        const baseUrl = integration?.publicApplyBaseUrl ||
            process.env.PUBLIC_APP_BASE_URL ||
            tenant.portalUrl ||
            "http://localhost:3000";
        const signedUrl = `${baseUrl.replace(/\/$/, "")}/applications/new?token=${token}`;
        if (integration?.id) {
            await this.prisma.externalIntegration.update({
                where: { id: integration.id },
                data: { lastApplicationLinkRequestAt: new Date() }
            });
        }
        return { signed_url: signedUrl, expiry_time: new Date(Date.now() + expiresInMinutes * 60000) };
    }
    verifyToken(token) {
        return this.jwt.verify(token, { secret: process.env.FORM_LINK_SECRET || "change-me" });
    }
};
exports.PublicFormsService = PublicFormsService;
exports.PublicFormsService = PublicFormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, tenants_service_1.TenantsService, prisma_service_1.PrismaService])
], PublicFormsService);
//# sourceMappingURL=public-forms.service.js.map