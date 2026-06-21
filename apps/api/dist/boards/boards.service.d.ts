import { PrismaService } from "../common/prisma.service";
import { CreateBoardDto, CreateCardDto, MoveCardDto } from "./dto";
import { WorkflowService } from "../workflow/workflow.service";
import { ApplicationsService } from "../applications/applications.service";
export declare class BoardsService {
    private prisma;
    private workflow;
    private applications;
    constructor(prisma: PrismaService, workflow: WorkflowService, applications: ApplicationsService);
    listBoards(): import("@prisma/client").Prisma.PrismaPromise<({
        stages: {
            id: string;
            name: string;
            order: number;
            boardId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        module: string;
    })[]>;
    createBoard(dto: CreateBoardDto): Promise<{
        stages: {
            id: string;
            name: string;
            order: number;
            boardId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        module: string;
    }>;
    listCards(boardId: string, page?: number, pageSize?: number): Promise<{
        items: ({
            stage: {
                id: string;
                name: string;
                order: number;
                boardId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            createdById: string;
            assignedToId: string | null;
            boardId: string;
            stageId: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    createCard(dto: CreateCardDto, actorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        createdById: string;
        assignedToId: string | null;
        boardId: string;
        stageId: string;
    }>;
    moveCard(cardId: string, dto: MoveCardDto, actorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        createdById: string;
        assignedToId: string | null;
        boardId: string;
        stageId: string;
    } | null>;
}
