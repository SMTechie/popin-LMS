import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { RbacModule } from "../rbac/rbac.module";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";

@Module({
  imports: [TenantsModule, RbacModule],
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService]
})
export class TeacherModule {}
