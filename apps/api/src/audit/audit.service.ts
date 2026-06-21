import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: { actorId?: string; action: string; entity: string; entityId?: string; data?: Record<string, unknown>; ip?: string; requestId?: string }) {
    const data = input.data ? (input.data as Prisma.InputJsonValue) : undefined;
    return this.prisma.auditLog.create({
      data: {
        actorId: input.actorId || null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId || null,
        data,
        ip: input.ip || null,
        requestId: input.requestId || null
      }
    });
  }
}
