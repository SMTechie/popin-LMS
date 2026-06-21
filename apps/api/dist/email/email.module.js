"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailModule = void 0;
const common_1 = require("@nestjs/common");
const email_controller_1 = require("./email.controller");
const email_service_1 = require("./email.service");
const outbox_service_1 = require("./outbox.service");
const prisma_service_1 = require("../common/prisma.service");
const queue_service_1 = require("../queue/queue.service");
let EmailModule = class EmailModule {
};
exports.EmailModule = EmailModule;
exports.EmailModule = EmailModule = __decorate([
    (0, common_1.Module)({
        controllers: [email_controller_1.EmailController],
        providers: [email_service_1.EmailService, outbox_service_1.EmailOutboxService, prisma_service_1.PrismaService, queue_service_1.QueueService],
        exports: [outbox_service_1.EmailOutboxService]
    })
], EmailModule);
//# sourceMappingURL=email.module.js.map