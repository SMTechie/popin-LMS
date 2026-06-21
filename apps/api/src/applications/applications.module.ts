import { Module } from "@nestjs/common";
import { ApplicationsController } from "./applications.controller";
import { ApplicationsService } from "./applications.service";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { EmailModule } from "../email/email.module";
import { AuditModule } from "../audit/audit.module";
import { WorkflowModule } from "../workflow/workflow.module";
import { PublicFormsModule } from "../public-forms/public-forms.module";
import { StudentsModule } from "../students/students.module";

@Module({
  imports: [TenantsModule, EmailModule, AuditModule, WorkflowModule, PublicFormsModule, StudentsModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PrismaService],
  exports: [ApplicationsService]
})
export class ApplicationsModule {}
