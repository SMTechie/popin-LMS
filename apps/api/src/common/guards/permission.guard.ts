import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ALLOW_ANON_KEY } from "../decorators/allow-anon.decorator";
import { PERMISSIONS_KEY, PermissionRequirement } from "../decorators/permissions.decorator";
import { RbacService } from "../../rbac/rbac.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private rbac: RbacService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAnon = this.reflector.getAllAndOverride<boolean>(ALLOW_ANON_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      if (allowAnon) return true;
      throw new UnauthorizedException();
    }

    const permissions = this.reflector.getAllAndOverride<PermissionRequirement[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!permissions || permissions.length === 0) {
      return true;
    }

    const hasAll = await Promise.all(
      permissions.map(async (perm) => {
        const enabled = await this.rbac.isModuleEnabled(perm.module);
        if (!enabled) return false;
        return this.rbac.hasPermission(user.id, {
          module: perm.module,
          action: perm.action,
          boardId: perm.boardIdParam ? req.params[perm.boardIdParam] : undefined,
          stageId: perm.stageIdParam ? req.params[perm.stageIdParam] : undefined
        });
      })
    );

    if (hasAll.every(Boolean)) return true;

    throw new ForbiddenException("Insufficient permissions");
  }
}
