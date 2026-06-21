ALTER TABLE "StoreProduct"
  ADD COLUMN "costPrice" DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 15,
  ADD COLUMN "vatInclusive" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "barcode" TEXT,
  ADD COLUMN "allowOnlinePurchase" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "sizeOptions" JSONB,
  ADD COLUMN "colorOptions" JSONB,
  ADD COLUMN "genderGroup" TEXT,
  ADD COLUMN "gradeGroup" TEXT,
  ADD COLUMN "supplierId" TEXT,
  ADD COLUMN "reorderQuantity" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "collectionLocation" TEXT,
  ADD COLUMN "returnPolicy" TEXT;

CREATE INDEX "StoreOrderItem_productId_idx" ON "StoreOrderItem"("productId");
ALTER TABLE "StoreOrderItem" ADD CONSTRAINT "StoreOrderItem_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "StoreProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "StoreStockMovement" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "quantityChange" INTEGER NOT NULL DEFAULT 0,
  "previousQuantity" INTEGER NOT NULL,
  "newQuantity" INTEGER NOT NULL,
  "previousPrice" DOUBLE PRECISION,
  "newPrice" DOUBLE PRECISION,
  "reason" TEXT,
  "reference" TEXT,
  "actorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StoreStockMovement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "StoreStockMovement_tenantId_idx" ON "StoreStockMovement"("tenantId");
CREATE INDEX "StoreStockMovement_productId_createdAt_idx" ON "StoreStockMovement"("productId", "createdAt");
ALTER TABLE "StoreStockMovement" ADD CONSTRAINT "StoreStockMovement_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "StoreProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AcademicGrade" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "name" TEXT NOT NULL, "code" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0, "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcademicGrade_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AcademicGrade_tenantId_code_key" ON "AcademicGrade"("tenantId", "code");
CREATE INDEX "AcademicGrade_tenantId_idx" ON "AcademicGrade"("tenantId");

CREATE TABLE "SchoolClass" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "gradeId" TEXT NOT NULL, "name" TEXT NOT NULL,
  "code" TEXT NOT NULL, "academicYear" INTEGER NOT NULL, "room" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SchoolClass_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SchoolClass_tenantId_code_academicYear_key" ON "SchoolClass"("tenantId", "code", "academicYear");
CREATE INDEX "SchoolClass_tenantId_gradeId_idx" ON "SchoolClass"("tenantId", "gradeId");

CREATE TABLE "TeacherClassAssignment" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "classId" TEXT NOT NULL,
  "subject" TEXT NOT NULL, "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TeacherClassAssignment_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "TeacherClassAssignment_teacherId_classId_subject_key" ON "TeacherClassAssignment"("teacherId", "classId", "subject");
CREATE INDEX "TeacherClassAssignment_tenantId_teacherId_idx" ON "TeacherClassAssignment"("tenantId", "teacherId");
CREATE INDEX "TeacherClassAssignment_classId_idx" ON "TeacherClassAssignment"("classId");

CREATE TABLE "LearnerProfile" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "classId" TEXT NOT NULL, "studentNumber" TEXT NOT NULL,
  "firstName" TEXT NOT NULL, "lastName" TEXT NOT NULL, "parentIds" JSONB, "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LearnerProfile_studentNumber_key" ON "LearnerProfile"("studentNumber");
CREATE INDEX "LearnerProfile_tenantId_classId_idx" ON "LearnerProfile"("tenantId", "classId");

CREATE TABLE "TeacherTimetableEntry" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "classId" TEXT NOT NULL,
  "subject" TEXT NOT NULL, "dayOfWeek" INTEGER NOT NULL, "startsAt" TEXT NOT NULL, "endsAt" TEXT NOT NULL,
  "room" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TeacherTimetableEntry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TeacherTimetableEntry_tenantId_teacherId_dayOfWeek_idx" ON "TeacherTimetableEntry"("tenantId", "teacherId", "dayOfWeek");
CREATE INDEX "TeacherTimetableEntry_classId_idx" ON "TeacherTimetableEntry"("classId");

CREATE TABLE "TeacherWorkItem" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "classId" TEXT,
  "type" TEXT NOT NULL, "title" TEXT NOT NULL, "instructions" TEXT, "dueAt" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'DRAFT', "visibleToParents" BOOLEAN NOT NULL DEFAULT false,
  "attachments" JSONB, "curriculumOutcomes" JSONB, "linkedWorkItemId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeacherWorkItem_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TeacherWorkItem_tenantId_teacherId_type_idx" ON "TeacherWorkItem"("tenantId", "teacherId", "type");
CREATE INDEX "TeacherWorkItem_classId_dueAt_idx" ON "TeacherWorkItem"("classId", "dueAt");

CREATE TABLE "AttendanceRegister" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "classId" TEXT NOT NULL, "teacherId" TEXT NOT NULL,
  "registerDate" TIMESTAMP(3) NOT NULL, "status" TEXT NOT NULL DEFAULT 'DRAFT', "submittedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AttendanceRegister_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AttendanceRegister_classId_registerDate_key" ON "AttendanceRegister"("classId", "registerDate");
CREATE INDEX "AttendanceRegister_tenantId_teacherId_idx" ON "AttendanceRegister"("tenantId", "teacherId");

CREATE TABLE "AttendanceEntry" (
  "id" TEXT NOT NULL, "registerId" TEXT NOT NULL, "learnerId" TEXT NOT NULL, "status" TEXT NOT NULL,
  "note" TEXT, "notifyParent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AttendanceEntry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AttendanceEntry_registerId_learnerId_key" ON "AttendanceEntry"("registerId", "learnerId");
CREATE INDEX "AttendanceEntry_learnerId_idx" ON "AttendanceEntry"("learnerId");
ALTER TABLE "AttendanceEntry" ADD CONSTRAINT "AttendanceEntry_registerId_fkey"
  FOREIGN KEY ("registerId") REFERENCES "AttendanceRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ParentTeacherQuery" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "classId" TEXT NOT NULL, "learnerId" TEXT NOT NULL,
  "parentId" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "subject" TEXT NOT NULL, "message" TEXT NOT NULL,
  "response" TEXT, "status" TEXT NOT NULL DEFAULT 'OPEN', "escalatedAt" TIMESTAMP(3), "resolvedAt" TIMESTAMP(3),
  "attachments" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ParentTeacherQuery_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ParentTeacherQuery_tenantId_teacherId_status_idx" ON "ParentTeacherQuery"("tenantId", "teacherId", "status");
CREATE INDEX "ParentTeacherQuery_classId_learnerId_idx" ON "ParentTeacherQuery"("classId", "learnerId");
