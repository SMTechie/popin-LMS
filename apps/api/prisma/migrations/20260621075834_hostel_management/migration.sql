-- DropForeignKey
ALTER TABLE "ApplicationFormVersion" DROP CONSTRAINT "ApplicationFormVersion_formId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationSubmissionFile" DROP CONSTRAINT "ApplicationSubmissionFile_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAdjustment" DROP CONSTRAINT "InventoryAdjustment_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAdjustment" DROP CONSTRAINT "InventoryAdjustment_createdById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAdjustment" DROP CONSTRAINT "InventoryAdjustment_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAdjustmentLine" DROP CONSTRAINT "InventoryAdjustmentLine_adjustmentId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAdjustmentLine" DROP CONSTRAINT "InventoryAdjustmentLine_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAdjustmentLine" DROP CONSTRAINT "InventoryAdjustmentLine_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAlert" DROP CONSTRAINT "InventoryAlert_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAlert" DROP CONSTRAINT "InventoryAlert_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAlert" DROP CONSTRAINT "InventoryAlert_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAttachment" DROP CONSTRAINT "InventoryAttachment_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryAuditLog" DROP CONSTRAINT "InventoryAuditLog_actorId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryBatch" DROP CONSTRAINT "InventoryBatch_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryBatch" DROP CONSTRAINT "InventoryBatch_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryBatch" DROP CONSTRAINT "InventoryBatch_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryBin" DROP CONSTRAINT "InventoryBin_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCountLine" DROP CONSTRAINT "InventoryCountLine_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCountLine" DROP CONSTRAINT "InventoryCountLine_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCountLine" DROP CONSTRAINT "InventoryCountLine_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCountSession" DROP CONSTRAINT "InventoryCountSession_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCountSession" DROP CONSTRAINT "InventoryCountSession_createdById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCountSession" DROP CONSTRAINT "InventoryCountSession_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCustomFieldValue" DROP CONSTRAINT "InventoryCustomFieldValue_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryCustomFieldValue" DROP CONSTRAINT "InventoryCustomFieldValue_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryIssueNote" DROP CONSTRAINT "InventoryIssueNote_issuedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryIssueNote" DROP CONSTRAINT "InventoryIssueNote_requestId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_unitId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItemSupplier" DROP CONSTRAINT "InventoryItemSupplier_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItemSupplier" DROP CONSTRAINT "InventoryItemSupplier_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItemVariant" DROP CONSTRAINT "InventoryItemVariant_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryLocation" DROP CONSTRAINT "InventoryLocation_managerId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryLocationAccess" DROP CONSTRAINT "InventoryLocationAccess_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryLocationAccess" DROP CONSTRAINT "InventoryLocationAccess_userId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryReorderRule" DROP CONSTRAINT "InventoryReorderRule_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryReorderRule" DROP CONSTRAINT "InventoryReorderRule_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryReorderRule" DROP CONSTRAINT "InventoryReorderRule_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequest" DROP CONSTRAINT "InventoryRequest_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequest" DROP CONSTRAINT "InventoryRequest_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequestApproval" DROP CONSTRAINT "InventoryRequestApproval_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequestApproval" DROP CONSTRAINT "InventoryRequestApproval_requestId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequestLine" DROP CONSTRAINT "InventoryRequestLine_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequestLine" DROP CONSTRAINT "InventoryRequestLine_requestId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryRequestLine" DROP CONSTRAINT "InventoryRequestLine_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventorySerial" DROP CONSTRAINT "InventorySerial_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventorySerial" DROP CONSTRAINT "InventorySerial_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventorySerial" DROP CONSTRAINT "InventorySerial_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockBalance" DROP CONSTRAINT "InventoryStockBalance_binId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockBalance" DROP CONSTRAINT "InventoryStockBalance_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockBalance" DROP CONSTRAINT "InventoryStockBalance_locationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockBalance" DROP CONSTRAINT "InventoryStockBalance_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_batchId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_binId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_createdById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_locationFromId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_locationToId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_serialId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryStockMovement" DROP CONSTRAINT "InventoryStockMovement_variantId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransfer" DROP CONSTRAINT "InventoryTransfer_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransfer" DROP CONSTRAINT "InventoryTransfer_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransfer" DROP CONSTRAINT "InventoryTransfer_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransfer" DROP CONSTRAINT "InventoryTransfer_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransferLine" DROP CONSTRAINT "InventoryTransferLine_itemId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransferLine" DROP CONSTRAINT "InventoryTransferLine_transferId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryTransferLine" DROP CONSTRAINT "InventoryTransferLine_variantId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "RequisitionDetail" DROP CONSTRAINT "RequisitionDetail_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "RequisitionItem" DROP CONSTRAINT "RequisitionItem_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "TicketApproval" DROP CONSTRAINT "TicketApproval_ticketId_fkey";

