import { Injectable, BadRequestException } from "@nestjs/common";
import bcrypt from "bcryptjs";
import { PrismaService } from "../common/prisma.service";
import { CreateUserDto, UpdateUserStatusDto } from "./dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async list(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.user.count()
    ]);

    return { items, total, page, pageSize };
  }

  async create(dto: CreateUserDto) {
    const license = await this.prisma.license.findFirst({ orderBy: { createdAt: "desc" } });
    if (license) {
      const totalUsers = await this.prisma.user.count();
      if (totalUsers >= license.maxUsers) {
        throw new BadRequestException("License limit reached");
      }
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException("Email already exists");

    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name || null,
        passwordHash,
        status: "ACTIVE"
      }
    });
  }

  async setStatus(userId: string, dto: UpdateUserStatusDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { status: dto.active ? "ACTIVE" : "INACTIVE" }
    });
  }
}
