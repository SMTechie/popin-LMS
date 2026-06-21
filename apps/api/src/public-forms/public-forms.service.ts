import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TenantsService } from "../tenants/tenants.service";
import { ExternalIntegration } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class PublicFormsService {
  constructor(private jwt: JwtService, private tenants: TenantsService, private prisma: PrismaService) {}

  async createApplicationLink(expiresInMinutes = 60 * 24, integration?: ExternalIntegration) {
    const tenant = await this.tenants.getDefaultTenant();
    const payload = { tenantId: tenant.id, formType: "application" };
    const token = this.jwt.sign(payload, {
      secret: process.env.FORM_LINK_SECRET || "change-me",
      expiresIn: `${expiresInMinutes}m`
    });

    const baseUrl =
      integration?.publicApplyBaseUrl ||
      process.env.PUBLIC_APP_BASE_URL ||
      tenant.portalUrl ||
      "http://localhost:3000";

    const signedUrl = `${baseUrl.replace(/\/$/, "")}/applications/new?token=${token}`;

    if (integration?.id) {
      await this.prisma.externalIntegration.update({
        where: { id: integration.id },
        data: { lastApplicationLinkRequestAt: new Date() }
      });
    }

    return { signed_url: signedUrl, expiry_time: new Date(Date.now() + expiresInMinutes * 60000) };
  }

  verifyToken(token: string) {
    return this.jwt.verify(token, { secret: process.env.FORM_LINK_SECRET || "change-me" });
  }
}
