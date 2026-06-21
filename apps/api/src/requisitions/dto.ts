import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { RequisitionItemType, TicketStatus } from "@prisma/client";

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}

export class CreateRequisitionItemDto {
  @IsString()
  @IsNotEmpty()
  itemName!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsNumber()
  estimatedUnitCost?: number;

  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @IsEnum(RequisitionItemType)
  itemType!: RequisitionItemType;

  @IsOptional()
  @IsString()
  inventoryItemId?: string;
}

export class CreateRequisitionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  budgetCode?: string;

  @IsOptional()
  @IsDateString()
  requiredDate?: string;

  @IsOptional()
  @IsString()
  deliveryLocation?: string;

  @IsOptional()
  @IsString()
  vendorPreference?: string;

  @IsOptional()
  @IsString()
  procurementStatus?: string;

  @IsOptional()
  @IsInt()
  approvalLevel?: number;

  @IsOptional()
  @IsNumber()
  estimatedTotalCost?: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequisitionItemDto)
  items!: CreateRequisitionItemDto[];
}

export class ApproveRequisitionDto {
  @IsString()
  @IsNotEmpty()
  approvalRole!: string;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class RejectRequisitionDto {
  @IsString()
  @IsNotEmpty()
  approvalRole!: string;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class CreatePurchaseOrderDto {
  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;
}

export class DeliverRequisitionItemDto {
  @IsString()
  @IsNotEmpty()
  requisitionItemId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @IsString()
  inventoryItemId?: string;
}

export class DeliverRequisitionDto {
  @IsString()
  @IsNotEmpty()
  locationId!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliverRequisitionItemDto)
  items?: DeliverRequisitionItemDto[];
}
