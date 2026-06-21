import { PrismaService } from "../common/prisma.service";
import { decryptJson, signWebhook } from "../common/crypto";
import fetch from "node-fetch";
import { Queue } from "bullmq";
import { getRedisConnection } from "../queue/redis";

const RETRY_DELAYS_MS = [
  60_000,
  5 * 60_000,
  15 * 60_000,
  60 * 60_000,
  6 * 60 * 60_000,
  24 * 60 * 60_000
];

export class WebhookProcessor {
  static async handle(job: { data: { deliveryId: string } }) {
    const prisma = new PrismaService();
    await prisma.$connect();

    const delivery = await prisma.webhookDelivery.findUnique({ where: { id: job.data.deliveryId } });
    if (!delivery) return;

    const integration = await prisma.externalIntegration.findUnique({ where: { id: delivery.integrationId } });
    if (!integration || !integration.webhookSecretEncrypted) return;

    const decrypted = decryptJson<{ value: string }>(integration.webhookSecretEncrypted as any);
    const payload = JSON.stringify(delivery.payload);
    const timestamp = Date.now().toString();
    const signature = signWebhook(payload, timestamp, decrypted.value);

    let status = 0;
    try {
      const res = await fetch(delivery.targetUrl, {
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
    } catch {
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
    } else if (attemptCount < 10) {
      const delay = RETRY_DELAYS_MS[Math.min(attemptCount - 1, RETRY_DELAYS_MS.length - 1)];
      const queue = new Queue("webhook-delivery", { connection: getRedisConnection() });
      await queue.add("deliver", { deliveryId: delivery.id }, { delay });
    }

    await prisma.$disconnect();
  }
}
