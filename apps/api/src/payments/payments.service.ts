import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async handleWebhook(provider: "payfast" | "ozow", payload: Record<string, any>) {
    if (provider === "payfast" && !this.validatePayfast(payload)) {
      throw new BadRequestException("Invalid PayFast signature");
    }
    if (provider === "ozow" && !this.validateOzow(payload)) {
      throw new BadRequestException("Invalid Ozow signature");
    }
    const providerRef = String(payload.payment_reference || payload.TransactionReference || "");
    if (!providerRef) throw new BadRequestException("Missing provider reference");

    const existing = await this.prisma.paymentWebhook.findUnique({
      where: { provider_providerRef: { provider, providerRef } }
    });
    if (existing) return { status: "duplicate" };

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

  async verifyEft(orderId: string, verified: boolean, actorId: string) {
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

  private validatePayfast(_payload: Record<string, any>) {
    // TODO: implement PayFast signature validation using merchant key + passphrase.
    return true;
  }

  private validateOzow(_payload: Record<string, any>) {
    // TODO: implement Ozow signature validation using private key.
    return true;
  }
}
