import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { AuditModule } from "../audit/audit.module";
import { HostelController } from "./hostel.controller";
import { HostelService } from "./hostel.service";

@Module({ imports: [TenantsModule, AuditModule], controllers: [HostelController], providers: [HostelService, PrismaService], exports: [HostelService] })
export class HostelModule {}
