import { Injectable } from "@nestjs/common";
import webpush from "web-push";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || "mailto:admin@school.co.za",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    }
  }

  async subscribe(userId: string, subscription: { endpoint: string; keys: { p256dh: string; auth: string } }) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: { userId, keys: subscription.keys },
      create: { userId, endpoint: subscription.endpoint, keys: subscription.keys }
    });
  }

  async send(userId: string, payload: Record<string, unknown>) {
    const subscriptions = await this.prisma.pushSubscription.findMany({ where: { userId } });

    for (const sub of subscriptions) {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as unknown as { p256dh: string; auth: string }
        },
        JSON.stringify(payload)
      );
    }

    return { sent: subscriptions.length };
  }
}
