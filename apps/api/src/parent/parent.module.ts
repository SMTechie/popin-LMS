import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { TenantsModule } from "../tenants/tenants.module";
import { ParentController } from "./parent.controller";
import { ParentService } from "./parent.service";
import { HostelModule } from "../hostel/hostel.module";

@Module({ imports: [TenantsModule, HostelModule], controllers: [ParentController], providers: [ParentService, PrismaService] })
export class ParentModule {}