-- AlterTable
ALTER TABLE "GuardianStudentLink" ADD COLUMN     "applyHostel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submitHostelConcerns" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "viewHostel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "viewHostelBilling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "viewHostelMovement" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "InventoryAdjustment" ALTER COLUMN "approvedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryAlert" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "resolvedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryAttachment" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryAuditLog" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryBatch" ALTER COLUMN "expiryDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "receivedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryBin" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryCategory" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryCountSession" ALTER COLUMN "startedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "closedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "approvedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryCustomField" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryIssueNote" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryItem" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryItemSupplier" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryItemVariant" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryLocation" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryLocationAccess" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryReorderRule" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryRequest" ALTER COLUMN "neededBy" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryRequestApproval" ALTER COLUMN "approvedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventorySerial" ALTER COLUMN "assignedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryStockBalance" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryStockMovement" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryTransfer" ALTER COLUMN "approvedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "shippedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "receivedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "InventoryUnit" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "HostelBuilding" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "genderPolicy" TEXT NOT NULL DEFAULT 'MIXED',
    "address" TEXT,
    "wardenId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelBuilding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelBlock" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "houseParentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelRoom" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "name" TEXT,
    "floor" TEXT,
    "roomType" TEXT NOT NULL DEFAULT 'STANDARD',
    "genderPolicy" TEXT NOT NULL DEFAULT 'MIXED',
    "gradeGroup" TEXT,
    "capacity" INTEGER NOT NULL,
    "monthlyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelBed" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelBed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelApplication" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "parentUserId" TEXT,
    "academicYear" INTEGER NOT NULL,
    "term" TEXT,
    "preferredBuildingId" TEXT,
    "reason" TEXT,
    "medicalRequirements" TEXT,
    "dietaryRequirements" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "decisionNotes" TEXT,
    "decidedById" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelAllocation" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "bedId" TEXT NOT NULL,
    "applicationId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'RESERVED',
    "startDate" TIMESTAMP(3) NOT NULL,
    "expectedEndDate" TIMESTAMP(3),
    "checkedInAt" TIMESTAMP(3),
    "checkedInById" TEXT,
    "checkedOutAt" TIMESTAMP(3),
    "checkedOutById" TEXT,
    "checkoutReason" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelRollCall" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT,
    "rollDate" TIMESTAMP(3) NOT NULL,
    "session" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelRollCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelRollCallEntry" (
    "id" TEXT NOT NULL,
    "rollCallId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "notifyParent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HostelRollCallEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelMealRegister" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT,
    "mealDate" TIMESTAMP(3) NOT NULL,
    "mealType" TEXT NOT NULL,
    "plannedCount" INTEGER NOT NULL DEFAULT 0,
    "servedCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostelMealRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelMealEntry" (
    "id" TEXT NOT NULL,
    "registerId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT true,
    "dietaryNote" TEXT,

    CONSTRAINT "HostelMealEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelIncident" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "learnerId" TEXT,
    "buildingId" TEXT,
    "roomId" TEXT,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "actionTaken" TEXT,
    "reportedById" TEXT NOT NULL,
    "guardianNotifiedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelMaintenanceRequest" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT,
    "blockId" TEXT,
    "roomId" TEXT,
    "bedId" TEXT,
    "learnerId" TEXT,
    "submittedById" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'STAFF',
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "assignedToId" TEXT,
    "resolution" TEXT,
    "cost" DOUBLE PRECISION,
    "attachments" JSONB,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelMaintenanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelVisitorLog" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "visitorName" TEXT NOT NULL,
    "identityNumber" TEXT,
    "phone" TEXT,
    "relationship" TEXT,
    "purpose" TEXT NOT NULL,
    "vehicleRegistration" TEXT,
    "checkedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkedInById" TEXT NOT NULL,
    "expectedCheckoutAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "checkedOutById" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CHECKED_IN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostelVisitorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelCharge" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "allocationId" TEXT,
    "description" TEXT NOT NULL,
    "billingPeriod" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DUE',
    "externalInvoiceId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostelCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostelNotice" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buildingId" TEXT,
    "learnerId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "channels" JSONB NOT NULL,
    "visibleToParents" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostelNotice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HostelBuilding_tenantId_isActive_idx" ON "HostelBuilding"("tenantId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "HostelBuilding_tenantId_code_key" ON "HostelBuilding"("tenantId", "code");

-- CreateIndex
CREATE INDEX "HostelBlock_tenantId_buildingId_idx" ON "HostelBlock"("tenantId", "buildingId");

-- CreateIndex
CREATE UNIQUE INDEX "HostelBlock_buildingId_code_key" ON "HostelBlock"("buildingId", "code");

-- CreateIndex
CREATE INDEX "HostelRoom_tenantId_status_idx" ON "HostelRoom"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "HostelRoom_blockId_roomNumber_key" ON "HostelRoom"("blockId", "roomNumber");

-- CreateIndex
CREATE INDEX "HostelBed_tenantId_status_idx" ON "HostelBed"("tenantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "HostelBed_roomId_label_key" ON "HostelBed"("roomId", "label");

-- CreateIndex
CREATE INDEX "HostelApplication_tenantId_status_submittedAt_idx" ON "HostelApplication"("tenantId", "status", "submittedAt");

-- CreateIndex
CREATE INDEX "HostelApplication_learnerId_academicYear_idx" ON "HostelApplication"("learnerId", "academicYear");

-- CreateIndex
CREATE INDEX "HostelAllocation_tenantId_status_idx" ON "HostelAllocation"("tenantId", "status");

-- CreateIndex
CREATE INDEX "HostelAllocation_learnerId_status_idx" ON "HostelAllocation"("learnerId", "status");

-- CreateIndex
CREATE INDEX "HostelAllocation_bedId_status_idx" ON "HostelAllocation"("bedId", "status");

-- CreateIndex
CREATE INDEX "HostelRollCall_tenantId_rollDate_idx" ON "HostelRollCall"("tenantId", "rollDate");

-- CreateIndex
CREATE UNIQUE INDEX "HostelRollCall_tenantId_buildingId_rollDate_session_key" ON "HostelRollCall"("tenantId", "buildingId", "rollDate", "session");

-- CreateIndex
CREATE UNIQUE INDEX "HostelRollCallEntry_rollCallId_learnerId_key" ON "HostelRollCallEntry"("rollCallId", "learnerId");

-- CreateIndex
CREATE INDEX "HostelMealRegister_tenantId_mealDate_idx" ON "HostelMealRegister"("tenantId", "mealDate");

-- CreateIndex
CREATE UNIQUE INDEX "HostelMealRegister_tenantId_buildingId_mealDate_mealType_key" ON "HostelMealRegister"("tenantId", "buildingId", "mealDate", "mealType");

-- CreateIndex
CREATE UNIQUE INDEX "HostelMealEntry_registerId_learnerId_key" ON "HostelMealEntry"("registerId", "learnerId");

-- CreateIndex
CREATE INDEX "HostelIncident_tenantId_status_occurredAt_idx" ON "HostelIncident"("tenantId", "status", "occurredAt");

-- CreateIndex
CREATE INDEX "HostelIncident_learnerId_idx" ON "HostelIncident"("learnerId");

-- CreateIndex
CREATE INDEX "HostelMaintenanceRequest_tenantId_status_priority_idx" ON "HostelMaintenanceRequest"("tenantId", "status", "priority");

-- CreateIndex
CREATE INDEX "HostelMaintenanceRequest_learnerId_idx" ON "HostelMaintenanceRequest"("learnerId");

-- CreateIndex
CREATE INDEX "HostelVisitorLog_tenantId_status_checkedInAt_idx" ON "HostelVisitorLog"("tenantId", "status", "checkedInAt");

-- CreateIndex
CREATE INDEX "HostelVisitorLog_learnerId_idx" ON "HostelVisitorLog"("learnerId");

-- CreateIndex
CREATE INDEX "HostelCharge_tenantId_status_dueDate_idx" ON "HostelCharge"("tenantId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "HostelCharge_learnerId_idx" ON "HostelCharge"("learnerId");

-- CreateIndex
CREATE INDEX "HostelNotice_tenantId_publishedAt_idx" ON "HostelNotice"("tenantId", "publishedAt");

-- CreateIndex
CREATE INDEX "HostelNotice_learnerId_idx" ON "HostelNotice"("learnerId");

-- AddForeignKey
ALTER TABLE "RequisitionDetail" ADD CONSTRAINT "RequisitionDetail_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionItem" ADD CONSTRAINT "RequisitionItem_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketApproval" ADD CONSTRAINT "TicketApproval_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocation" ADD CONSTRAINT "InventoryLocation_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocationAccess" ADD CONSTRAINT "InventoryLocationAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocationAccess" ADD CONSTRAINT "InventoryLocationAccess_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBin" ADD CONSTRAINT "InventoryBin_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InventoryCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "InventoryUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItemVariant" ADD CONSTRAINT "InventoryItemVariant_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItemSupplier" ADD CONSTRAINT "InventoryItemSupplier_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItemSupplier" ADD CONSTRAINT "InventoryItemSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReorderRule" ADD CONSTRAINT "InventoryReorderRule_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReorderRule" ADD CONSTRAINT "InventoryReorderRule_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReorderRule" ADD CONSTRAINT "InventoryReorderRule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockBalance" ADD CONSTRAINT "InventoryStockBalance_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockBalance" ADD CONSTRAINT "InventoryStockBalance_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockBalance" ADD CONSTRAINT "InventoryStockBalance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockBalance" ADD CONSTRAINT "InventoryStockBalance_binId_fkey" FOREIGN KEY ("binId") REFERENCES "InventoryBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_locationFromId_fkey" FOREIGN KEY ("locationFromId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_locationToId_fkey" FOREIGN KEY ("locationToId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_binId_fkey" FOREIGN KEY ("binId") REFERENCES "InventoryBin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "InventoryBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_serialId_fkey" FOREIGN KEY ("serialId") REFERENCES "InventorySerial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryStockMovement" ADD CONSTRAINT "InventoryStockMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryBatch" ADD CONSTRAINT "InventoryBatch_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySerial" ADD CONSTRAINT "InventorySerial_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequest" ADD CONSTRAINT "InventoryRequest_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequest" ADD CONSTRAINT "InventoryRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequestLine" ADD CONSTRAINT "InventoryRequestLine_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InventoryRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequestLine" ADD CONSTRAINT "InventoryRequestLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequestLine" ADD CONSTRAINT "InventoryRequestLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequestApproval" ADD CONSTRAINT "InventoryRequestApproval_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InventoryRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRequestApproval" ADD CONSTRAINT "InventoryRequestApproval_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssueNote" ADD CONSTRAINT "InventoryIssueNote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InventoryRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryIssueNote" ADD CONSTRAINT "InventoryIssueNote_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransfer" ADD CONSTRAINT "InventoryTransfer_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferLine" ADD CONSTRAINT "InventoryTransferLine_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "InventoryTransfer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferLine" ADD CONSTRAINT "InventoryTransferLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransferLine" ADD CONSTRAINT "InventoryTransferLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustment" ADD CONSTRAINT "InventoryAdjustment_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustmentLine" ADD CONSTRAINT "InventoryAdjustmentLine_adjustmentId_fkey" FOREIGN KEY ("adjustmentId") REFERENCES "InventoryAdjustment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustmentLine" ADD CONSTRAINT "InventoryAdjustmentLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAdjustmentLine" ADD CONSTRAINT "InventoryAdjustmentLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCountSession" ADD CONSTRAINT "InventoryCountSession_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCountSession" ADD CONSTRAINT "InventoryCountSession_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCountSession" ADD CONSTRAINT "InventoryCountSession_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCountLine" ADD CONSTRAINT "InventoryCountLine_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InventoryCountSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCountLine" ADD CONSTRAINT "InventoryCountLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCountLine" ADD CONSTRAINT "InventoryCountLine_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAlert" ADD CONSTRAINT "InventoryAlert_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAlert" ADD CONSTRAINT "InventoryAlert_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "InventoryItemVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAlert" ADD CONSTRAINT "InventoryAlert_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "InventoryLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAttachment" ADD CONSTRAINT "InventoryAttachment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCustomFieldValue" ADD CONSTRAINT "InventoryCustomFieldValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCustomFieldValue" ADD CONSTRAINT "InventoryCustomFieldValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "InventoryCustomField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryAuditLog" ADD CONSTRAINT "InventoryAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelBlock" ADD CONSTRAINT "HostelBlock_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "HostelBuilding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelRoom" ADD CONSTRAINT "HostelRoom_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "HostelBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelBed" ADD CONSTRAINT "HostelBed_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HostelRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelApplication" ADD CONSTRAINT "HostelApplication_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelApplication" ADD CONSTRAINT "HostelApplication_preferredBuildingId_fkey" FOREIGN KEY ("preferredBuildingId") REFERENCES "HostelBuilding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_bedId_fkey" FOREIGN KEY ("bedId") REFERENCES "HostelBed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelAllocation" ADD CONSTRAINT "HostelAllocation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "HostelApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelRollCallEntry" ADD CONSTRAINT "HostelRollCallEntry_rollCallId_fkey" FOREIGN KEY ("rollCallId") REFERENCES "HostelRollCall"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelMealEntry" ADD CONSTRAINT "HostelMealEntry_registerId_fkey" FOREIGN KEY ("registerId") REFERENCES "HostelMealRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelCharge" ADD CONSTRAINT "HostelCharge_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostelCharge" ADD CONSTRAINT "HostelCharge_allocationId_fkey" FOREIGN KEY ("allocationId") REFERENCES "HostelAllocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFormVersion" ADD CONSTRAINT "ApplicationFormVersion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationSubmissionFile" ADD CONSTRAINT "ApplicationSubmissionFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "GuardianStudentLink_guardianUserId_learnerId_relationshipType_k" RENAME TO "GuardianStudentLink_guardianUserId_learnerId_relationshipTy_key";

-- RenameIndex
ALTER INDEX "InventoryAttachment_entity_idx" RENAME TO "InventoryAttachment_entityType_entityId_idx";
