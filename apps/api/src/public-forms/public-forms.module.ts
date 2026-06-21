import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PublicFormsController } from "./public-forms.controller";
import { PublicFormsService } from "./public-forms.service";
import { TenantsModule } from "../tenants/tenants.module";
import { PrismaService } from "../common/prisma.service";
import { ApiRequestLogInterceptor } from "../integrations/api-request-log.interceptor";
import { ExternalIntegrationAuthGuard } from "../integrations/integration-auth.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.FORM_LINK_SECRET || "change-me",
      signOptions: { expiresIn: "1d" }
    }),
    TenantsModule
  ],
  controllers: [PublicFormsController],
  providers: [PublicFormsService, PrismaService, ApiRequestLogInterceptor, ExternalIntegrationAuthGuard],
  exports: [PublicFormsService]
})
export class PublicFormsModule {}
