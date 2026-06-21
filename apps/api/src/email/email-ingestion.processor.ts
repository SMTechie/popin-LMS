import { simpleParser, AddressObject } from "mailparser";
import { PrismaService } from "../common/prisma.service";
import { Queue } from "bullmq";
import { getRedisConnection } from "../queue/redis";

export class EmailIngestionProcessor {
  static async handle() {
    const prisma = new PrismaService();
    await prisma.$connect();

    const accounts = await prisma.emailAccount.findMany({ where: { status: "ACTIVE" } });

    for (const account of accounts) {
      const rawMessages: string[] = await EmailIngestionProcessor.pollImap(account);

      for (const raw of rawMessages) {
        const parsed = await simpleParser(raw);
        const subject = parsed.subject || "";
        const from = parsed.from?.text || "";
        const to = EmailIngestionProcessor.formatAddresses(parsed.to);
        const messageId = parsed.messageId || "";

        const existing = await prisma.emailMessage.findFirst({ where: { messageId } });
        if (existing) continue;

        const routingRules = await prisma.emailRoutingRule.findMany({ where: { status: "ACTIVE" } });
        const matchedRule = routingRules.find((rule: { matchType: string; matchValue: string; boardId: string | null }) =>
          EmailIngestionProcessor.matchRule(rule.matchType, rule.matchValue, { subject, to })
        );

        const cardId = EmailIngestionProcessor.extractCardId(subject);
        const resolvedBoardId = matchedRule?.boardId || null;

        const message = await prisma.emailMessage.create({
          data: {
            accountId: account.id,
            messageId,
            subject,
            from,
            to,
            raw,
            boardId: resolvedBoardId,
            cardId
          }
        });

        if (cardId) {
          await prisma.cardComment.create({
            data: {
              cardId,
              body: `Email received from ${from}: ${subject}`,
              authorId: account.defaultUserId || account.createdById
            }
          });
        }

        await prisma.emailThread.create({
          data: { messageId: message.id }
        });

        const automationQueue = new Queue("automation", { connection: getRedisConnection() });
        await automationQueue.add("evaluate", {
          type: "email.received",
          payload: { messageId: message.id, boardId: resolvedBoardId }
        });
      }
    }

    await prisma.$disconnect();
  }

  private static async pollImap(_account: { id: string }) {
    // Placeholder for IMAP polling. Implement with node-imap or Gmail/Microsoft SDKs.
    return [] as string[];
  }

  private static formatAddresses(address?: AddressObject | AddressObject[]) {
    if (!address) return "";
    if (Array.isArray(address)) {
      return address.map((entry) => entry.text || "").filter(Boolean).join(", ");
    }
    return address.text || "";
  }

  private static matchRule(matchType: string, matchValue: string, data: { subject: string; to: string }) {
    if (matchType === "recipient") return data.to.includes(matchValue);
    if (matchType === "subject_contains") return data.subject.includes(matchValue);
    return false;
  }

  private static extractCardId(subject: string) {
    const match = subject.match(/\[(?:CARD|TICKET)-([a-f0-9-]{8,})\]/i);
    return match ? match[1] : null;
  }
}
