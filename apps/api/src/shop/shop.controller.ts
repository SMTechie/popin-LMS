import { Controller, Get, Headers, Query, Res, UseGuards, UseInterceptors, ForbiddenException, Req } from "@nestjs/common";
import { Response } from "express";
import { ShopService } from "./shop.service";
import { ExternalIntegrationAuthGuard } from "../integrations/integration-auth.guard";
import { ApiRequestLogInterceptor } from "../integrations/api-request-log.interceptor";
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import crypto from "crypto";

@ApiTags("Shop Catalog")
@Controller("api/v1/shop")
@UseGuards(ExternalIntegrationAuthGuard)
@UseInterceptors(ApiRequestLogInterceptor)
export class ShopController {
  constructor(private shop: ShopService) {}

  @Get("catalog")
  @ApiOperation({ summary: "Get shop catalog" })
  @ApiHeader({ name: "Authorization", required: true, description: "Bearer <API_KEY>" })
  @ApiHeader({ name: "X-Popin-Secret", required: true })
  @ApiQuery({ name: "since", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "pageSize", required: false })
  @ApiQuery({ name: "category", required: false })
  @ApiQuery({ name: "visibility", required: false })
  @ApiQuery({ name: "includeVariants", required: false })
  @ApiQuery({ name: "includeImages", required: false })
  @ApiQuery({ name: "status", required: false })
  async getCatalog(
    @Query("since") since: string | undefined,
    @Query("page") page = "1",
    @Query("pageSize") pageSize = "50",
    @Query("category") category: string | undefined,
    @Query("visibility") visibility: string | undefined,
    @Query("includeVariants") includeVariants = "true",
    @Query("includeImages") includeImages = "true",
    @Query("status") status: string | undefined,
    @Headers("if-none-match") ifNoneMatch: string | undefined,
    @Res() res: Response,
    @Req() req: any
  ) {
    if (!req.integration?.shopApiEnabled) throw new ForbiddenException("Shop API disabled");

    const data = await this.shop.getCatalog({
      tenantId: req.tenantId,
      since: since ? new Date(since) : undefined,
      page: Number(page),
      pageSize: Number(pageSize),
      category,
      visibility,
      includeVariants: includeVariants !== "false",
      includeImages: includeImages !== "false",
      status
    });

    if (req.integration?.id) {
      await this.shop.markCatalogSync(req.integration.id);
    }

    const etag = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
    if (ifNoneMatch && ifNoneMatch === etag) {
      return res.status(304).send();
    }

    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "private, max-age=60");
    res.status(200).json(data);
  }
}
