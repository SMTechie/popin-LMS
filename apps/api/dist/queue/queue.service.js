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
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const automation_processor_1 = require("../workflow/automation.processor");
const email_ingestion_processor_1 = require("../email/email-ingestion.processor");
const webhook_processor_1 = require("../webhooks/webhook.processor");
const redis_1 = require("./redis");
let QueueService = class QueueService {
    connection;
    automationQueue;
    emailIngestionQueue;
    webhookQueue;
    constructor() {
        this.connection = (0, redis_1.getRedisConnection)();
        this.automationQueue = new bullmq_1.Queue("automation", { connection: this.connection });
        this.emailIngestionQueue = new bullmq_1.Queue("email-ingestion", { connection: this.connection });
        this.webhookQueue = new bullmq_1.Queue("webhook-delivery", { connection: this.connection });
        new bullmq_1.Worker("automation", automation_processor_1.AutomationProcessor.handle, { connection: this.connection });
        new bullmq_1.Worker("email-ingestion", email_ingestion_processor_1.EmailIngestionProcessor.handle, { connection: this.connection });
        new bullmq_1.Worker("webhook-delivery", webhook_processor_1.WebhookProcessor.handle, { connection: this.connection });
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QueueService);
//# sourceMappingURL=queue.service.js.map