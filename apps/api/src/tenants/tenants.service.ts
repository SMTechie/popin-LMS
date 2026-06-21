import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async getDefaultTenant() {
    const code = process.env.TENANT_CODE;
    const tenant = code
      ? await this.prisma.tenant.findUnique({ where: { code } })
      : await this.prisma.tenant.findFirst();

    if (!tenant) throw new NotFoundException("Tenant not configured");
    return tenant;
  }
}
