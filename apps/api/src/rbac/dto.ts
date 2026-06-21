import { IsArray, IsOptional, IsString } from "class-validator";
import { ModuleKey, PermissionAction } from "@popin/shared";

export class CreateRoleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignRoleDto {
  @IsString()
  userId!: string;

  @IsString()
  roleId!: string;
}

export class UpsertPermissionDto {
  @IsString()
  module!: ModuleKey;

  @IsString()
  action!: PermissionAction;

  @IsOptional()
  @IsString()
  boardId?: string;

  @IsOptional()
  @IsString()
  stageId?: string;
}

export class UpdateRolePermissionsDto {
  @IsString()
  roleId!: string;

  @IsArray()
  permissions!: UpsertPermissionDto[];
}
