import { Global, Module } from "@nestjs/common";
import { RbacController } from "./rbac.controller";
import { RbacService } from "./rbac.service";
import { PrismaService } from "../common/prisma.service";

@Global()
@Module({
  controllers: [RbacController],
  providers: [RbacService, PrismaService],
  exports: [RbacService]
})
export class RbacModule {}
