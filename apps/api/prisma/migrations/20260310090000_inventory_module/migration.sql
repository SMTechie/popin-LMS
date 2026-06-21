-- Inventory module schema
CREATE TYPE "InventoryItemType" AS ENUM ('CONSUMABLE', 'ASSET', 'UNIFORM', 'RESELL', 'SERVICE_LINKED');
CREATE TYPE "InventoryTrackingType" AS ENUM ('NONE', 'BATCH', 'SERIAL');
CREATE TYPE "InventoryMovementType" AS ENUM ('RECEIVE', 'ISSUE', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT', 'RETURN', 'COUNT', 'RESERVATION', 'RELEASE');
CREATE TYPE "InventoryRequestStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'PARTIALLY_FULFILLED', 'FULFILLED', 'CANCELLED');
CREATE TYPE "InventoryTransferStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED');
CREATE TYPE "InventoryAdjustmentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'APPLIED');
CREATE TYPE "InventoryCountStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'CLOSED');
CREATE TYPE "InventoryAlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');
CREATE TYPE "InventoryAlertType" AS ENUM ('LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRY', 'VARIANCE', 'ABNORMAL_ADJUSTMENT', 'PENDING_APPROVAL');
CREATE TYPE "InventoryIssueType" AS ENUM ('DEPARTMENT', 'STAFF', 'STUDENT', 'HOSTEL', 'MAINTENANCE', 'EVENT');

CREATE TABLE "InventoryCategory" (
  "id" TEXT PRIMARY KEY,
  "name" text NOT NULL,
  "code" text UNIQUE,
  "description" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("name")
);

CREATE TABLE "InventoryUnit" (
  "id" TEXT PRIMARY KEY,
  "name" text NOT NULL,
  "abbreviation" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("name")
);

CREATE TABLE "InventoryLocation" (
  "id" TEXT PRIMARY KEY,
  "name" text NOT NULL,
  "code" text UNIQUE,
  "description" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "managerId" TEXT,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryLocation_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryLocationAccess" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "locationId" TEXT NOT NULL,
  "canIssue" boolean NOT NULL DEFAULT false,
  "canApprove" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryLocationAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryLocationAccess_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  UNIQUE ("userId", "locationId")
);

CREATE TABLE "InventoryBin" (
  "id" TEXT PRIMARY KEY,
  "locationId" TEXT NOT NULL,
  "code" text NOT NULL,
  "description" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryBin_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  UNIQUE ("locationId", "code")
);

CREATE TABLE "InventoryItem" (
  "id" TEXT PRIMARY KEY,
  "name" text NOT NULL,
  "sku" text NOT NULL UNIQUE,
  "description" text,
  "categoryId" TEXT,
  "unitId" TEXT,
  "type" "InventoryItemType" NOT NULL DEFAULT 'CONSUMABLE',
  "tracking" "InventoryTrackingType" NOT NULL DEFAULT 'NONE',
  "barcode" text,
  "imageUrl" text,
  "reorderPoint" integer NOT NULL DEFAULT 0,
  "minStock" integer NOT NULL DEFAULT 0,
  "maxStock" integer,
  "isActive" boolean NOT NULL DEFAULT true,
  "isTrackable" boolean NOT NULL DEFAULT true,
  "taxRate" double precision,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InventoryCategory"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "InventoryUnit"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryItemVariant" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "name" text NOT NULL,
  "sku" text NOT NULL UNIQUE,
  "barcode" text,
  "attributes" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE
);

CREATE TABLE "InventoryItemSupplier" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "supplierId" TEXT NOT NULL,
  "supplierSku" text,
  "price" double precision,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryItemSupplier_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryItemSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE,
  UNIQUE ("itemId", "supplierId")
);

