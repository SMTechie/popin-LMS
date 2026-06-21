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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../common/prisma.service");
const queue_service_1 = require("../queue/queue.service");
let EmailService = class EmailService {
    prisma;
    queues;
    constructor(prisma, queues) {
        this.prisma = prisma;
        this.queues = queues;
    }
    async listRoutingRules() {
        return this.prisma.emailRoutingRule.findMany({ orderBy: { createdAt: "desc" } });
    }
    async createRoutingRule(data) {
        return this.prisma.emailRoutingRule.create({
            data: {
                name: data.name,
                boardId: data.boardId,
                matchType: data.matchType,
                matchValue: data.matchValue
            }
        });
    }
    async enqueueIngestion() {
        await this.queues.emailIngestionQueue.add("poll", {}, { attempts: 3, backoff: { type: "exponential", delay: 10000 } });
    }
};
exports.EmailService = EmailService;
__decorate([
    (0, schedule_1.Cron)("*/2 * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmailService.prototype, "enqueueIngestion", null);
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, queue_service_1.QueueService])
], EmailService);
//# sourceMappingURL=email.service.js.map