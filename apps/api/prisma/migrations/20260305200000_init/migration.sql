-- POPIN-LMS initial schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "AutomationStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "AutomationRunStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');
CREATE TYPE "EmailAccountStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');
CREATE TYPE "OrderStatus" AS ENUM ('PendingPayment', 'PendingEFTVerification', 'Paid', 'Picking', 'ReadyForCollection', 'Collected', 'Completed', 'Returned');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
CREATE TYPE "CalendarConnectionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TABLE "User" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "passwordHash" text,
  "name" text,
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  "lastLoginAt" timestamptz
);

CREATE TABLE "ExternalAccount" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE "Role" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL UNIQUE,
  "description" text
);

CREATE TABLE "Permission" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "module" text NOT NULL,
  "action" text NOT NULL,
  "boardId" uuid,
  "stageId" uuid,
  UNIQUE ("module", "action", "boardId", "stageId")
);

CREATE TABLE "RolePermission" (
  "roleId" uuid NOT NULL REFERENCES "Role"("id") ON DELETE CASCADE,
  "permissionId" uuid NOT NULL REFERENCES "Permission"("id") ON DELETE CASCADE,
  PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE "UserRole" (
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "roleId" uuid NOT NULL REFERENCES "Role"("id") ON DELETE CASCADE,
  PRIMARY KEY ("userId", "roleId")
);

CREATE TABLE "Setting" (
  "key" text PRIMARY KEY,
  "value" jsonb NOT NULL
);

CREATE TABLE "License" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "maxUsers" integer NOT NULL,
  "maxTeachers" integer NOT NULL,
  "maxParents" integer NOT NULL,
  "maxApiIntegrations" integer NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "ModuleToggle" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "moduleKey" text NOT NULL UNIQUE,
  "enabled" boolean NOT NULL DEFAULT true
);

CREATE TABLE "Board" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "module" text NOT NULL,
  "description" text
);

CREATE TABLE "SavedView" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "boardId" uuid NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "type" text NOT NULL,
  "config" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "SavedView_userId_idx" ON "SavedView"("userId");
CREATE INDEX "SavedView_boardId_idx" ON "SavedView"("boardId");

CREATE TABLE "CardFieldDefinition" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "boardId" uuid NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
  "fieldKey" text NOT NULL,
  "label" text NOT NULL,
  "type" text NOT NULL,
  "config" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("boardId", "fieldKey")
);
CREATE INDEX "CardFieldDefinition_boardId_idx" ON "CardFieldDefinition"("boardId");

CREATE TABLE "BoardStage" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "boardId" uuid NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "order" integer NOT NULL
);
CREATE INDEX "BoardStage_boardId_idx" ON "BoardStage"("boardId");

CREATE TABLE "Card" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "boardId" uuid NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
  "stageId" uuid NOT NULL REFERENCES "BoardStage"("id"),
  "title" text NOT NULL,
  "description" text,
  "createdById" uuid NOT NULL REFERENCES "User"("id"),
  "assignedToId" uuid REFERENCES "User"("id"),
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "Card_boardId_idx" ON "Card"("boardId");
CREATE INDEX "Card_stageId_idx" ON "Card"("stageId");

CREATE TABLE "CardFieldValue" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "cardId" uuid NOT NULL REFERENCES "Card"("id") ON DELETE CASCADE,
  "fieldKey" text NOT NULL,
  "value" jsonb NOT NULL,
  UNIQUE ("cardId", "fieldKey")
);

CREATE TABLE "CardComment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "cardId" uuid NOT NULL REFERENCES "Card"("id") ON DELETE CASCADE,
  "authorId" uuid NOT NULL REFERENCES "User"("id"),
  "body" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "CardAttachment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "cardId" uuid NOT NULL REFERENCES "Card"("id") ON DELETE CASCADE,
  "filename" text NOT NULL,
  "url" text NOT NULL,
  "size" integer NOT NULL,
  "mimeType" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "CardLink" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fromCardId" uuid NOT NULL REFERENCES "Card"("id") ON DELETE CASCADE,
  "toCardId" uuid NOT NULL REFERENCES "Card"("id") ON DELETE CASCADE,
  "relation" text NOT NULL
);

CREATE TABLE "CardStageHistory" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "cardId" uuid NOT NULL REFERENCES "Card"("id") ON DELETE CASCADE,
  "fromStageId" uuid,
  "toStageId" uuid NOT NULL,
  "movedById" uuid NOT NULL REFERENCES "User"("id"),
  "movedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "CardStageHistory_cardId_idx" ON "CardStageHistory"("cardId");

CREATE TABLE "AutomationRule" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "trigger" text NOT NULL,
  "boardId" uuid,
  "status" "AutomationStatus" NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE "AutomationRuleVersion" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "ruleId" uuid NOT NULL REFERENCES "AutomationRule"("id") ON DELETE CASCADE,
  "version" integer NOT NULL,
  "conditions" jsonb NOT NULL,
  "actions" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "createdById" uuid NOT NULL REFERENCES "User"("id")
);
CREATE INDEX "AutomationRuleVersion_ruleId_idx" ON "AutomationRuleVersion"("ruleId");

