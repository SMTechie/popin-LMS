import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { AuditModule } from "../audit/audit.module";
import { StudentsController } from "./students.controller";
import { StudentsService } from "./students.service";

@Module({ imports: [TenantsModule, AuditModule], controllers: [StudentsController], providers: [StudentsService, PrismaService], exports: [StudentsService] })
export class StudentsModule {}
