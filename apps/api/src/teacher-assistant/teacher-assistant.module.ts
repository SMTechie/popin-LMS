import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { TeacherAssistantController } from "./teacher-assistant.controller";
import { TeacherAssistantService } from "./teacher-assistant.service";

@Module({ imports: [TenantsModule], controllers: [TeacherAssistantController], providers: [TeacherAssistantService, PrismaService] })
export class TeacherAssistantModule {}
