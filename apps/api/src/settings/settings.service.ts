import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.setting.findMany();
  }

  async get(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async set(key: string, value: Record<string, unknown>, actorId?: string, ip?: string, requestId?: string) {
    const jsonValue = value as Prisma.InputJsonValue;
    const previous = await this.prisma.setting.findUnique({ where: { key } });
    return this.prisma.$transaction(async (tx) => {
      const setting = await tx.setting.upsert({
        where: { key },
        update: { value: jsonValue },
        create: { key, value: jsonValue }
      });
      await tx.auditLog.create({
        data: {
          actorId: actorId || null,
          action: "settings.update",
          entity: "Setting",
          entityId: key,
          data: { oldValue: previous?.value ?? null, newValue: jsonValue } as Prisma.InputJsonValue,
          ip: ip || null,
          requestId: requestId || null
        }
      });
      return setting;
    });
  }
}
