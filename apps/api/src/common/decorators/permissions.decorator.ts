import { SetMetadata } from "@nestjs/common";
import { ExtendedPermissionAction, ModuleKey } from "@popin/shared";

export type PermissionRequirement = {
  module: ModuleKey;
  action: ExtendedPermissionAction;
  boardIdParam?: string;
  stageIdParam?: string;
};

export const PERMISSIONS_KEY = "permissions";

export const Permissions = (...permissions: PermissionRequirement[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
