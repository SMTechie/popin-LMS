-- Alter ExternalIntegration
ALTER TABLE "ExternalIntegration" ADD COLUMN "applicationFormApiEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "ExternalIntegration" ADD COLUMN "publicApplyBaseUrl" TEXT;
ALTER TABLE "ExternalIntegration" ADD COLUMN "syncMode" TEXT NOT NULL DEFAULT 'api_pull';
ALTER TABLE "ExternalIntegration" ADD COLUMN "defaultCatalogVisibility" TEXT DEFAULT 'universal';
ALTER TABLE "ExternalIntegration" ADD COLUMN "requestTimeoutSeconds" INTEGER DEFAULT 15;
ALTER TABLE "ExternalIntegration" ADD COLUMN "retryPolicy" JSONB;
ALTER TABLE "ExternalIntegration" ADD COLUMN "requestSigningMode" TEXT DEFAULT 'hmac';
ALTER TABLE "ExternalIntegration" ADD COLUMN "environment" TEXT DEFAULT 'development';
ALTER TABLE "ExternalIntegration" ADD COLUMN "customHeaders" JSONB;
ALTER TABLE "ExternalIntegration" ADD COLUMN "catalogEndpoint" TEXT;
ALTER TABLE "ExternalIntegration" ADD COLUMN "callbackEndpoint" TEXT;
ALTER TABLE "ExternalIntegration" ADD COLUMN "lastApplicationLinkRequestAt" TIMESTAMP(3);

-- Alter ApiRequestLog
ALTER TABLE "ApiRequestLog" ADD COLUMN "userAgent" TEXT;
ALTER TABLE "ApiRequestLog" ADD COLUMN "headers" JSONB;

-- Alter WebhookDelivery
ALTER TABLE "WebhookDelivery" ADD COLUMN "lastError" TEXT;

-- Alter StoreCategory
ALTER TABLE "StoreCategory" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "StoreCategory" ADD COLUMN "catalogId" TEXT;
ALTER TABLE "StoreCategory" ADD COLUMN "parentCategoryId" TEXT;
ALTER TABLE "StoreCategory" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StoreCategory" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "StoreCategory" ADD COLUMN "imageUrl" TEXT;

-- Alter StoreProduct
ALTER TABLE "StoreProduct" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "StoreProduct" ADD COLUMN "catalogId" TEXT;
ALTER TABLE "StoreProduct" ADD COLUMN "productType" TEXT;
ALTER TABLE "StoreProduct" ADD COLUMN "sku" TEXT;
ALTER TABLE "StoreProduct" ADD COLUMN "shortDescription" TEXT;
ALTER TABLE "StoreProduct" ADD COLUMN "longDescription" TEXT;
ALTER TABLE "StoreProduct" ADD COLUMN "basePrice" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "StoreProduct" ADD COLUMN "currencyCode" TEXT NOT NULL DEFAULT 'ZAR';
ALTER TABLE "StoreProduct" ADD COLUMN "stockQuantity" INTEGER DEFAULT 0;
ALTER TABLE "StoreProduct" ADD COLUMN "lowStockThreshold" INTEGER DEFAULT 0;
ALTER TABLE "StoreProduct" ADD COLUMN "trackInventory" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "StoreProduct" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "StoreProduct" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StoreProduct" ADD COLUMN "visibility" TEXT NOT NULL DEFAULT 'universal';
ALTER TABLE "StoreProduct" ADD COLUMN "lastSyncedAt" TIMESTAMP(3);

-- Alter StoreVariant
ALTER TABLE "StoreVariant" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "StoreVariant" ADD COLUMN "size" TEXT;
ALTER TABLE "StoreVariant" ADD COLUMN "color" TEXT;
ALTER TABLE "StoreVariant" ADD COLUMN "priceOverride" DOUBLE PRECISION;
ALTER TABLE "StoreVariant" ADD COLUMN "stockQuantity" INTEGER;
ALTER TABLE "StoreVariant" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "StoreVariant" ALTER COLUMN "sku" DROP NOT NULL;

