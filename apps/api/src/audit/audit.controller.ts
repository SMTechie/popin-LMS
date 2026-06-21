import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { PrismaService } from "../common/prisma.service";

@Controller("audit")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AuditController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Permissions({ module: "licensing", action: "view" })
  async list(@Query("page") page = "1", @Query("pageSize") pageSize = "20") {
    const skip = (Number(page) - 1) * Number(pageSize);
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(pageSize)
      }),
      this.prisma.auditLog.count()
    ]);

    return { items, total, page: Number(page), pageSize: Number(pageSize) };
  }
}
