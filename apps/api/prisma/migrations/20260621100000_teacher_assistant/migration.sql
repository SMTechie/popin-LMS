CREATE TABLE "TeacherAssistantAssessment" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "teacherId" TEXT NOT NULL, "subject" TEXT NOT NULL, "pluginKey" TEXT NOT NULL,
  "gradeId" TEXT, "classIds" JSONB NOT NULL, "name" TEXT NOT NULL, "assessmentType" TEXT NOT NULL, "totalMarks" DOUBLE PRECISION NOT NULL,
  "dueAt" TIMESTAMP(3), "status" TEXT NOT NULL DEFAULT 'DRAFT', "uploads" JSONB, "settings" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeacherAssistantAssessment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "TeacherAssistantAssessment_tenantId_teacherId_status_idx" ON "TeacherAssistantAssessment"("tenantId","teacherId","status");

CREATE TABLE "TeacherAssistantQuestion" (
  "id" TEXT NOT NULL, "assessmentId" TEXT NOT NULL, "questionNumber" TEXT NOT NULL, "questionType" TEXT NOT NULL,
  "expectedAnswers" JSONB NOT NULL, "alternativeAnswers" JSONB, "marks" DOUBLE PRECISION NOT NULL, "tolerance" DOUBLE PRECISION,
  "decimalPrecision" INTEGER, "requiredUnit" TEXT, "caseSensitive" BOOLEAN NOT NULL DEFAULT false, "ignoreWhitespace" BOOLEAN NOT NULL DEFAULT true,
  "partialMarkRules" JSONB, "sortOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeacherAssistantQuestion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeacherAssistantQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "TeacherAssistantAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TeacherAssistantQuestion_assessmentId_questionNumber_key" ON "TeacherAssistantQuestion"("assessmentId","questionNumber");
CREATE INDEX "TeacherAssistantQuestion_assessmentId_sortOrder_idx" ON "TeacherAssistantQuestion"("assessmentId","sortOrder");

CREATE TABLE "TeacherAssistantScript" (
  "id" TEXT NOT NULL, "assessmentId" TEXT NOT NULL, "learnerId" TEXT, "detectedStudentNumber" TEXT, "detectedStudentName" TEXT,
  "originalFiles" JSONB NOT NULL, "extractedText" TEXT, "editableText" TEXT, "detectedAnswers" JSONB, "status" TEXT NOT NULL DEFAULT 'QUEUED',
  "ocrConfidence" DOUBLE PRECISION, "markingConfidence" DOUBLE PRECISION, "suggestedTotal" DOUBLE PRECISION, "finalTotal" DOUBLE PRECISION,
  "needsReview" BOOLEAN NOT NULL DEFAULT false, "flags" JSONB, "processingStartedAt" TIMESTAMP(3), "processingCompletedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3), "approvedAt" TIMESTAMP(3), "publishedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "TeacherAssistantScript_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeacherAssistantScript_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "TeacherAssistantAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TeacherAssistantScript_assessmentId_status_idx" ON "TeacherAssistantScript"("assessmentId","status");
CREATE INDEX "TeacherAssistantScript_learnerId_publishedAt_idx" ON "TeacherAssistantScript"("learnerId","publishedAt");

CREATE TABLE "TeacherAssistantQuestionResult" (
  "id" TEXT NOT NULL, "scriptId" TEXT NOT NULL, "questionId" TEXT NOT NULL, "questionNumber" TEXT NOT NULL, "detectedAnswer" TEXT,
  "expectedAnswer" JSONB NOT NULL, "matchingRule" TEXT NOT NULL, "suggestedMarks" DOUBLE PRECISION NOT NULL, "finalMarks" DOUBLE PRECISION NOT NULL,
  "ocrConfidence" DOUBLE PRECISION NOT NULL, "markingConfidence" DOUBLE PRECISION NOT NULL, "overridden" BOOLEAN NOT NULL DEFAULT false,
  "teacherNote" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeacherAssistantQuestionResult_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeacherAssistantQuestionResult_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "TeacherAssistantScript"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TeacherAssistantQuestionResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "TeacherAssistantQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "TeacherAssistantQuestionResult_scriptId_questionId_key" ON "TeacherAssistantQuestionResult"("scriptId","questionId");
CREATE INDEX "TeacherAssistantQuestionResult_scriptId_questionNumber_idx" ON "TeacherAssistantQuestionResult"("scriptId","questionNumber");

CREATE TABLE "TeacherAssistantJob" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "assessmentId" TEXT NOT NULL, "scriptId" TEXT, "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'QUEUED', "attempts" INTEGER NOT NULL DEFAULT 0, "error" TEXT, "lockedAt" TIMESTAMP(3), "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeacherAssistantJob_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeacherAssistantJob_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "TeacherAssistantAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TeacherAssistantJob_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "TeacherAssistantScript"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TeacherAssistantJob_tenantId_status_createdAt_idx" ON "TeacherAssistantJob"("tenantId","status","createdAt");

CREATE TABLE "TeacherAssistantAudit" (
  "id" TEXT NOT NULL, "tenantId" TEXT NOT NULL, "assessmentId" TEXT NOT NULL, "scriptId" TEXT, "actorId" TEXT, "action" TEXT NOT NULL,
  "data" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "TeacherAssistantAudit_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeacherAssistantAudit_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "TeacherAssistantAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TeacherAssistantAudit_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "TeacherAssistantScript"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "TeacherAssistantAudit_assessmentId_scriptId_createdAt_idx" ON "TeacherAssistantAudit"("assessmentId","scriptId","createdAt");
