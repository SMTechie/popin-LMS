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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const workflow_service_1 = require("../workflow/workflow.service");
const applications_service_1 = require("../applications/applications.service");
let BoardsService = class BoardsService {
    prisma;
    workflow;
    applications;
    constructor(prisma, workflow, applications) {
        this.prisma = prisma;
        this.workflow = workflow;
        this.applications = applications;
    }
    listBoards() {
        return this.prisma.board.findMany({
            include: { stages: { orderBy: { order: "asc" } } }
        });
    }
    async createBoard(dto) {
        return this.prisma.board.create({
            data: {
                name: dto.name,
                module: dto.module,
                description: dto.description || null,
                stages: {
                    create: dto.stages.map((stage) => ({
                        name: stage.name,
                        order: stage.order
                    }))
                }
            },
            include: { stages: true }
        });
    }
    async listCards(boardId, page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            this.prisma.card.findMany({
                where: { boardId },
                include: { stage: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: pageSize
            }),
            this.prisma.card.count({ where: { boardId } })
        ]);
        return { items, total, page, pageSize };
    }
    async createCard(dto, actorId) {
        const card = await this.prisma.card.create({
            data: {
                boardId: dto.boardId,
                stageId: dto.stageId,
                title: dto.title,
                description: dto.description || null,
                createdById: actorId
            }
        });
        await this.prisma.cardStageHistory.create({
            data: {
                cardId: card.id,
                fromStageId: null,
                toStageId: dto.stageId,
                movedById: actorId
            }
        });
        await this.workflow.enqueueEvent({
            type: "card.created",
            payload: { cardId: card.id, boardId: dto.boardId, stageId: dto.stageId, userId: actorId }
        });
        const [board, targetStage] = await Promise.all([
            this.prisma.board.findUnique({ where: { id: card.boardId } }),
            this.prisma.boardStage.findUnique({ where: { id: dto.stageId } })
        ]);
        if (board?.module === "admissions" && targetStage?.name.toLowerCase() === "accepted") {
            const reference = card.title.replace(/^Application\s+/i, "").trim();
            const application = await this.prisma.application.findUnique({ where: { reference } });
            if (application && application.status !== "Accepted")
                await this.applications.approveApplication(application.id, {}, actorId);
        }
        return card;
    }
    async moveCard(cardId, dto, actorId) {
        const existing = await this.prisma.card.findUnique({ where: { id: cardId } });
        if (!existing)
            return null;
        const card = await this.prisma.card.update({
            where: { id: cardId },
            data: { stageId: dto.stageId }
        });
        await this.prisma.cardStageHistory.create({
            data: {
                cardId: card.id,
                fromStageId: existing.stageId,
                toStageId: dto.stageId,
                movedById: actorId
            }
        });
        await this.workflow.enqueueEvent({
            type: "card.moved",
            payload: { cardId: card.id, boardId: card.boardId, stageId: dto.stageId, userId: actorId }
        });
        const [board, targetStage] = await Promise.all([
            this.prisma.board.findUnique({ where: { id: card.boardId } }),
            this.prisma.boardStage.findUnique({ where: { id: dto.stageId } })
        ]);
        if (board?.module === "admissions" && targetStage?.name.toLowerCase() === "accepted") {
            const reference = card.title.replace(/^Application\s+/i, "").trim();
            const application = await this.prisma.application.findUnique({ where: { reference } });
            if (application && application.status !== "Accepted")
                await this.applications.approveApplication(application.id, {}, actorId);
        }
        return card;
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, workflow_service_1.WorkflowService, applications_service_1.ApplicationsService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map