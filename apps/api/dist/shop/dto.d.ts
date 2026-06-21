export declare class CreateCatalogDto {
    name: string;
    slug: string;
}
export declare class UpdateCatalogStatusDto {
    status: string;
}
export declare class CreateCategoryDto {
    name: string;
    slug: string;
    catalogId?: string;
    parentCategoryId?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
    imageUrl?: string;
}
export declare class UpdateCategoryDto extends CreateCategoryDto {
}
export declare class CreateProductImageDto {
    url: string;
    altText?: string;
    sortOrder?: number;
    isPrimary?: boolean;
}
export declare class CreateProductVariantDto {
    name: string;
    sku?: string;
    size?: string;
    color?: string;
    priceOverride?: number;
    stockQuantity?: number;
    isActive?: boolean;
}
export declare class CreateProductDto {
    name: string;
    slug: string;
    sku?: string;
    catalogId?: string;
    categoryId?: string;
    productType?: string;
    shortDescription?: string;
    longDescription?: string;
    basePrice?: number;
    costPrice?: number;
    vatRate?: number;
    vatInclusive?: boolean;
    barcode?: string;
    currencyCode?: string;
    stockQuantity?: number;
    lowStockThreshold?: number;
    trackInventory?: boolean;
    isActive?: boolean;
    isFeatured?: boolean;
    allowOnlinePurchase?: boolean;
    sizeOptions?: string[];
    colorOptions?: string[];
    genderGroup?: string;
    gradeGroup?: string;
    supplierId?: string;
    reorderQuantity?: number;
    collectionLocation?: string;
    returnPolicy?: string;
    visibility?: string;
    variants?: CreateProductVariantDto[];
    images?: CreateProductImageDto[];
}
export declare class UpdateProductDto extends CreateProductDto {
}
export declare class AdjustProductStockDto {
    quantity: number;
    type: "ADD" | "REMOVE" | "TRANSFER" | "RESERVE" | "DAMAGED" | "RESTOCK";
    reason?: string;
    reference?: string;
}
export declare class UpdateProductStatusDto {
    isActive: boolean;
}
export declare class StoreOrderLineDto {
    productId: string;
    quantity: number;
}
export declare class CreateStoreOrderDto {
    paymentMethod: string;
    items: StoreOrderLineDto[];
}