CREATE TABLE "InventoryReorderRule" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "locationId" TEXT,
  "minStock" integer NOT NULL,
  "reorderPoint" integer NOT NULL,
  "maxStock" integer,
  "leadTimeDays" integer,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryReorderRule_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryReorderRule_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryReorderRule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryStockBalance" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "locationId" TEXT NOT NULL,
  "binId" TEXT,
  "quantityOnHand" integer NOT NULL DEFAULT 0,
  "quantityReserved" integer NOT NULL DEFAULT 0,
  "averageCost" double precision DEFAULT 0,
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryStockBalance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryStockBalance_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockBalance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryStockBalance_binId_fkey" FOREIGN KEY ("binId") REFERENCES "InventoryBin"("id") ON DELETE SET NULL,
  UNIQUE ("itemId", "variantId", "locationId", "binId")
);

CREATE TABLE "InventoryBatch" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "locationId" TEXT NOT NULL,
  "batchNumber" text NOT NULL,
  "expiryDate" timestamptz,
  "receivedAt" timestamptz NOT NULL DEFAULT now(),
  "quantityRemaining" integer NOT NULL,
  CONSTRAINT "InventoryBatch_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryBatch_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryBatch_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE
);

CREATE TABLE "InventorySerial" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "serialNumber" text NOT NULL UNIQUE,
  "locationId" TEXT,
  "status" text NOT NULL DEFAULT 'AVAILABLE',
  "assignedToId" TEXT,
  "assignedToType" text,
  "assignedAt" timestamptz,
  CONSTRAINT "InventorySerial_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventorySerial_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL,
  CONSTRAINT "InventorySerial_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryStockMovement" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "locationFromId" TEXT,
  "locationToId" TEXT,
  "binId" TEXT,
  "batchId" TEXT,
  "serialId" TEXT,
  "quantity" integer NOT NULL,
  "unitCost" double precision,
  "type" "InventoryMovementType" NOT NULL,
  "reference" text,
  "reason" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "createdById" TEXT,
  CONSTRAINT "InventoryStockMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryStockMovement_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockMovement_locationFromId_fkey" FOREIGN KEY ("locationFromId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockMovement_locationToId_fkey" FOREIGN KEY ("locationToId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockMovement_binId_fkey" FOREIGN KEY ("binId") REFERENCES "InventoryBin"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockMovement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockMovement_serialId_fkey" FOREIGN KEY ("serialId") REFERENCES "InventorySerial"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryStockMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryRequest" (
  "id" TEXT PRIMARY KEY,
  "reference" text NOT NULL UNIQUE,
  "status" "InventoryRequestStatus" NOT NULL DEFAULT 'DRAFT',
  "locationId" TEXT,
  "requestedById" TEXT NOT NULL,
  "department" text,
  "costCenter" text,
  "neededBy" timestamptz,
  "reason" text,
  "linkedTicketId" text,
  "linkedBoardCardId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryRequest_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "InventoryRequestLine" (
  "id" TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "quantityRequested" integer NOT NULL,
  "quantityApproved" integer DEFAULT 0,
  "quantityFulfilled" integer DEFAULT 0,
  "notes" text,
  CONSTRAINT "InventoryRequestLine_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InventoryRequest"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryRequestLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryRequestLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryRequestApproval" (
  "id" TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  "status" text NOT NULL,
  "approvedById" TEXT NOT NULL,
  "approvedAt" timestamptz NOT NULL DEFAULT now(),
  "note" text,
  CONSTRAINT "InventoryRequestApproval_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InventoryRequest"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryRequestApproval_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "InventoryIssueNote" (
  "id" TEXT PRIMARY KEY,
  "requestId" TEXT NOT NULL,
  "issuedById" TEXT NOT NULL,
  "issueType" "InventoryIssueType" NOT NULL,
  "issuedTo" text,
  "note" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryIssueNote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InventoryRequest"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryIssueNote_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE "InventoryTransfer" (
  "id" TEXT PRIMARY KEY,
  "reference" text NOT NULL UNIQUE,
  "status" "InventoryTransferStatus" NOT NULL DEFAULT 'DRAFT',
  "fromLocationId" TEXT NOT NULL,
  "toLocationId" TEXT NOT NULL,
  "requestedById" TEXT NOT NULL,
  "approvedById" TEXT,
  "approvedAt" timestamptz,
  "shippedAt" timestamptz,
  "receivedAt" timestamptz,
  "note" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryTransfer_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryTransfer_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryTransfer_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryTransfer_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryTransferLine" (
  "id" TEXT PRIMARY KEY,
  "transferId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "quantity" integer NOT NULL,
  CONSTRAINT "InventoryTransferLine_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "InventoryTransfer"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryTransferLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryTransferLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryAdjustment" (
  "id" TEXT PRIMARY KEY,
  "reference" text NOT NULL UNIQUE,
  "status" "InventoryAdjustmentStatus" NOT NULL DEFAULT 'DRAFT',
  "locationId" TEXT NOT NULL,
  "reason" text NOT NULL,
  "createdById" TEXT NOT NULL,
  "approvedById" TEXT,
  "approvedAt" timestamptz,
  "note" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryAdjustment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryAdjustment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryAdjustment_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryAdjustmentLine" (
  "id" TEXT PRIMARY KEY,
  "adjustmentId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "quantityDelta" integer NOT NULL,
  "unitCost" double precision,
  "note" text,
  CONSTRAINT "InventoryAdjustmentLine_adjustmentId_fkey" FOREIGN KEY ("adjustmentId") REFERENCES "InventoryAdjustment"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryAdjustmentLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryAdjustmentLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryCountSession" (
  "id" TEXT PRIMARY KEY,
  "reference" text NOT NULL UNIQUE,
  "status" "InventoryCountStatus" NOT NULL DEFAULT 'DRAFT',
  "locationId" TEXT NOT NULL,
  "type" text NOT NULL,
  "blindCount" boolean NOT NULL DEFAULT false,
  "startedAt" timestamptz,
  "closedAt" timestamptz,
  "createdById" TEXT NOT NULL,
  "approvedById" TEXT,
  "approvedAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryCountSession_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryCountSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryCountSession_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryCountLine" (
  "id" TEXT PRIMARY KEY,
  "sessionId" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "variantId" TEXT,
  "systemQty" integer NOT NULL,
  "countedQty" integer NOT NULL,
  "variance" integer NOT NULL,
  "note" text,
  CONSTRAINT "InventoryCountLine_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InventoryCountSession"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryCountLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryCountLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryAlert" (
  "id" TEXT PRIMARY KEY,
  "type" "InventoryAlertType" NOT NULL,
  "status" "InventoryAlertStatus" NOT NULL DEFAULT 'OPEN',
  "itemId" TEXT,
  "variantId" TEXT,
  "locationId" TEXT,
  "message" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "resolvedAt" timestamptz,
  CONSTRAINT "InventoryAlert_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryAlert_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL,
  CONSTRAINT "InventoryAlert_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryAttachment" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT,
  "entityType" text NOT NULL,
  "entityId" text NOT NULL,
  "filename" text NOT NULL,
  "url" text NOT NULL,
  "size" integer,
  "mimeType" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryAttachment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL
);

CREATE TABLE "InventoryCustomField" (
  "id" TEXT PRIMARY KEY,
  "key" text NOT NULL UNIQUE,
  "label" text NOT NULL,
  "type" text NOT NULL,
  "config" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "InventoryCustomFieldValue" (
  "id" TEXT PRIMARY KEY,
  "itemId" TEXT NOT NULL,
  "fieldId" TEXT NOT NULL,
  "value" jsonb NOT NULL,
  CONSTRAINT "InventoryCustomFieldValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE,
  CONSTRAINT "InventoryCustomFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "InventoryCustomField"("id") ON DELETE CASCADE,
  UNIQUE ("itemId", "fieldId")
);

CREATE TABLE "InventoryAuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorId" TEXT,
  "action" text NOT NULL,
  "entity" text NOT NULL,
  "entityId" text,
  "before" jsonb,
  "after" jsonb,
  "reason" text,
  "ip" text,
  "requestId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "InventoryAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX "InventoryLocation_isActive_idx" ON "InventoryLocation"("isActive");
CREATE INDEX "InventoryLocationAccess_locationId_idx" ON "InventoryLocationAccess"("locationId");
CREATE INDEX "InventoryBin_locationId_idx" ON "InventoryBin"("locationId");
CREATE INDEX "InventoryItem_categoryId_idx" ON "InventoryItem"("categoryId");
CREATE INDEX "InventoryItem_unitId_idx" ON "InventoryItem"("unitId");
CREATE INDEX "InventoryItem_type_idx" ON "InventoryItem"("type");
CREATE INDEX "InventoryItem_isActive_idx" ON "InventoryItem"("isActive");
CREATE INDEX "InventoryItemVariant_itemId_idx" ON "InventoryItemVariant"("itemId");
CREATE INDEX "InventoryItemSupplier_supplierId_idx" ON "InventoryItemSupplier"("supplierId");
CREATE INDEX "InventoryReorderRule_itemId_idx" ON "InventoryReorderRule"("itemId");
CREATE INDEX "InventoryReorderRule_locationId_idx" ON "InventoryReorderRule"("locationId");
CREATE INDEX "InventoryStockBalance_locationId_idx" ON "InventoryStockBalance"("locationId");
CREATE INDEX "InventoryBatch_itemId_idx" ON "InventoryBatch"("itemId");
CREATE INDEX "InventoryBatch_locationId_idx" ON "InventoryBatch"("locationId");
CREATE INDEX "InventorySerial_itemId_idx" ON "InventorySerial"("itemId");
CREATE INDEX "InventorySerial_locationId_idx" ON "InventorySerial"("locationId");
CREATE INDEX "InventoryStockMovement_itemId_idx" ON "InventoryStockMovement"("itemId");
CREATE INDEX "InventoryStockMovement_locationFromId_idx" ON "InventoryStockMovement"("locationFromId");
CREATE INDEX "InventoryStockMovement_locationToId_idx" ON "InventoryStockMovement"("locationToId");
CREATE INDEX "InventoryStockMovement_type_idx" ON "InventoryStockMovement"("type");
CREATE INDEX "InventoryRequest_status_idx" ON "InventoryRequest"("status");
CREATE INDEX "InventoryRequest_requestedById_idx" ON "InventoryRequest"("requestedById");
CREATE INDEX "InventoryRequestLine_requestId_idx" ON "InventoryRequestLine"("requestId");
CREATE INDEX "InventoryRequestLine_itemId_idx" ON "InventoryRequestLine"("itemId");
CREATE INDEX "InventoryRequestApproval_requestId_idx" ON "InventoryRequestApproval"("requestId");
CREATE INDEX "InventoryIssueNote_requestId_idx" ON "InventoryIssueNote"("requestId");
CREATE INDEX "InventoryTransfer_status_idx" ON "InventoryTransfer"("status");
CREATE INDEX "InventoryTransfer_fromLocationId_idx" ON "InventoryTransfer"("fromLocationId");
CREATE INDEX "InventoryTransfer_toLocationId_idx" ON "InventoryTransfer"("toLocationId");
CREATE INDEX "InventoryTransferLine_transferId_idx" ON "InventoryTransferLine"("transferId");
CREATE INDEX "InventoryAdjustment_status_idx" ON "InventoryAdjustment"("status");
CREATE INDEX "InventoryAdjustment_locationId_idx" ON "InventoryAdjustment"("locationId");
CREATE INDEX "InventoryAdjustmentLine_adjustmentId_idx" ON "InventoryAdjustmentLine"("adjustmentId");
CREATE INDEX "InventoryCountSession_status_idx" ON "InventoryCountSession"("status");
CREATE INDEX "InventoryCountSession_locationId_idx" ON "InventoryCountSession"("locationId");
CREATE INDEX "InventoryCountLine_sessionId_idx" ON "InventoryCountLine"("sessionId");
CREATE INDEX "InventoryAlert_status_idx" ON "InventoryAlert"("status");
CREATE INDEX "InventoryAlert_type_idx" ON "InventoryAlert"("type");
CREATE INDEX "InventoryAttachment_entity_idx" ON "InventoryAttachment"("entityType", "entityId");
