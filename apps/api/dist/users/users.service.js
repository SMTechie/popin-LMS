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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_service_1 = require("../common/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" }
            }),
            this.prisma.user.count()
        ]);
        return { items, total, page, pageSize };
    }
    async create(dto) {
        const license = await this.prisma.license.findFirst({ orderBy: { createdAt: "desc" } });
        if (license) {
            const totalUsers = await this.prisma.user.count();
            if (totalUsers >= license.maxUsers) {
                throw new common_1.BadRequestException("License limit reached");
            }
        }
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.BadRequestException("Email already exists");
        const passwordHash = await bcryptjs_1.default.hash(dto.password, 12);
        return this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name || null,
                passwordHash,
                status: "ACTIVE"
            }
        });
    }
    async setStatus(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: dto.active ? "ACTIVE" : "INACTIVE" }
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map