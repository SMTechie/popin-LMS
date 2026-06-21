import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { QueueService } from "../queue/queue.service";
import { v4 as uuid } from "uuid";

@Injectable()
export class WebhookService {
  constructor(private prisma: PrismaService, private queues: QueueService) {}

  async emitStoreEvent(tenantId: string, integrationId: string, eventType: string, payload: object) {
    const integration = await this.prisma.externalIntegration.findUnique({ where: { id: integrationId } });
    if (!integration || !integration.webhookEnabled || !integration.webhookTargetUrl) return;

    const deliveryId = uuid();
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

    await this.queues.webhookQueue.add(
      "deliver",
      { deliveryId: delivery.id },
      { attempts: 1, removeOnComplete: true, removeOnFail: false }
    );

    return delivery;
  }

  async emitShopCatalogUpdated(tenantId: string, integrationId: string, payload: object) {
    return this.emitStoreEvent(tenantId, integrationId, "store.catalog.updated", payload);
  }
}
