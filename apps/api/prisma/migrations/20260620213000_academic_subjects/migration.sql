CREATE TABLE "AcademicSubject" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "name" TEXT NOT NULL, "code" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcademicSubject_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AcademicSubject_tenantId_code_key" ON "AcademicSubject"("tenantId", "code");
CREATE INDEX "AcademicSubject_tenantId_isActive_idx" ON "AcademicSubject"("tenantId", "isActive");
CREATE TABLE "ClassSubject" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "classId" TEXT NOT NULL, "subjectId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClassSubject_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ClassSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ClassSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "AcademicSubject"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ClassSubject_classId_subjectId_key" ON "ClassSubject"("classId", "subjectId");
CREATE INDEX "ClassSubject_tenantId_classId_idx" ON "ClassSubject"("tenantId", "classId");
