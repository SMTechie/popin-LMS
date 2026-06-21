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
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const queue_service_1 = require("../queue/queue.service");
const uuid_1 = require("uuid");
let WebhookService = class WebhookService {
    prisma;
    queues;
    constructor(prisma, queues) {
        this.prisma = prisma;
        this.queues = queues;
    }
    async emitStoreEvent(tenantId, integrationId, eventType, payload) {
        const integration = await this.prisma.externalIntegration.findUnique({ where: { id: integrationId } });
        if (!integration || !integration.webhookEnabled || !integration.webhookTargetUrl)
            return;
        const deliveryId = (0, uuid_1.v4)();
        const delivery = await this.prisma.webhookDelivery.create({
            data: {
                tenantId,
                integrationId,
                eventType,
                targetUrl: integration.webhookTargetUrl,
                payload,
                deliveryId,
                attemptCount: 0
            }
        });
        await this.queues.webhookQueue.add("deliver", { deliveryId: delivery.id }, { attempts: 1, removeOnComplete: true, removeOnFail: false });
        return delivery;
    }
    async emitShopCatalogUpdated(tenantId, integrationId, payload) {
        return this.emitStoreEvent(tenantId, integrationId, "store.catalog.updated", payload);
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, queue_service_1.QueueService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map