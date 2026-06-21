import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../common/guards/permission.guard";
import { Permissions } from "../common/decorators/permissions.decorator";
import {
  ApproveRequestDto,
  CreateAdjustmentDto,
  CreateCountSessionDto,
  CreateInventoryCategoryDto,
  CreateInventoryItemDto,
  CreateInventoryLocationDto,
  CreateInventoryUnitDto,
  CreateRequestDto,
  CreateTransferDto,
  FulfillRequestDto,
  IssueStockDto,
  LocationAccessDto,
  PaginationQueryDto,
  ReceiveStockDto,
  SubmitCountDto,
  UpdateAdjustmentStatusDto,
  UpdateCountStatusDto,
  UpdateInventoryItemDto,
  UpdateInventoryLocationDto,
  UpdateTransferStatusDto
} from "./dto";

@Controller("inventory")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get("overview")
  @Permissions({ module: "inventory", action: "view" })
  overview() {
    return this.inventory.overview();
  }

  @Get("items")
  @Permissions({ module: "inventory", action: "view" })
  listItems(@Query() query: PaginationQueryDto & { categoryId?: string; type?: string; active?: string }) {
    return this.inventory.listItems(query);
  }

  @Get("items/:id")
  @Permissions({ module: "inventory", action: "view" })
  getItem(@Param("id") id: string) {
    return this.inventory.getItem(id);
  }

  @Post("items")
  @Permissions({ module: "inventory", action: "inventory.item.create" })
  createItem(@Body() dto: CreateInventoryItemDto, @Req() req: any) {
    return this.inventory.createItem(dto, req.user.id);
  }

  @Patch("items/:id")
  @Permissions({ module: "inventory", action: "inventory.item.update" })
  updateItem(@Param("id") id: string, @Body() dto: UpdateInventoryItemDto, @Req() req: any) {
    return this.inventory.updateItem(id, dto, req.user.id);
  }

  @Delete("items/:id")
  @Permissions({ module: "inventory", action: "inventory.item.archive" })
  archiveItem(@Param("id") id: string, @Req() req: any) {
    return this.inventory.archiveItem(id, req.user.id);
  }

  @Get("categories")
  @Permissions({ module: "inventory", action: "view" })
  listCategories() {
    return this.inventory.listCategories();
  }

  @Post("categories")
  @Permissions({ module: "inventory", action: "inventory.settings.manage" })
  createCategory(@Body() dto: CreateInventoryCategoryDto) {
    return this.inventory.createCategory(dto);
  }

  @Get("units")
  @Permissions({ module: "inventory", action: "view" })
  listUnits() {
    return this.inventory.listUnits();
  }

  @Post("units")
  @Permissions({ module: "inventory", action: "inventory.settings.manage" })
  createUnit(@Body() dto: CreateInventoryUnitDto) {
    return this.inventory.createUnit(dto);
  }

  @Get("locations")
  @Permissions({ module: "inventory", action: "view" })
  listLocations() {
    return this.inventory.listLocations();
  }

  @Post("locations")
  @Permissions({ module: "inventory", action: "inventory.location.manage" })
  createLocation(@Body() dto: CreateInventoryLocationDto) {
    return this.inventory.createLocation(dto);
  }

  @Patch("locations/:id")
  @Permissions({ module: "inventory", action: "inventory.location.manage" })
  updateLocation(@Param("id") id: string, @Body() dto: UpdateInventoryLocationDto) {
    return this.inventory.updateLocation(id, dto);
  }

  @Post("location-access")
  @Permissions({ module: "inventory", action: "inventory.location.manage" })
  setLocationAccess(@Body() dto: LocationAccessDto) {
    return this.inventory.setLocationAccess(dto);
  }

  @Get("balances")
  @Permissions({ module: "inventory", action: "view" })
  listBalances(@Query("locationId") locationId?: string) {
    return this.inventory.listBalances(locationId);
  }

  @Get("movements")
  @Permissions({ module: "inventory", action: "view" })
  listMovements(@Query() query: PaginationQueryDto & { locationId?: string; itemId?: string; type?: string }) {
    return this.inventory.listMovements(query);
  }

  @Post("stock/receive")
  @Permissions({ module: "inventory", action: "inventory.stock.receive" })
  receiveStock(@Body() dto: ReceiveStockDto, @Req() req: any) {
    return this.inventory.receiveStock(dto, req.user.id);
  }

  @Post("stock/issue")
  @Permissions({ module: "inventory", action: "inventory.stock.issue" })
  issueStock(@Body() dto: IssueStockDto, @Req() req: any) {
    return this.inventory.issueStock(dto, req.user.id);
  }

  @Post("transfers")
  @Permissions({ module: "inventory", action: "inventory.stock.transfer" })
  createTransfer(@Body() dto: CreateTransferDto, @Req() req: any) {
    return this.inventory.createTransfer(dto, req.user.id);
  }

  @Patch("transfers/:id/status")
  @Permissions({ module: "inventory", action: "inventory.stock.transfer" })
  updateTransferStatus(@Param("id") id: string, @Body() dto: UpdateTransferStatusDto, @Req() req: any) {
    return this.inventory.updateTransferStatus(id, dto, req.user.id);
  }

  @Get("requests")
  @Permissions({ module: "inventory", action: "view" })
  listRequests(@Query() query: PaginationQueryDto & { status?: string }) {
    return this.inventory.listRequests(query);
  }

  @Get("transfers")
  @Permissions({ module: "inventory", action: "view" })
  listTransfers(@Query() query: PaginationQueryDto & { status?: string }) {
    return this.inventory.listTransfers(query);
  }

  @Get("adjustments")
  @Permissions({ module: "inventory", action: "view" })
  listAdjustments(@Query() query: PaginationQueryDto & { status?: string }) {
    return this.inventory.listAdjustments(query);
  }

  @Get("counts")
  @Permissions({ module: "inventory", action: "view" })
  listCounts(@Query() query: PaginationQueryDto & { status?: string }) {
    return this.inventory.listCounts(query);
  }

  @Post("requests")
  @Permissions({ module: "inventory", action: "inventory.request.create" })
  createRequest(@Body() dto: CreateRequestDto, @Req() req: any) {
    return this.inventory.createRequest(dto, req.user.id);
  }

  @Patch("requests/:id/approve")
  @Permissions({ module: "inventory", action: "inventory.request.approve" })
  approveRequest(@Param("id") id: string, @Body() dto: ApproveRequestDto, @Req() req: any) {
    return this.inventory.approveRequest(id, dto, req.user.id);
  }

  @Post("requests/:id/fulfill")
  @Permissions({ module: "inventory", action: "inventory.request.fulfill" })
  fulfillRequest(@Param("id") id: string, @Body() dto: FulfillRequestDto, @Req() req: any) {
    return this.inventory.fulfillRequest(id, dto, req.user.id);
  }

  @Post("adjustments")
  @Permissions({ module: "inventory", action: "inventory.stock.adjust" })
  createAdjustment(@Body() dto: CreateAdjustmentDto, @Req() req: any) {
    return this.inventory.createAdjustment(dto, req.user.id);
  }

  @Patch("adjustments/:id/status")
  @Permissions({ module: "inventory", action: "inventory.stock.adjust" })
  updateAdjustmentStatus(@Param("id") id: string, @Body() dto: UpdateAdjustmentStatusDto, @Req() req: any) {
    return this.inventory.updateAdjustmentStatus(id, dto, req.user.id);
  }

  @Post("counts")
  @Permissions({ module: "inventory", action: "inventory.count.manage" })
  createCountSession(@Body() dto: CreateCountSessionDto, @Req() req: any) {
    return this.inventory.createCountSession(dto, req.user.id);
  }

  @Post("counts/:id/submit")
  @Permissions({ module: "inventory", action: "inventory.count.manage" })
  submitCount(@Param("id") id: string, @Body() dto: SubmitCountDto, @Req() req: any) {
    return this.inventory.submitCount(id, dto, req.user.id);
  }

  @Patch("counts/:id/status")
  @Permissions({ module: "inventory", action: "inventory.count.manage" })
  updateCountStatus(@Param("id") id: string, @Body() dto: UpdateCountStatusDto, @Req() req: any) {
    return this.inventory.updateCountStatus(id, dto, req.user.id);
  }

  @Get("alerts")
  @Permissions({ module: "inventory", action: "view" })
  listAlerts() {
    return this.inventory.listAlerts();
  }

  @Get("reports/low-stock")
  @Permissions({ module: "inventory", action: "inventory.reports.view" })
  lowStockReport() {
    return this.inventory.reportLowStock();
  }

  @Get("reports/valuation")
  @Permissions({ module: "inventory", action: "inventory.valuation.view" })
  valuationReport() {
    return this.inventory.reportValuation();
  }
}

