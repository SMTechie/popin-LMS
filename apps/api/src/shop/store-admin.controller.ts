import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import { TenantsService } from "../tenants/tenants.service";
import { ShopService } from "./shop.service";
import {
  AdjustProductStockDto,
  CreateCatalogDto,
  CreateCategoryDto,
  CreateStoreOrderDto,
  CreateProductDto,
  UpdateCatalogStatusDto,
  UpdateCategoryDto,
  UpdateProductDto,
  UpdateProductStatusDto
} from "./dto";

@Controller("store")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StoreAdminController {
  constructor(private shop: ShopService, private tenants: TenantsService) {}

  @Get("catalog")
  @Permissions({ module: "uniform_store", action: "store.view" })
  async getCatalog(@Query() query: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.getCatalog({
      tenantId: tenant.id,
      since: query.since ? new Date(query.since) : undefined,
      page: Number(query.page || 1),
      pageSize: Number(query.pageSize || 50),
      category: query.category,
      visibility: query.visibility,
      includeVariants: query.includeVariants !== "false",
      includeImages: query.includeImages !== "false",
      status: query.status
    });
  }

  @Post("catalogs")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async createCatalog(@Body() dto: CreateCatalogDto) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.createCatalog(tenant.id, dto);
  }

  @Patch("catalogs/:id")
  @Permissions({ module: "uniform_store", action: "store.publish" })
  async updateCatalogStatus(@Param("id") id: string, @Body() dto: UpdateCatalogStatusDto) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.publishCatalog(tenant.id, id, dto.status);
  }

  @Post("categories")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async createCategory(@Body() dto: CreateCategoryDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.createCategory(tenant.id, dto, req.user?.integrationId);
  }

  @Patch("categories/:id")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async updateCategory(@Param("id") id: string, @Body() dto: UpdateCategoryDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.updateCategory(tenant.id, id, dto, req.user?.integrationId);
  }

  @Post("products")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.createProduct(tenant.id, dto, req.user?.integrationId);
  }

  @Patch("products/:id")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async updateProduct(@Param("id") id: string, @Body() dto: UpdateProductDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.updateProduct(tenant.id, id, dto, req.user?.integrationId);
  }

  @Post("products/:id/duplicate")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async duplicateProduct(@Param("id") id: string, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.duplicateProduct(tenant.id, id, req.user?.id);
  }

  @Patch("products/:id/status")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async updateProductStatus(@Param("id") id: string, @Body() dto: UpdateProductStatusDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.updateProductStatus(tenant.id, id, dto.isActive, req.user?.id);
  }

  @Post("products/:id/stock")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async adjustProductStock(@Param("id") id: string, @Body() dto: AdjustProductStockDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.adjustProductStock(tenant.id, id, dto, req.user?.id);
  }

  @Get("products/:id/history")
  @Permissions({ module: "uniform_store", action: "store.view" })
  async productHistory(@Param("id") id: string) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.productHistory(tenant.id, id);
  }

  @Delete("products/:id")
  @Permissions({ module: "uniform_store", action: "store.manage" })
  async deleteProduct(@Param("id") id: string) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.deleteProduct(tenant.id, id);
  }


  @Post("orders")
  @Permissions({ module: "uniform_store", action: "store.view" })
  async createOrder(@Body() dto: CreateStoreOrderDto, @Req() req: any) {
    const tenant = await this.tenants.getDefaultTenant();
    return this.shop.createOrder(tenant.id, req.user.id, dto);
  }

  @Get("orders/mine")
  @Permissions({ module: "uniform_store", action: "store.view" })
  myOrders(@Req() req: any) {
    return this.shop.myOrders(req.user.id);
  }
}
