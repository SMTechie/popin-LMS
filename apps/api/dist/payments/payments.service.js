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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleWebhook(provider, payload) {
        if (provider === "payfast" && !this.validatePayfast(payload)) {
            throw new common_1.BadRequestException("Invalid PayFast signature");
        }
        if (provider === "ozow" && !this.validateOzow(payload)) {
            throw new common_1.BadRequestException("Invalid Ozow signature");
        }
        const providerRef = String(payload.payment_reference || payload.TransactionReference || "");
        if (!providerRef)
            throw new common_1.BadRequestException("Missing provider reference");
        const existing = await this.prisma.paymentWebhook.findUnique({
            where: { provider_providerRef: { provider, providerRef } }
        });
        if (existing)
            return { status: "duplicate" };
        const webhook = await this.prisma.paymentWebhook.create({
            data: {
                provider,
                providerRef,
                payload
            }
        });
        const transaction = await this.prisma.paymentTransaction.upsert({
            where: { provider_providerRef: { provider, providerRef } },
            update: { status: "PAID" },
            create: {
                provider,
                providerRef,
                amount: Number(payload.amount || payload.Amount || 0),
                currency: String(payload.currency || "ZAR"),
                status: "PAID"
            }
        });
        if (transaction.orderId) {
            await this.prisma.storeOrder.update({
                where: { id: transaction.orderId },
                data: { status: "Paid" }
            });
        }
        return { status: "ok", webhookId: webhook.id };
    }
    async verifyEft(orderId, verified, actorId) {
        const status = verified ? "Paid" : "PendingEFTVerification";
        return this.prisma.storeOrder.update({
            where: { id: orderId },
            data: {
                status,
                eftVerifiedById: actorId,
                eftVerifiedAt: new Date()
            }
        });
    }
    validatePayfast(_payload) {
        return true;
    }
    validateOzow(_payload) {
        return true;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map