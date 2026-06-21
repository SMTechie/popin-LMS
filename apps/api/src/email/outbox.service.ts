import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class EmailOutboxService {
  constructor(private prisma: PrismaService) {}

  queueEmail(input: { to: string; subject: string; body: string }) {
    return this.prisma.emailOutbox.create({
      data: {
        to: input.to,
        subject: input.subject,
        body: input.body,
        status: "PENDING"
      }
    });
  }
}
