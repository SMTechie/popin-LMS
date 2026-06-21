import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { AuditModule } from "../audit/audit.module";
import { IdentityController } from "./identity.controller";
import { IdentityService } from "./identity.service";

@Module({ imports: [TenantsModule, AuditModule], controllers: [IdentityController], providers: [IdentityService, PrismaService] })
export class IdentityModule {}
