"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationProcessor = void 0;
const prisma_service_1 = require("../common/prisma.service");
class AutomationProcessor {
    static async handle(job) {
        const prisma = new prisma_service_1.PrismaService();
        await prisma.$connect();
        const { type, payload } = job.data;
        const rules = await prisma.automationRule.findMany({
            where: { trigger: type, status: "ACTIVE" },
            include: { versions: { orderBy: { version: "desc" }, take: 1 } }
        });
        for (const rule of rules) {
            const version = rule.versions[0];
            if (!version)
                continue;
            const run = await prisma.automationRun.create({
                data: {
                    ruleId: rule.id,
                    status: "RUNNING",
                    payload: payload
                }
            });
            try {
                const actions = version.actions || [];
                for (const action of actions) {
                    const a = action;
                    const type = String(a.type || "");
                    if (type === "move_card" && a.cardId && a.stageId) {
                        await prisma.card.update({
                            where: { id: String(a.cardId) },
                            data: { stageId: String(a.stageId) }
                        });
                    }
                    if (type === "add_comment" && a.cardId && a.body) {
                        await prisma.cardComment.create({
                            data: {
                                cardId: String(a.cardId),
                                body: String(a.body),
                                authorId: String(a.authorId || payload.userId || "")
                            }
                        });
                    }
                    if (type === "update_fields" && a.cardId && a.fields) {
                        const fields = a.fields;
                        for (const [key, value] of Object.entries(fields)) {
                            await prisma.cardFieldValue.upsert({
                                where: {
                                    cardId_fieldKey: {
                                        cardId: String(a.cardId),
                                        fieldKey: key
                                    }
                                },
                                update: { value: value },
                                create: {
                                    cardId: String(a.cardId),
                                    fieldKey: key,
                                    value: value
                                }
                            });
                        }
                    }
                }
                await prisma.automationRun.update({
                    where: { id: run.id },
                    data: { status: "SUCCESS", finishedAt: new Date() }
                });
            }
            catch (error) {
                await prisma.automationRun.update({
                    where: { id: run.id },
                    data: { status: "FAILED", finishedAt: new Date(), error: String(error) }
                });
            }
        }
        await prisma.$disconnect();
    }
}
exports.AutomationProcessor = AutomationProcessor;
//# sourceMappingURL=automation.processor.js.map