import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateRuleDto {
  @IsString()
  name!: string;

  @IsString()
  trigger!: string;

  @IsArray()
  conditions!: Record<string, unknown>[];

  @IsArray()
  actions!: Record<string, unknown>[];

  @IsOptional()
  @IsString()
  boardId?: string;
}
