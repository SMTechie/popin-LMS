"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const webhook_service_1 = require("../webhooks/webhook.service");
let ShopService = class ShopService {
    prisma;
    webhooks;
    constructor(prisma, webhooks) {
        this.prisma = prisma;
        this.webhooks = webhooks;
    }
    async logSyncEvent(tenantId, eventType, entityType, entityId, payload, source = "admin_panel") {
        await this.prisma.storeSyncEvent.create({
            data: {
                tenantId,
                eventType,
                entityType,
                entityId,
                payload: payload,
                status: "pending",
                source
            }
        });
    }
    async emitStoreWebhook(tenantId, integrationId, eventType, payload) {
        if (!integrationId)
            return;
        await this.webhooks.emitStoreEvent(tenantId, integrationId, eventType, payload);
    }
    async getCatalog(options) {
        const { tenantId, since, page, pageSize, category, visibility, includeVariants = true, includeImages = true, status } = options;
        const skip = (page - 1) * pageSize;
        const productWhere = { tenantId };
        const categoryWhere = { tenantId };
        if (since) {
            productWhere.updatedAt = { gte: since };
            categoryWhere.updatedAt = { gte: since };
        }
        if (category) {
            categoryWhere.OR = [
                { id: category },
                { slug: category },
                { name: { contains: category, mode: "insensitive" } }
            ];
            productWhere.OR = [
                { categoryId: category },
                { category: { slug: category } },
                { category: { name: { contains: category, mode: "insensitive" } } }
            ];
        }
        if (visibility && visibility !== "internal") {
            productWhere.visibility = { in: [visibility, "universal"] };
        }
        if (status) {
            productWhere.isActive = status === "active";
        }
        const [products, categories] = await Promise.all([
            this.prisma.storeProduct.findMany({
                where: productWhere,
                include: {
                    category: true,
                    variants: includeVariants ? true : false,
                    images: includeImages
                },
                skip,
                take: pageSize,
                orderBy: { updatedAt: "desc" }
            }),
            this.prisma.storeCategory.findMany({ where: categoryWhere, orderBy: { updatedAt: "desc" } })
        ]);
        const variants = includeVariants
            ? products.flatMap((p) => p.variants)
            : [];
        const prices = variants.map((v) => v.priceOverride).filter(Boolean);
        const stock = variants.map((v) => v.stockQuantity).filter(Boolean);
        const images = includeImages ? products.flatMap((p) => p.images) : [];
        const lastUpdatedAt = [
            ...products.map((p) => p.updatedAt),
            ...categories.map((c) => c.updatedAt)
        ].sort((a, b) => b.getTime() - a.getTime())[0];
        return {
            catalog: await this.prisma.storeCatalog.findFirst({
                where: { tenantId, status: status || undefined },
                orderBy: { updatedAt: "desc" }
            }),
            categories,
            products: products.map((product) => ({
                ...product,
                price: product.basePrice ?? 0,
                stockQuantity: product.stockQuantity ?? 0,
                lowStock: (product.stockQuantity ?? 0) <= (product.lowStockThreshold ?? 0),
                primaryImage: product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || null
            })),
            variants,
            prices,
            stock,
            images,
            lastUpdatedAt: lastUpdatedAt ? lastUpdatedAt.toISOString() : new Date().toISOString()
        };
    }
    markCatalogSync(integrationId) {
        return this.prisma.externalIntegration.update({
            where: { id: integrationId },
            data: { lastCatalogSyncAt: new Date() }
        });
    }
    async upsertProduct(tenantId, integrationId, input) {
        const product = await this.prisma.storeProduct.upsert({
            where: { slug: input.slug },
            update: { name: input.name, categoryId: input.categoryId || null },
            create: { name: input.name, slug: input.slug, categoryId: input.categoryId || null, tenantId }
        });
        await this.logSyncEvent(tenantId, "store.product.updated", "StoreProduct", product.id, { name: product.name });
        await this.webhooks.emitShopCatalogUpdated(tenantId, integrationId, { productId: product.id });
        return product;
    }
    async updateStock(tenantId, integrationId, variantId, quantity) {
        const stock = await this.prisma.storeStock.upsert({
            where: { variantId },
            update: { quantity },
            create: { variantId, quantity }
        });
        await this.logSyncEvent(tenantId, "store.stock.updated", "StoreVariant", variantId, { quantity });
        await this.webhooks.emitShopCatalogUpdated(tenantId, integrationId, { variantId, quantity });
        return stock;
    }
    async createCatalog(tenantId, input) {
        const catalog = await this.prisma.storeCatalog.create({
            data: { tenantId, name: input.name, slug: input.slug, status: "draft" }
        });
        await this.logSyncEvent(tenantId, "store.catalog.created", "StoreCatalog", catalog.id, catalog);
        return catalog;
    }
    async publishCatalog(tenantId, catalogId, status) {
        const catalog = await this.prisma.storeCatalog.update({
            where: { id: catalogId },
            data: { status, publishedAt: status === "published" ? new Date() : null }
        });
        await this.logSyncEvent(tenantId, "store.catalog.published", "StoreCatalog", catalog.id, { status });
        return catalog;
    }
    async createCategory(tenantId, input, integrationId) {
        const category = await this.prisma.storeCategory.create({
            data: {
                tenantId,
                catalogId: input.catalogId || null,
                parentCategoryId: input.parentCategoryId || null,
                name: input.name,
                slug: input.slug,
                description: input.description || null,
                sortOrder: input.sortOrder ?? 0,
                isActive: input.isActive ?? true,
                imageUrl: input.imageUrl || null
            }
        });
        await this.logSyncEvent(tenantId, "store.category.created", "StoreCategory", category.id, category);
        await this.emitStoreWebhook(tenantId, integrationId || null, "store.category.created", category);
        return category;
    }
    async updateCategory(tenantId, id, input, integrationId) {
        const category = await this.prisma.storeCategory.update({
            where: { id },
            data: {
                name: input.name,
                slug: input.slug,
                description: input.description || null,
                sortOrder: input.sortOrder ?? 0,
                isActive: input.isActive ?? true,
                imageUrl: input.imageUrl || null,
                parentCategoryId: input.parentCategoryId || null
            }
        });
        await this.logSyncEvent(tenantId, "store.category.updated", "StoreCategory", category.id, category);
        await this.emitStoreWebhook(tenantId, integrationId || null, "store.category.updated", category);
        return category;
    }
    async createProduct(tenantId, input, integrationId) {
        const product = await this.prisma.storeProduct.create({
            data: {
                tenantId,
                catalogId: input.catalogId || null,
                categoryId: input.categoryId || null,
                productType: input.productType || null,
                sku: input.sku || null,
                name: input.name,
                slug: input.slug,
                shortDescription: input.shortDescription || null,
                longDescription: input.longDescription || null,
                basePrice: input.basePrice ?? 0,
                costPrice: input.costPrice ?? 0,
                vatRate: input.vatRate ?? 15,
                vatInclusive: input.vatInclusive ?? true,
                barcode: input.barcode || null,
                currencyCode: input.currencyCode || "ZAR",
                stockQuantity: input.stockQuantity ?? 0,
                lowStockThreshold: input.lowStockThreshold ?? 0,
                trackInventory: input.trackInventory ?? true,
                isActive: input.isActive ?? true,
                isFeatured: input.isFeatured ?? false,
                allowOnlinePurchase: input.allowOnlinePurchase ?? true,
                sizeOptions: input.sizeOptions || [],
                colorOptions: input.colorOptions || [],
                genderGroup: input.genderGroup || null,
                gradeGroup: input.gradeGroup || null,
                supplierId: input.supplierId || null,
                reorderQuantity: input.reorderQuantity ?? 0,
                collectionLocation: input.collectionLocation || null,
                returnPolicy: input.returnPolicy || null,
                visibility: input.visibility || "universal",
                variants: input.variants?.length
                    ? {
                        create: input.variants.map((variant) => ({
                            tenantId,
                            name: variant.name,
                            sku: variant.sku || null,
                            size: variant.size || null,
                            color: variant.color || null,
                            priceOverride: variant.priceOverride ?? null,
                            stockQuantity: variant.stockQuantity ?? null,
                            isActive: variant.isActive ?? true
                        }))
                    }
                    : undefined,
                images: input.images?.length
                    ? {
                        create: input.images.map((image) => ({
                            tenantId,
                            url: image.url,
                            altText: image.altText || null,
                            sortOrder: image.sortOrder ?? 0,
                            isPrimary: image.isPrimary ?? false
                        }))
                    }
                    : undefined
            },
            include: { variants: true, images: true }
        });
        await this.logSyncEvent(tenantId, "store.product.created", "StoreProduct", product.id, product);
        await this.emitStoreWebhook(tenantId, integrationId || null, "store.product.created", product);
        return product;
    }
    async updateProduct(tenantId, id, input, integrationId) {
        const existing = await this.prisma.storeProduct.findFirst({ where: { id, tenantId } });
        if (!existing)
            throw new common_1.NotFoundException("Product not found");
        const product = await this.prisma.storeProduct.update({
            where: { id },
            data: {
                name: input.name,
                slug: input.slug,
                categoryId: input.categoryId || null,
                productType: input.productType || null,
                sku: input.sku || null,
                shortDescription: input.shortDescription || null,
                longDescription: input.longDescription || null,
                basePrice: input.basePrice ?? 0,
                costPrice: input.costPrice ?? 0,
                vatRate: input.vatRate ?? 15,
                vatInclusive: input.vatInclusive ?? true,
                barcode: input.barcode || null,
                currencyCode: input.currencyCode || "ZAR",
                stockQuantity: input.stockQuantity ?? 0,
                lowStockThreshold: input.lowStockThreshold ?? 0,
                trackInventory: input.trackInventory ?? true,
                isActive: input.isActive ?? true,
                isFeatured: input.isFeatured ?? false,
                allowOnlinePurchase: input.allowOnlinePurchase ?? true,
                sizeOptions: input.sizeOptions || [],
                colorOptions: input.colorOptions || [],
                genderGroup: input.genderGroup || null,
                gradeGroup: input.gradeGroup || null,
                supplierId: input.supplierId || null,
                reorderQuantity: input.reorderQuantity ?? 0,
                collectionLocation: input.collectionLocation || null,
                returnPolicy: input.returnPolicy || null,
                visibility: input.visibility || "universal",
                variants: input.variants
                    ? {
                        deleteMany: {},
                        create: input.variants.map((variant) => ({
                            tenantId,
                            name: variant.name,
                            sku: variant.sku || null,
                            size: variant.size || null,
                            color: variant.color || null,
                            priceOverride: variant.priceOverride ?? null,
                            stockQuantity: variant.stockQuantity ?? null,
                            isActive: variant.isActive ?? true
                        }))
                    }
                    : undefined,
                images: input.images
                    ? {
                        deleteMany: {},
                        create: input.images.map((image) => ({
                            tenantId,
                            url: image.url,
                            altText: image.altText || null,
                            sortOrder: image.sortOrder ?? 0,
                            isPrimary: image.isPrimary ?? false
                        }))
                    }
                    : undefined
            },
            include: { variants: true, images: true }
        });
        if (existing.basePrice !== product.basePrice || existing.stockQuantity !== product.stockQuantity) {
            await this.prisma.storeStockMovement.create({
                data: {
                    tenantId,
                    productId: product.id,
                    type: existing.basePrice !== product.basePrice ? "PRICE_ADJUSTMENT" : "STOCK_CORRECTION",
                    quantityChange: (product.stockQuantity ?? 0) - (existing.stockQuantity ?? 0),
                    previousQuantity: existing.stockQuantity ?? 0,
                    newQuantity: product.stockQuantity ?? 0,
                    previousPrice: existing.basePrice,
                    newPrice: product.basePrice,
                    reason: "Product updated"
                }
            });
        }
        await this.logSyncEvent(tenantId, "store.product.updated", "StoreProduct", product.id, product);
        await this.emitStoreWebhook(tenantId, integrationId || null, "store.product.updated", product);
        return product;
    }
    async duplicateProduct(tenantId, id, actorId) {
        const source = await this.prisma.storeProduct.findFirst({
            where: { id, tenantId },
            include: { variants: true, images: true }
        });
        if (!source)
            throw new common_1.NotFoundException("Product not found");
        const suffix = Date.now().toString().slice(-6);
        return this.createProduct(tenantId, {
            ...source,
            name: `${source.name} (Copy)`,
            slug: `${source.slug}-copy-${suffix}`,
            sku: source.sku ? `${source.sku}-COPY-${suffix}` : null,
            isActive: false,
            variants: source.variants.map((variant) => ({
                ...variant,
                sku: variant.sku ? `${variant.sku}-COPY-${suffix}` : null
            })),
            images: source.images
        }, actorId);
    }
    async updateProductStatus(tenantId, id, isActive, actorId) {
        const existing = await this.prisma.storeProduct.findFirst({ where: { id, tenantId } });
        if (!existing)
            throw new common_1.NotFoundException("Product not found");
        const product = await this.prisma.storeProduct.update({ where: { id }, data: { isActive } });
        await this.logSyncEvent(tenantId, isActive ? "store.product.enabled" : "store.product.disabled", "StoreProduct", id, { actorId, isActive });
        return product;
    }
    async adjustProductStock(tenantId, id, input, actorId) {
        const product = await this.prisma.storeProduct.findFirst({ where: { id, tenantId } });
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        const current = product.stockQuantity ?? 0;
        const magnitude = Math.abs(Number(input.quantity || 0));
        if (magnitude === 0)
            throw new common_1.BadRequestException("Quantity must be greater than zero");
        const subtracts = ["REMOVE", "RESERVE", "DAMAGED"].includes(input.type);
        const delta = input.type === "TRANSFER" ? 0 : subtracts ? -magnitude : magnitude;
        const next = current + delta;
        if (next < 0)
            throw new common_1.BadRequestException("Insufficient stock");
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.storeProduct.update({ where: { id }, data: { stockQuantity: next } });
            const movement = await tx.storeStockMovement.create({
                data: {
                    tenantId,
                    productId: id,
                    type: input.type,
                    quantityChange: delta,
                    previousQuantity: current,
                    newQuantity: next,
                    previousPrice: product.basePrice,
                    newPrice: product.basePrice,
                    reason: input.reason || null,
                    reference: input.reference || null,
                    actorId: actorId || null
                }
            });
            return { product: updated, movement };
        });
    }
    async productHistory(tenantId, id) {
        const product = await this.prisma.storeProduct.findFirst({ where: { id, tenantId } });
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        const [stock, sales] = await Promise.all([
            this.prisma.storeStockMovement.findMany({ where: { productId: id, tenantId }, orderBy: { createdAt: "desc" }, take: 100 }),
            this.prisma.storeOrderItem.findMany({ where: { productId: id }, include: { order: true }, orderBy: { order: { createdAt: "desc" } }, take: 100 })
        ]);
        return { stock, sales };
    }
    async deleteProduct(tenantId, id) {
        const product = await this.prisma.storeProduct.findFirst({ where: { id, tenantId }, include: { _count: { select: { orderItems: true } } } });
        if (!product)
            throw new common_1.NotFoundException("Product not found");
        if (product._count.orderItems > 0) {
            throw new common_1.BadRequestException("Products with sales history cannot be deleted. Disable the product instead.");
        }
        await this.prisma.storeProduct.delete({ where: { id } });
        return { deleted: true };
    }
    async createOrder(tenantId, parentId, input) {
        if (!input.items?.length)
            throw new common_1.BadRequestException("Your cart is empty");
        const ids = input.items.map((item) => item.productId);
        const products = await this.prisma.storeProduct.findMany({ where: { tenantId, id: { in: ids }, isActive: true, allowOnlinePurchase: true } });
        if (products.length !== new Set(ids).size)
            throw new common_1.BadRequestException("One or more products are unavailable");
        return this.prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const lines = input.items.map((line) => {
                const product = products.find((item) => item.id === line.productId);
                const quantity = Number(line.quantity);
                if ((product.stockQuantity ?? 0) < quantity)
                    throw new common_1.BadRequestException(`${product.name} does not have enough stock`);
                totalAmount += (product.basePrice ?? 0) * quantity;
                return { product, quantity };
            });
            const order = await tx.storeOrder.create({
                data: {
                    parentId,
                    totalAmount,
                    paymentMethod: input.paymentMethod,
                    items: { create: lines.map(({ product, quantity }) => ({ productId: product.id, name: product.name, quantity, price: product.basePrice ?? 0 })) }
                },
                include: { items: true }
            });
            for (const { product, quantity } of lines) {
                const next = (product.stockQuantity ?? 0) - quantity;
                await tx.storeProduct.update({ where: { id: product.id }, data: { stockQuantity: next } });
                await tx.storeStockMovement.create({
                    data: { tenantId, productId: product.id, type: "SALE", quantityChange: -quantity, previousQuantity: product.stockQuantity ?? 0, newQuantity: next, previousPrice: product.basePrice, newPrice: product.basePrice, reference: order.id, actorId: parentId }
                });
            }
            return order;
        });
    }
    myOrders(parentId) {
        return this.prisma.storeOrder.findMany({ where: { parentId }, include: { items: true }, orderBy: { createdAt: "desc" } });
    }
};
exports.ShopService = ShopService;
exports.ShopService = ShopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, webhook_service_1.WebhookService])
], ShopService);
//# sourceMappingURL=shop.service.js.map