-- Alter StoreImage
ALTER TABLE "StoreImage" ADD COLUMN "tenantId" TEXT;
ALTER TABLE "StoreImage" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StoreImage" ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- New StoreCatalog table
CREATE TABLE "StoreCatalog" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StoreCatalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StoreCatalog_tenantId_slug_key" ON "StoreCatalog"("tenantId", "slug");
CREATE INDEX "StoreCatalog_tenantId_idx" ON "StoreCatalog"("tenantId");

-- New StoreSyncEvent table
CREATE TABLE "StoreSyncEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "source" TEXT NOT NULL DEFAULT 'system_job',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StoreSyncEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StoreSyncEvent_tenantId_idx" ON "StoreSyncEvent"("tenantId");
CREATE INDEX "StoreSyncEvent_entityType_entityId_idx" ON "StoreSyncEvent"("entityType", "entityId");

-- New ApplicationForm tables
CREATE TABLE "ApplicationForm" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "currentVersionId" TEXT,
  "admissionsOpenState" TEXT NOT NULL DEFAULT 'open',
  "opensAt" TIMESTAMP(3),
  "closesAt" TIMESTAMP(3),
  "closedMessage" TEXT,
  "openingMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApplicationForm_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ApplicationForm_tenantId_slug_key" ON "ApplicationForm"("tenantId", "slug");
CREATE INDEX "ApplicationForm_tenantId_idx" ON "ApplicationForm"("tenantId");

CREATE TABLE "ApplicationFormVersion" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "formId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "schemaJson" JSONB NOT NULL,
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationFormVersion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ApplicationFormVersion_formId_versionNumber_key" ON "ApplicationFormVersion"("formId", "versionNumber");
CREATE INDEX "ApplicationFormVersion_tenantId_idx" ON "ApplicationFormVersion"("tenantId");

CREATE TABLE "ApplicationSubmission" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "formId" TEXT NOT NULL,
  "formVersionId" TEXT NOT NULL,
  "submissionReference" TEXT NOT NULL,
  "submissionChannel" TEXT NOT NULL,
  "applicantName" TEXT,
  "guardianName" TEXT,
  "guardianEmail" TEXT,
  "guardianPhone" TEXT,
  "payloadJson" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'submitted',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ApplicationSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ApplicationSubmission_submissionReference_key" ON "ApplicationSubmission"("submissionReference");
CREATE INDEX "ApplicationSubmission_tenantId_idx" ON "ApplicationSubmission"("tenantId");

CREATE TABLE "ApplicationSubmissionFile" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "fieldKey" TEXT NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "storagePath" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ApplicationSubmissionFile_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApplicationSubmissionFile_submissionId_idx" ON "ApplicationSubmissionFile"("submissionId");
CREATE INDEX "ApplicationSubmissionFile_tenantId_idx" ON "ApplicationSubmissionFile"("tenantId");

-- Foreign keys
ALTER TABLE "StoreCategory" ADD CONSTRAINT "StoreCategory_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "StoreCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StoreCategory" ADD CONSTRAINT "StoreCategory_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "StoreCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StoreProduct" ADD CONSTRAINT "StoreProduct_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "StoreCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ApplicationFormVersion" ADD CONSTRAINT "ApplicationFormVersion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ApplicationForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApplicationFormVersion" ADD CONSTRAINT "ApplicationFormVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ApplicationSubmission" ADD CONSTRAINT "ApplicationSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ApplicationForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ApplicationSubmission" ADD CONSTRAINT "ApplicationSubmission_formVersionId_fkey" FOREIGN KEY ("formVersionId") REFERENCES "ApplicationFormVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ApplicationSubmissionFile" ADD CONSTRAINT "ApplicationSubmissionFile_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "StoreCategory_tenantId_idx" ON "StoreCategory"("tenantId");
CREATE INDEX "StoreCategory_catalogId_idx" ON "StoreCategory"("catalogId");
CREATE INDEX "StoreProduct_tenantId_idx" ON "StoreProduct"("tenantId");
CREATE INDEX "StoreProduct_catalogId_idx" ON "StoreProduct"("catalogId");
CREATE INDEX "StoreVariant_tenantId_idx" ON "StoreVariant"("tenantId");
CREATE INDEX "StoreImage_tenantId_idx" ON "StoreImage"("tenantId");
