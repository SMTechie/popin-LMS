import { BoardsService } from "./boards.service";
import { CreateBoardDto, CreateCardDto, MoveCardDto } from "./dto";
export declare class BoardsController {
    private boards;
    constructor(boards: BoardsService);
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
    listCards(boardId: string, page?: string, pageSize?: string): Promise<{
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
    createCard(dto: CreateCardDto, user: {
        id: string;
    }): Promise<{
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
    moveCard(cardId: string, dto: MoveCardDto, user: {
        id: string;
    }): Promise<{
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
