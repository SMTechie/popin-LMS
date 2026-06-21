import { Module } from "@nestjs/common";
import { ShopController } from "./shop.controller";
import { StoreCatalogController } from "./store.controller";
import { StoreAdminController } from "./store-admin.controller";
import { ShopService } from "./shop.service";
import { PrismaService } from "../common/prisma.service";
import { ApiRequestLogInterceptor } from "../integrations/api-request-log.interceptor";
import { ExternalIntegrationAuthGuard } from "../integrations/integration-auth.guard";
import { WebhooksModule } from "../webhooks/webhooks.module";
import { TenantsModule } from "../tenants/tenants.module";

@Module({
  imports: [WebhooksModule, TenantsModule],
  controllers: [ShopController, StoreCatalogController, StoreAdminController],
  providers: [ShopService, PrismaService, ApiRequestLogInterceptor, ExternalIntegrationAuthGuard]
})
export class ShopModule {}
