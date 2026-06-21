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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherAssistantService = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = __importDefault(require("node-fetch"));
const prisma_service_1 = require("../common/prisma.service");
const tenants_service_1 = require("../tenants/tenants.service");
const registry_1 = require("./plugins/registry");
let TeacherAssistantService = class TeacherAssistantService {
    prisma;
    tenants;
    registry = new registry_1.SubjectPluginRegistry();
    processing = false;
    constructor(prisma, tenants) {
        this.prisma = prisma;
        this.tenants = tenants;
    }
    onModuleInit() { setTimeout(() => void this.processQueuedJobs(), 1500); }
    async context(teacherId) {
        const tenant = await this.tenants.getDefaultTenant();
        const assignments = await this.prisma.teacherClassAssignment.findMany({ where: { tenantId: tenant.id, teacherId } });
        return { tenant, assignments, classIds: [...new Set(assignments.map((item) => item.classId))] };
    }
    async owned(teacherId, assessmentId) {
        const assessment = await this.prisma.teacherAssistantAssessment.findFirst({ where: { id: assessmentId, teacherId }, include: { questions: { orderBy: { sortOrder: "asc" } }, scripts: { include: { results: { orderBy: { questionNumber: "asc" } } }, orderBy: { createdAt: "desc" } }, auditEvents: { orderBy: { createdAt: "desc" }, take: 100 } } });
        if (!assessment)
            throw new common_1.NotFoundException("Assessment not found or not assigned to this teacher");
        return assessment;
    }
    async dashboard(teacherId) {
        const { tenant } = await this.context(teacherId);
        const assessments = await this.prisma.teacherAssistantAssessment.findMany({ where: { tenantId: tenant.id, teacherId }, include: { scripts: { select: { status: true, processingStartedAt: true, processingCompletedAt: true } } }, orderBy: { updatedAt: "desc" } });
        const scripts = assessments.flatMap((item) => item.scripts);
        const reviewed = scripts.filter((item) => item.processingCompletedAt && item.status !== "QUEUED");
        const averageSeconds = reviewed.length ? reviewed.reduce((sum, item) => sum + ((item.processingCompletedAt.getTime() - (item.processingStartedAt?.getTime() || item.processingCompletedAt.getTime())) / 1000), 0) / reviewed.length : 0;
        return {
            assessments: assessments.map(({ scripts: items, ...assessment }) => ({ ...assessment, counts: this.counts(items) })),
            metrics: { scriptsWaiting: scripts.filter((item) => ["QUEUED", "OCR", "MARKING"].includes(item.status)).length, readyForReview: scripts.filter((item) => item.status === "READY_FOR_REVIEW").length, needsAttention: scripts.filter((item) => item.status === "NEEDS_REVIEW").length, averageReviewSeconds: Math.round(averageSeconds) },
            plugins: this.registry.describe()
        };
    }
    async get(teacherId, id) { return this.owned(teacherId, id); }
    async create(teacherId, dto) {
        const { tenant, classIds, assignments } = await this.context(teacherId);
        if (!dto.classIds.length || dto.classIds.some((id) => !classIds.includes(id)))
            throw new common_1.ForbiddenException("Every selected class must be assigned to this teacher");
        if (!assignments.some((item) => dto.classIds.includes(item.classId) && item.subject.toLowerCase() === dto.subject.toLowerCase()))
            throw new common_1.ForbiddenException("Subject is not assigned to you for the selected classes");
        if (!dto.questions.length)
            throw new common_1.BadRequestException("At least one memorandum question is required");
        const memoTotal = dto.questions.reduce((sum, item) => sum + item.marks, 0);
        if (Math.abs(memoTotal - dto.totalMarks) > .001)
            throw new common_1.BadRequestException(`Memorandum marks (${memoTotal}) must equal total marks (${dto.totalMarks})`);
        const plugin = this.registry.resolve(dto.subject, dto.questions[0].questionType);
        if (!plugin)
            throw new common_1.BadRequestException("No deterministic marking plug-in supports this subject/question type");
        const assessment = await this.prisma.teacherAssistantAssessment.create({ data: {
                tenantId: tenant.id, teacherId, subject: dto.subject, pluginKey: plugin.key, gradeId: dto.gradeId || null,
                classIds: dto.classIds, name: dto.name, assessmentType: dto.assessmentType, totalMarks: dto.totalMarks,
                dueAt: dto.dueAt ? new Date(dto.dueAt) : null, uploads: dto.uploads,
                settings: dto.settings,
                questions: { create: dto.questions.map((question, index) => ({ questionNumber: question.questionNumber, questionType: question.questionType, expectedAnswers: question.expectedAnswers, alternativeAnswers: question.alternativeAnswers, marks: question.marks, tolerance: question.tolerance, decimalPrecision: question.decimalPrecision, requiredUnit: question.requiredUnit, caseSensitive: question.caseSensitive ?? false, ignoreWhitespace: question.ignoreWhitespace ?? true, partialMarkRules: question.partialMarkRules, sortOrder: index })) }
            }, include: { questions: true } });
        await this.log(tenant.id, assessment.id, null, teacherId, "assessment.created", { totalMarks: dto.totalMarks, questions: dto.questions.length, plugin: plugin.key });
        return assessment;
    }
    async uploadBatch(teacherId, assessmentId, dto) {
        const assessment = await this.owned(teacherId, assessmentId);
        if (!dto.scripts.length || dto.scripts.length > 100)
            throw new common_1.BadRequestException("Upload between 1 and 100 scripts per batch");
        const created = await this.prisma.$transaction(async (tx) => {
            const scripts = [];
            for (const input of dto.scripts) {
                if (input.learnerId) {
                    const learner = await tx.learnerProfile.findFirst({ where: { id: input.learnerId, classId: { in: assessment.classIds } } });
                    if (!learner)
                        throw new common_1.ForbiddenException("Selected learner is outside this assessment's classes");
                }
                const script = await tx.teacherAssistantScript.create({ data: { assessmentId, learnerId: input.learnerId || null, detectedStudentNumber: input.detectedStudentNumber || null, detectedStudentName: input.detectedStudentName || null, originalFiles: input.originalFiles, extractedText: input.extractedText || null, status: "QUEUED" } });
                await tx.teacherAssistantJob.create({ data: { tenantId: assessment.tenantId, assessmentId, scriptId: script.id, type: "OCR", status: "QUEUED" } });
                scripts.push(script);
            }
            await tx.teacherAssistantAssessment.update({ where: { id: assessmentId }, data: { status: "PROCESSING" } });
            return scripts;
        });
        await this.log(assessment.tenantId, assessmentId, null, teacherId, "batch.uploaded", { scripts: created.length });
        setTimeout(() => void this.processQueuedJobs(), 10);
        return { queued: created.length, scripts: created };
    }
    async updateExtractedText(teacherId, scriptId, dto) {
        const script = await this.prisma.teacherAssistantScript.findUnique({ where: { id: scriptId }, include: { assessment: true } });
        if (!script || script.assessment.teacherId !== teacherId)
            throw new common_1.NotFoundException("Script not found");
        const updated = await this.prisma.$transaction(async (tx) => {
            const value = await tx.teacherAssistantScript.update({ where: { id: scriptId }, data: { editableText: dto.editableText, extractedText: dto.editableText, learnerId: dto.learnerId || script.learnerId, ocrConfidence: dto.ocrConfidence ?? script.ocrConfidence ?? .9, status: "QUEUED", needsReview: false } });
            await tx.teacherAssistantQuestionResult.deleteMany({ where: { scriptId } });
            await tx.teacherAssistantJob.create({ data: { tenantId: script.assessment.tenantId, assessmentId: script.assessmentId, scriptId, type: "MARK", status: "QUEUED" } });
            return value;
        });
        await this.log(script.assessment.tenantId, script.assessmentId, scriptId, teacherId, "ocr.text.edited", { learnerId: dto.learnerId });
        setTimeout(() => void this.processQueuedJobs(), 10);
        return updated;
    }
    async override(teacherId, scriptId, dto) {
        const script = await this.prisma.teacherAssistantScript.findUnique({ where: { id: scriptId }, include: { assessment: true, results: true } });
        if (!script || script.assessment.teacherId !== teacherId)
            throw new common_1.NotFoundException("Script not found");
        for (const item of dto.results) {
            const existing = script.results.find((result) => result.id === item.resultId);
            if (!existing)
                throw new common_1.BadRequestException("Question result does not belong to this script");
            const question = await this.prisma.teacherAssistantQuestion.findUnique({ where: { id: existing.questionId } });
            if (!question || item.finalMarks > question.marks)
                throw new common_1.BadRequestException(`Override cannot exceed ${question?.marks ?? 0} marks`);
            await this.prisma.teacherAssistantQuestionResult.update({ where: { id: item.resultId }, data: { finalMarks: item.finalMarks, teacherNote: item.note || null, overridden: true } });
            await this.log(script.assessment.tenantId, script.assessmentId, scriptId, teacherId, "mark.overridden", { questionNumber: existing.questionNumber, engine: existing.suggestedMarks, teacher: item.finalMarks, note: item.note });
        }
        const results = await this.prisma.teacherAssistantQuestionResult.findMany({ where: { scriptId } });
        return this.prisma.teacherAssistantScript.update({ where: { id: scriptId }, data: { finalTotal: results.reduce((sum, item) => sum + item.finalMarks, 0), reviewedAt: new Date(), status: "READY_FOR_REVIEW" }, include: { results: { orderBy: { questionNumber: "asc" } } } });
    }
    async approve(teacherId, assessmentId, selection) {
        const assessment = await this.owned(teacherId, assessmentId);
        const scripts = assessment.scripts.filter((item) => selection.scriptIds.includes(item.id));
        if (!scripts.length || scripts.length !== selection.scriptIds.length)
            throw new common_1.BadRequestException("One or more scripts are outside this assessment");
        if (scripts.some((item) => !["READY_FOR_REVIEW", "NEEDS_REVIEW"].includes(item.status)))
            throw new common_1.BadRequestException("Only reviewed or exception scripts can be approved");
        await this.prisma.teacherAssistantScript.updateMany({ where: { id: { in: selection.scriptIds } }, data: { status: "APPROVED", approvedAt: new Date() } });
        await this.log(assessment.tenantId, assessmentId, null, teacherId, "scripts.approved", { scriptIds: selection.scriptIds });
        return { approved: selection.scriptIds.length };
    }
    async publish(teacherId, assessmentId, selection) {
        const assessment = await this.owned(teacherId, assessmentId);
        const scripts = assessment.scripts.filter((item) => selection.scriptIds.includes(item.id));
        if (!scripts.length || scripts.some((item) => item.status !== "APPROVED"))
            throw new common_1.BadRequestException("Teacher approval is mandatory before publishing");
        await this.prisma.teacherAssistantScript.updateMany({ where: { id: { in: selection.scriptIds }, status: "APPROVED" }, data: { status: "PUBLISHED", publishedAt: new Date() } });
        const remaining = await this.prisma.teacherAssistantScript.count({ where: { assessmentId, status: { not: "PUBLISHED" } } });
        if (!remaining)
            await this.prisma.teacherAssistantAssessment.update({ where: { id: assessmentId }, data: { status: "COMPLETE" } });
        await this.log(assessment.tenantId, assessmentId, null, teacherId, "results.published", { scriptIds: selection.scriptIds });
        return { published: selection.scriptIds.length };
    }
    async analytics(teacherId, assessmentId) {
        const assessment = await this.owned(teacherId, assessmentId);
        const scored = assessment.scripts.filter((script) => script.finalTotal !== null && script.finalTotal !== undefined);
        const scores = scored.map((script) => Number(script.finalTotal)).sort((a, b) => a - b);
        const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const middle = Math.floor(scores.length / 2);
        const median = !scores.length ? 0 : scores.length % 2 ? scores[middle] : (scores[middle - 1] + scores[middle]) / 2;
        const questionStats = assessment.questions.map((question) => {
            const results = scored.flatMap((script) => script.results).filter((result) => result.questionId === question.id);
            return { questionNumber: question.questionNumber, successPercent: results.length ? Math.round(results.reduce((sum, item) => sum + item.finalMarks / question.marks, 0) / results.length * 100) : 0, overrides: results.filter((item) => item.overridden).length };
        });
        return { scripts: scored.length, classAverage: average, highest: scores.at(-1) || 0, lowest: scores[0] || 0, median, passRate: scores.length ? Math.round(scores.filter((score) => score / assessment.totalMarks >= .5).length / scores.length * 100) : 0, teacherOverrides: scored.flatMap((item) => item.results).filter((result) => result.overridden).length, questionStats, mostFailedQuestions: [...questionStats].sort((a, b) => a.successPercent - b.successPercent).slice(0, 5) };
    }
    async processQueuedJobs() {
        if (this.processing)
            return;
        this.processing = true;
        try {
            for (let iteration = 0; iteration < 200; iteration++) {
                const candidate = await this.prisma.teacherAssistantJob.findFirst({ where: { OR: [{ status: "QUEUED" }, { status: "PROCESSING", lockedAt: { lt: new Date(Date.now() - 5 * 60 * 1000) } }] }, orderBy: { createdAt: "asc" } });
                if (!candidate)
                    break;
                const locked = await this.prisma.teacherAssistantJob.updateMany({ where: { id: candidate.id, status: candidate.status }, data: { status: "PROCESSING", lockedAt: new Date(), attempts: { increment: 1 } } });
                if (!locked.count)
                    continue;
                try {
                    if (candidate.type === "OCR")
                        await this.processOcr(candidate.scriptId);
                    else
                        await this.processMark(candidate.scriptId);
                    await this.prisma.teacherAssistantJob.update({ where: { id: candidate.id }, data: { status: "COMPLETE", completedAt: new Date(), error: null } });
                }
                catch (error) {
                    await this.prisma.teacherAssistantJob.update({ where: { id: candidate.id }, data: { status: candidate.attempts + 1 < 3 ? "QUEUED" : "FAILED", error: error instanceof Error ? error.message : String(error), lockedAt: null } });
                }
            }
        }
        finally {
            this.processing = false;
        }
    }
    async processOcr(scriptId) {
        const script = await this.prisma.teacherAssistantScript.findUnique({ where: { id: scriptId }, include: { assessment: true } });
        if (!script)
            return;
        await this.prisma.teacherAssistantScript.update({ where: { id: scriptId }, data: { status: "OCR", processingStartedAt: script.processingStartedAt || new Date() } });
        const extraction = await this.extract(script.originalFiles, script.extractedText);
        if (!extraction.text) {
            await this.prisma.teacherAssistantScript.update({ where: { id: scriptId }, data: { status: "NEEDS_REVIEW", ocrConfidence: extraction.confidence, needsReview: true, flags: ["OCR_TEXT_REQUIRED"] } });
            return;
        }
        const identity = await this.detectStudent(script.assessment.classIds, extraction.text, script.learnerId);
        const flags = [...identity.flags, ...(extraction.confidence < .7 ? ["LOW_OCR_CONFIDENCE"] : [])];
        await this.prisma.teacherAssistantScript.update({ where: { id: scriptId }, data: { extractedText: extraction.text, editableText: extraction.text, ocrConfidence: extraction.confidence, learnerId: identity.learnerId, detectedStudentNumber: identity.studentNumber, detectedStudentName: identity.name, flags, needsReview: flags.length > 0, status: "MARKING" } });
        await this.prisma.teacherAssistantJob.create({ data: { tenantId: script.assessment.tenantId, assessmentId: script.assessmentId, scriptId, type: "MARK", status: "QUEUED" } });
        await this.log(script.assessment.tenantId, script.assessmentId, scriptId, null, "ocr.completed", { confidence: extraction.confidence, flags });
    }
    async processMark(scriptId) {
        const script = await this.prisma.teacherAssistantScript.findUnique({ where: { id: scriptId }, include: { assessment: { include: { questions: { orderBy: { sortOrder: "asc" } } } } } });
        if (!script?.editableText)
            return;
        await this.prisma.teacherAssistantScript.update({ where: { id: scriptId }, data: { status: "MARKING" } });
        let total = 0;
        let confidenceTotal = 0;
        const detectedAnswers = {};
        const flags = Array.isArray(script.flags) ? [...script.flags] : [];
        for (const question of script.assessment.questions) {
            const detected = this.detectAnswer(script.editableText, question.questionNumber);
            detectedAnswers[question.questionNumber] = detected;
            const plugin = this.registry.resolve(script.assessment.subject, question.questionType);
            const decision = plugin ? plugin.mark(question, detected) : { awarded: 0, confidence: 0, rule: "No plug-in", explanation: "No marking plug-in supports this question." };
            const ocrConfidence = detected ? Number(script.ocrConfidence || .8) : .35;
            const markingConfidence = decision.confidence * ocrConfidence;
            if (markingConfidence < .7)
                flags.push(`LOW_CONFIDENCE_Q${question.questionNumber}`);
            await this.prisma.teacherAssistantQuestionResult.upsert({ where: { scriptId_questionId: { scriptId, questionId: question.id } }, update: { detectedAnswer: detected || null, expectedAnswer: question.expectedAnswers, matchingRule: `${decision.rule}. ${decision.explanation}`, suggestedMarks: decision.awarded, finalMarks: decision.awarded, ocrConfidence, markingConfidence }, create: { scriptId, questionId: question.id, questionNumber: question.questionNumber, detectedAnswer: detected || null, expectedAnswer: question.expectedAnswers, matchingRule: `${decision.rule}. ${decision.explanation}`, suggestedMarks: decision.awarded, finalMarks: decision.awarded, ocrConfidence, markingConfidence } });
            total += decision.awarded;
            confidenceTotal += markingConfidence;
        }
        const confidence = script.assessment.questions.length ? confidenceTotal / script.assessment.questions.length : 0;
        const needsReview = flags.length > 0 || !script.learnerId;
        await this.prisma.teacherAssistantScript.update({ where: { id: scriptId }, data: { detectedAnswers, suggestedTotal: total, finalTotal: total, markingConfidence: confidence, flags: [...new Set(flags)], needsReview, status: needsReview ? "NEEDS_REVIEW" : "READY_FOR_REVIEW", processingCompletedAt: new Date() } });
        await this.log(script.assessment.tenantId, script.assessmentId, scriptId, null, "marking.completed", { suggestedTotal: total, confidence, needsReview });
    }
    async extract(files, suppliedText) {
        if (suppliedText?.trim())
            return { text: suppliedText.trim(), confidence: .99 };
        const list = Array.isArray(files) ? files : [];
        const embedded = list.map((file) => file.text || file.extractedText || "").filter(Boolean).join("\n");
        if (embedded)
            return { text: embedded, confidence: .97 };
        if (process.env.OCR_SERVICE_URL && list.length) {
            const response = await (0, node_fetch_1.default)(process.env.OCR_SERVICE_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ files: list, operations: ["enhance", "deskew", "contrast", "denoise", "ocr"] }) });
            if (response.ok) {
                const data = await response.json();
                return { text: String(data.text || ""), confidence: Number(data.confidence || 0) };
            }
        }
        return { text: "", confidence: 0 };
    }
    async detectStudent(classIds, text, suppliedLearnerId) {
        if (suppliedLearnerId)
            return { learnerId: suppliedLearnerId, studentNumber: null, name: null, flags: [] };
        const number = text.match(/student\s*(?:number|no\.?|#)\s*[:\-]\s*([A-Za-z0-9-]+)/i)?.[1];
        const name = text.match(/(?:student\s*)?name\s*[:\-]\s*([^\n\r]+)/i)?.[1]?.trim();
        const learners = await this.prisma.learnerProfile.findMany({ where: { classId: { in: classIds }, status: "ACTIVE" } });
        if (number) {
            const matches = learners.filter((item) => item.studentNumber.toLowerCase() === number.toLowerCase());
            if (matches.length === 1)
                return { learnerId: matches[0].id, studentNumber: number, name: `${matches[0].firstName} ${matches[0].lastName}`, flags: [] };
            return { learnerId: null, studentNumber: number, name, flags: [matches.length ? "AMBIGUOUS_STUDENT" : "STUDENT_NOT_FOUND"] };
        }
        if (name) {
            const matches = learners.filter((item) => `${item.firstName} ${item.lastName}`.toLowerCase() === name.toLowerCase());
            if (matches.length === 1)
                return { learnerId: matches[0].id, studentNumber: matches[0].studentNumber, name, flags: [] };
            return { learnerId: null, studentNumber: null, name, flags: [matches.length ? "AMBIGUOUS_STUDENT" : "STUDENT_NOT_FOUND"] };
        }
        return { learnerId: null, studentNumber: null, name: null, flags: ["STUDENT_ID_REQUIRED"] };
    }
    detectAnswer(text, questionNumber) {
        const escaped = questionNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const match = text.match(new RegExp(`(?:question\\s*)?${escaped}\\s*[).:\\-]\\s*([^\\n\\r]+)`, "i"));
        return match?.[1]?.trim() || "";
    }
    counts(scripts) { return { total: scripts.length, queued: scripts.filter((item) => ["QUEUED", "OCR", "MARKING"].includes(item.status)).length, ready: scripts.filter((item) => item.status === "READY_FOR_REVIEW").length, needsReview: scripts.filter((item) => item.status === "NEEDS_REVIEW").length, approved: scripts.filter((item) => item.status === "APPROVED").length, published: scripts.filter((item) => item.status === "PUBLISHED").length }; }
    log(tenantId, assessmentId, scriptId, actorId, action, data) { return this.prisma.teacherAssistantAudit.create({ data: { tenantId, assessmentId, scriptId, actorId, action, data: data } }); }
};
exports.TeacherAssistantService = TeacherAssistantService;
exports.TeacherAssistantService = TeacherAssistantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, tenants_service_1.TenantsService])
], TeacherAssistantService);
//# sourceMappingURL=teacher-assistant.service.js.map