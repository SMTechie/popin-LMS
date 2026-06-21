import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { CreateBoardDto, CreateCardDto, MoveCardDto } from "./dto";
import { WorkflowService } from "../workflow/workflow.service";
import { ApplicationsService } from "../applications/applications.service";

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService, private workflow: WorkflowService, private applications: ApplicationsService) {}

  listBoards() {
    return this.prisma.board.findMany({
      include: { stages: { orderBy: { order: "asc" } } }
    });
  }

  async createBoard(dto: CreateBoardDto) {
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

  async listCards(boardId: string, page = 1, pageSize = 20) {
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

  async createCard(dto: CreateCardDto, actorId: string) {
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
      if (application && application.status !== "Accepted") await this.applications.approveApplication(application.id, {}, actorId);
    }

    return card;
  }

  async moveCard(cardId: string, dto: MoveCardDto, actorId: string) {
    const existing = await this.prisma.card.findUnique({ where: { id: cardId } });
    if (!existing) return null;

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
      if (application && application.status !== "Accepted") await this.applications.approveApplication(application.id, {}, actorId);
    }

    return card;
  }
}
