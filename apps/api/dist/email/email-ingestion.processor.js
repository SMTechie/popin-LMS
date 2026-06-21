"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailIngestionProcessor = void 0;
const mailparser_1 = require("mailparser");
const prisma_service_1 = require("../common/prisma.service");
const bullmq_1 = require("bullmq");
const redis_1 = require("../queue/redis");
class EmailIngestionProcessor {
    static async handle() {
        const prisma = new prisma_service_1.PrismaService();
        await prisma.$connect();
        const accounts = await prisma.emailAccount.findMany({ where: { status: "ACTIVE" } });
        for (const account of accounts) {
            const rawMessages = await EmailIngestionProcessor.pollImap(account);
            for (const raw of rawMessages) {
                const parsed = await (0, mailparser_1.simpleParser)(raw);
                const subject = parsed.subject || "";
                const from = parsed.from?.text || "";
                const to = EmailIngestionProcessor.formatAddresses(parsed.to);
                const messageId = parsed.messageId || "";
                const existing = await prisma.emailMessage.findFirst({ where: { messageId } });
                if (existing)
                    continue;
                const routingRules = await prisma.emailRoutingRule.findMany({ where: { status: "ACTIVE" } });
                const matchedRule = routingRules.find((rule) => EmailIngestionProcessor.matchRule(rule.matchType, rule.matchValue, { subject, to }));
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
                const automationQueue = new bullmq_1.Queue("automation", { connection: (0, redis_1.getRedisConnection)() });
                await automationQueue.add("evaluate", {
                    type: "email.received",
                    payload: { messageId: message.id, boardId: resolvedBoardId }
                });
            }
        }
        await prisma.$disconnect();
    }
    static async pollImap(_account) {
        return [];
    }
    static formatAddresses(address) {
        if (!address)
            return "";
        if (Array.isArray(address)) {
            return address.map((entry) => entry.text || "").filter(Boolean).join(", ");
        }
        return address.text || "";
    }
    static matchRule(matchType, matchValue, data) {
        if (matchType === "recipient")
            return data.to.includes(matchValue);
        if (matchType === "subject_contains")
            return data.subject.includes(matchValue);
        return false;
    }
    static extractCardId(subject) {
        const match = subject.match(/\[(?:CARD|TICKET)-([a-f0-9-]{8,})\]/i);
        return match ? match[1] : null;
    }
}
exports.EmailIngestionProcessor = EmailIngestionProcessor;
//# sourceMappingURL=email-ingestion.processor.js.map