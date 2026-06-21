import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RbacService } from "../../rbac/rbac.service";
export declare class PermissionGuard implements CanActivate {
    private reflector;
    private rbac;
    constructor(reflector: Reflector, rbac: RbacService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
