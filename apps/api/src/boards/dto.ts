import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBoardDto {
  @IsString()
  name!: string;

  @IsString()
  module!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  stages!: { name: string; order: number }[];
}

export class CreateCardDto {
  @IsUUID()
  boardId!: string;

  @IsUUID()
  stageId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class MoveCardDto {
  @IsUUID()
  stageId!: string;
}
