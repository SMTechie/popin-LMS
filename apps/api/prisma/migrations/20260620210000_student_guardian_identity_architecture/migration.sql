ALTER TABLE "User"
  ADD COLUMN "userType" TEXT NOT NULL DEFAULT 'PARENT',
  ADD COLUMN "selfRegistered" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);

UPDATE "User" SET "userType" = 'ADMIN' WHERE "id" IN (
  SELECT ur."userId" FROM "UserRole" ur JOIN "Role" r ON r."id" = ur."roleId" WHERE r."name" = 'Super Admin'
);
UPDATE "User" SET "userType" = 'TEACHER' WHERE "id" IN (
  SELECT ur."userId" FROM "UserRole" ur JOIN "Role" r ON r."id" = ur."roleId" WHERE r."name" = 'Teacher'
);

ALTER TABLE "ExternalAccount"
  ADD COLUMN "verifiedEmail" TEXT,
  ADD COLUMN "metadata" JSONB,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "lastLoginAt" TIMESTAMP(3);

ALTER TABLE "LearnerProfile" ALTER COLUMN "classId" DROP NOT NULL;
ALTER TABLE "LearnerProfile"
  ADD COLUMN "gradeId" TEXT,
  ADD COLUMN "preferredName" TEXT,
  ADD COLUMN "dateOfBirth" TIMESTAMP(3),
  ADD COLUMN "identityNumber" TEXT,
  ADD COLUMN "gender" TEXT,
  ADD COLUMN "email" TEXT,
  ADD COLUMN "phone" TEXT,
  ADD COLUMN "address" JSONB,
  ADD COLUMN "medicalNotes" TEXT,
  ADD COLUMN "admissionApplicationId" TEXT,
  ADD COLUMN "archivedAt" TIMESTAMP(3);

ALTER TABLE "FeeInvoice" ADD COLUMN "learnerProfileId" TEXT;
ALTER TABLE "FeeInvoice" ADD CONSTRAINT "FeeInvoice_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "FeeInvoice_learnerProfileId_idx" ON "FeeInvoice"("learnerProfileId");
ALTER TABLE "Appointment" ADD COLUMN "learnerId" TEXT;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "Appointment_learnerId_idx" ON "Appointment"("learnerId");

CREATE INDEX "LearnerProfile_tenantId_gradeId_idx" ON "LearnerProfile"("tenantId", "gradeId");
CREATE INDEX "LearnerProfile_tenantId_identityNumber_idx" ON "LearnerProfile"("tenantId", "identityNumber");

CREATE TABLE "GuardianStudentLink" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "guardianUserId" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "relationshipType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "viewFees" BOOLEAN NOT NULL DEFAULT false,
  "payFees" BOOLEAN NOT NULL DEFAULT false,
  "viewReports" BOOLEAN NOT NULL DEFAULT false,
  "viewHomework" BOOLEAN NOT NULL DEFAULT false,
  "receiveAnnouncements" BOOLEAN NOT NULL DEFAULT false,
  "messageTeachers" BOOLEAN NOT NULL DEFAULT false,
  "authorisePickup" BOOLEAN NOT NULL DEFAULT false,
  "submitApplications" BOOLEAN NOT NULL DEFAULT false,
  "bookAppointments" BOOLEAN NOT NULL DEFAULT false,
  "createdById" TEXT,
  "verifiedById" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GuardianStudentLink_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GuardianStudentLink_guardianUserId_fkey" FOREIGN KEY ("guardianUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GuardianStudentLink_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GuardianStudentLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "GuardianStudentLink_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "GuardianStudentLink_guardianUserId_learnerId_relationshipType_key" ON "GuardianStudentLink"("guardianUserId", "learnerId", "relationshipType");
CREATE INDEX "GuardianStudentLink_tenantId_guardianUserId_status_idx" ON "GuardianStudentLink"("tenantId", "guardianUserId", "status");
CREATE INDEX "GuardianStudentLink_learnerId_idx" ON "GuardianStudentLink"("learnerId");

CREATE TABLE "StudentClassHistory" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "fromClassId" TEXT,
  "toClassId" TEXT,
  "fromGradeId" TEXT,
  "toGradeId" TEXT,
  "reason" TEXT NOT NULL,
  "changedById" TEXT NOT NULL,
  "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StudentClassHistory_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "StudentClassHistory_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "StudentClassHistory_tenantId_learnerId_changedAt_idx" ON "StudentClassHistory"("tenantId", "learnerId", "changedAt");

CREATE TABLE "IdentityProviderConnection" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "provider" TEXT NOT NULL, "displayName" TEXT NOT NULL,
  "tenantDomain" TEXT, "externalTenantId" TEXT, "clientId" TEXT, "encryptedCredentials" JSONB, "scopes" JSONB, "settings" JSONB,
  "status" TEXT NOT NULL DEFAULT 'DISCONNECTED', "tokenHealth" TEXT NOT NULL DEFAULT 'NOT_CONNECTED', "connectedById" TEXT,
  "connectedAt" TIMESTAMP(3), "lastSyncAt" TIMESTAMP(3), "lastError" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IdentityProviderConnection_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "IdentityProviderConnection_connectedById_fkey" FOREIGN KEY ("connectedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "IdentityProviderConnection_tenantId_provider_key" ON "IdentityProviderConnection"("tenantId", "provider");
CREATE INDEX "IdentityProviderConnection_tenantId_status_idx" ON "IdentityProviderConnection"("tenantId", "status");

CREATE TABLE "ExternalGroupRoleMapping" (
  "id" TEXT NOT NULL, "connectionId" TEXT NOT NULL, "externalGroupId" TEXT NOT NULL, "externalGroupName" TEXT NOT NULL,
  "roleId" TEXT NOT NULL, "gradeId" TEXT, "classId" TEXT, "subject" TEXT, "department" TEXT,
  "autoDisable" BOOLEAN NOT NULL DEFAULT true, "manualOverride" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalGroupRoleMapping_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ExternalGroupRoleMapping_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "IdentityProviderConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ExternalGroupRoleMapping_connectionId_externalGroupId_key" ON "ExternalGroupRoleMapping"("connectionId", "externalGroupId");

CREATE TABLE "IdentitySyncLog" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "connectionId" TEXT NOT NULL, "operation" TEXT NOT NULL,
  "status" TEXT NOT NULL, "summary" JSONB, "error" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IdentitySyncLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "IdentitySyncLog_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "IdentityProviderConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IdentitySyncLog_tenantId_connectionId_createdAt_idx" ON "IdentitySyncLog"("tenantId", "connectionId", "createdAt");

CREATE TABLE "ExternalCalendarEvent" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "provider" TEXT NOT NULL, "userId" TEXT, "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL, "externalEventId" TEXT, "title" TEXT NOT NULL, "description" TEXT,
  "startsAt" TIMESTAMP(3) NOT NULL, "endsAt" TIMESTAMP(3) NOT NULL, "location" TEXT, "attendees" JSONB,
  "syncStatus" TEXT NOT NULL DEFAULT 'PENDING', "lastError" TEXT, "lastSyncedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExternalCalendarEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ExternalCalendarEvent_tenantId_provider_sourceType_sourceId_key" ON "ExternalCalendarEvent"("tenantId", "provider", "sourceType", "sourceId");
CREATE INDEX "ExternalCalendarEvent_tenantId_syncStatus_idx" ON "ExternalCalendarEvent"("tenantId", "syncStatus");
