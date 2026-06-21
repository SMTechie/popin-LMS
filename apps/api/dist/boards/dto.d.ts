export declare class CreateBoardDto {
    name: string;
    module: string;
    description?: string;
    stages: {
        name: string;
        order: number;
    }[];
}
export declare class CreateCardDto {
    boardId: string;
    stageId: string;
    title: string;
    description?: string;
}
export declare class MoveCardDto {
    stageId: string;
}
