"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookProcessor = void 0;
const prisma_service_1 = require("../common/prisma.service");
const crypto_1 = require("../common/crypto");
const node_fetch_1 = __importDefault(require("node-fetch"));
const bullmq_1 = require("bullmq");
const redis_1 = require("../queue/redis");
const RETRY_DELAYS_MS = [
    60_000,
    5 * 60_000,
    15 * 60_000,
    60 * 60_000,
    6 * 60 * 60_000,
    24 * 60 * 60_000
];
class WebhookProcessor {
    static async handle(job) {
        const prisma = new prisma_service_1.PrismaService();
        await prisma.$connect();
        const delivery = await prisma.webhookDelivery.findUnique({ where: { id: job.data.deliveryId } });
        if (!delivery)
            return;
        const integration = await prisma.externalIntegration.findUnique({ where: { id: delivery.integrationId } });
        if (!integration || !integration.webhookSecretEncrypted)
            return;
        const decrypted = (0, crypto_1.decryptJson)(integration.webhookSecretEncrypted);
        const payload = JSON.stringify(delivery.payload);
        const timestamp = Date.now().toString();
        const signature = (0, crypto_1.signWebhook)(payload, timestamp, decrypted.value);
        let status = 0;
        try {
            const res = await (0, node_fetch_1.default)(delivery.targetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Popin-Event": delivery.eventType,
                    "X-Popin-Timestamp": timestamp,
                    "X-Popin-Delivery-Id": delivery.deliveryId,
                    "X-Popin-Signature": signature
                },
                body: payload
            });
            status = res.status;
        }
        catch {
            status = 0;
        }
        const attemptCount = delivery.attemptCount + 1;
        await prisma.webhookDelivery.update({
            where: { id: delivery.id },
            data: {
                attemptCount,
                lastStatusCode: status || null,
                lastAttemptAt: new Date()
            }
        });
        if (status >= 200 && status < 300) {
            await prisma.externalIntegration.update({
                where: { id: integration.id },
                data: { lastWebhookSentAt: new Date() }
            });
        }
        else if (attemptCount < 10) {
            const delay = RETRY_DELAYS_MS[Math.min(attemptCount - 1, RETRY_DELAYS_MS.length - 1)];
            const queue = new bullmq_1.Queue("webhook-delivery", { connection: (0, redis_1.getRedisConnection)() });
            await queue.add("deliver", { deliveryId: delivery.id }, { delay });
        }
        await prisma.$disconnect();
    }
}
exports.WebhookProcessor = WebhookProcessor;
//# sourceMappingURL=webhook.processor.js.map