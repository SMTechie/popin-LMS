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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        return this.prisma.setting.findMany();
    }
    async get(key) {
        return this.prisma.setting.findUnique({ where: { key } });
    }
    async set(key, value, actorId, ip, requestId) {
        const jsonValue = value;
        const previous = await this.prisma.setting.findUnique({ where: { key } });
        return this.prisma.$transaction(async (tx) => {
            const setting = await tx.setting.upsert({
                where: { key },
                update: { value: jsonValue },
                create: { key, value: jsonValue }
            });
            await tx.auditLog.create({
                data: {
                    actorId: actorId || null,
                    action: "settings.update",
                    entity: "Setting",
                    entityId: key,
                    data: { oldValue: previous?.value ?? null, newValue: jsonValue },
                    ip: ip || null,
                    requestId: requestId || null
                }
            });
            return setting;
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map