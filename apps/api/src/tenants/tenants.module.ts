import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "./tenants.service";

@Module({
  providers: [TenantsService, PrismaService],
  exports: [TenantsService]
})
export class TenantsModule {}