CREATE TABLE "AutomationRun" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "ruleId" uuid NOT NULL REFERENCES "AutomationRule"("id") ON DELETE CASCADE,
  "status" "AutomationRunStatus" NOT NULL,
  "payload" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "finishedAt" timestamptz,
  "error" text
);

CREATE TABLE "EmailAccount" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider" text NOT NULL,
  "email" text NOT NULL,
  "config" jsonb NOT NULL,
  "status" "EmailAccountStatus" NOT NULL DEFAULT 'ACTIVE',
  "defaultUserId" uuid,
  "createdById" uuid NOT NULL REFERENCES "User"("id")
);

CREATE TABLE "BoardEmailIdentity" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "boardId" uuid NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
  "accountId" uuid NOT NULL REFERENCES "EmailAccount"("id") ON DELETE CASCADE,
  "fromName" text NOT NULL,
  "fromAddress" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "BoardEmailIdentity_boardId_idx" ON "BoardEmailIdentity"("boardId");

CREATE TABLE "EmailRoutingRule" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "boardId" uuid NOT NULL,
  "matchType" text NOT NULL,
  "matchValue" text NOT NULL,
  "status" text NOT NULL DEFAULT 'ACTIVE',
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "EmailMessage" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "accountId" uuid NOT NULL REFERENCES "EmailAccount"("id") ON DELETE CASCADE,
  "messageId" text NOT NULL,
  "subject" text NOT NULL,
  "from" text NOT NULL,
  "to" text NOT NULL,
  "raw" text NOT NULL,
  "boardId" uuid,
  "cardId" uuid,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "EmailThread" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "messageId" uuid NOT NULL REFERENCES "EmailMessage"("id") ON DELETE CASCADE,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "PaymentTransaction" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider" text NOT NULL,
  "providerRef" text NOT NULL,
  "amount" double precision NOT NULL,
  "currency" text NOT NULL,
  "status" "PaymentStatus" NOT NULL,
  "orderId" uuid,
  UNIQUE ("provider", "providerRef")
);

CREATE TABLE "PaymentWebhook" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "provider" text NOT NULL,
  "providerRef" text NOT NULL,
  "payload" jsonb NOT NULL,
  "receivedAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("provider", "providerRef")
);

CREATE TABLE "StoreOrder" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "parentId" uuid NOT NULL REFERENCES "User"("id"),
  "status" "OrderStatus" NOT NULL DEFAULT 'PendingPayment',
  "totalAmount" double precision NOT NULL,
  "paymentMethod" text NOT NULL,
  "eftProofUrl" text,
  "eftVerifiedById" uuid,
  "eftVerifiedAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "StoreOrderItem" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderId" uuid NOT NULL REFERENCES "StoreOrder"("id") ON DELETE CASCADE,
  "productId" uuid NOT NULL,
  "name" text NOT NULL,
  "quantity" integer NOT NULL,
  "price" double precision NOT NULL
);

CREATE TABLE "Item" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "sku" text NOT NULL UNIQUE,
  "description" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "StockLocation" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL
);

CREATE TABLE "StockLedger" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "itemId" uuid NOT NULL REFERENCES "Item"("id") ON DELETE CASCADE,
  "locationId" uuid NOT NULL REFERENCES "StockLocation"("id"),
  "quantity" integer NOT NULL,
  "reason" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "StockLedger_itemId_idx" ON "StockLedger"("itemId");

CREATE TABLE "Supplier" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text,
  "phone" text,
  "bankDetails" jsonb,
  "taxInfo" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "Student" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "grade" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "FeeInvoice" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "studentId" uuid NOT NULL REFERENCES "Student"("id") ON DELETE CASCADE,
  "term" text NOT NULL,
  "amount" double precision NOT NULL,
  "dueDate" timestamptz NOT NULL,
  "status" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "FeePayment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoiceId" uuid NOT NULL REFERENCES "FeeInvoice"("id") ON DELETE CASCADE,
  "amount" double precision NOT NULL,
  "paidAt" timestamptz NOT NULL DEFAULT now(),
  "method" text NOT NULL,
  "reference" text
);

CREATE TABLE "Appointment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "staffId" uuid NOT NULL REFERENCES "User"("id"),
  "parentId" uuid NOT NULL REFERENCES "User"("id"),
  "startsAt" timestamptz NOT NULL,
  "endsAt" timestamptz NOT NULL,
  "location" text,
  "status" "AppointmentStatus" NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "Appointment_staffId_idx" ON "Appointment"("staffId");

CREATE TABLE "CalendarConnection" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "provider" text NOT NULL,
  "accessToken" text NOT NULL,
  "refreshToken" text,
  "status" "CalendarConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "CalendarConnection_userId_idx" ON "CalendarConnection"("userId");

CREATE TABLE "PushSubscription" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "endpoint" text NOT NULL UNIQUE,
  "keys" jsonb NOT NULL
);

CREATE TABLE "NotificationPreference" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "channels" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "AuditLog" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "actorId" uuid,
  "action" text NOT NULL,
  "entity" text NOT NULL,
  "entityId" text,
  "data" jsonb,
  "ip" text,
  "requestId" text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);
