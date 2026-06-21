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
exports.ScriptSelectionDto = exports.OverrideResultsDto = exports.OverrideResultItemDto = exports.UpdateExtractedTextDto = exports.BatchUploadDto = exports.ScriptUploadDto = exports.CreateAssistantAssessmentDto = exports.MemoQuestionDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class MemoQuestionDto {
    questionNumber;
    questionType;
    expectedAnswers;
    alternativeAnswers;
    marks;
    tolerance;
    decimalPrecision;
    requiredUnit;
    caseSensitive;
    ignoreWhitespace;
    partialMarkRules;
}
exports.MemoQuestionDto = MemoQuestionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemoQuestionDto.prototype, "questionNumber", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["NUMERICAL", "CALCULATION", "MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "MATCHING", "EXACT"]),
    __metadata("design:type", String)
], MemoQuestionDto.prototype, "questionType", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Object)
], MemoQuestionDto.prototype, "expectedAnswers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Object)
], MemoQuestionDto.prototype, "alternativeAnswers", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MemoQuestionDto.prototype, "marks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MemoQuestionDto.prototype, "tolerance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], MemoQuestionDto.prototype, "decimalPrecision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MemoQuestionDto.prototype, "requiredUnit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MemoQuestionDto.prototype, "caseSensitive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MemoQuestionDto.prototype, "ignoreWhitespace", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Allow)(),
    __metadata("design:type", Object)
], MemoQuestionDto.prototype, "partialMarkRules", void 0);
class CreateAssistantAssessmentDto {
    subject;
    gradeId;
    classIds;
    name;
    assessmentType;
    totalMarks;
    dueAt;
    uploads;
    settings;
    questions;
}
exports.CreateAssistantAssessmentDto = CreateAssistantAssessmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssistantAssessmentDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssistantAssessmentDto.prototype, "gradeId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateAssistantAssessmentDto.prototype, "classIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssistantAssessmentDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssistantAssessmentDto.prototype, "assessmentType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.5),
    __metadata("design:type", Number)
], CreateAssistantAssessmentDto.prototype, "totalMarks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssistantAssessmentDto.prototype, "dueAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateAssistantAssessmentDto.prototype, "uploads", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateAssistantAssessmentDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MemoQuestionDto),
    __metadata("design:type", Array)
], CreateAssistantAssessmentDto.prototype, "questions", void 0);
class ScriptUploadDto {
    learnerId;
    detectedStudentNumber;
    detectedStudentName;
    originalFiles;
    extractedText;
}
exports.ScriptUploadDto = ScriptUploadDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScriptUploadDto.prototype, "learnerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScriptUploadDto.prototype, "detectedStudentNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScriptUploadDto.prototype, "detectedStudentName", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ScriptUploadDto.prototype, "originalFiles", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScriptUploadDto.prototype, "extractedText", void 0);
class BatchUploadDto {
    scripts;
}
exports.BatchUploadDto = BatchUploadDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScriptUploadDto),
    __metadata("design:type", Array)
], BatchUploadDto.prototype, "scripts", void 0);
class UpdateExtractedTextDto {
    editableText;
    learnerId;
    ocrConfidence;
}
exports.UpdateExtractedTextDto = UpdateExtractedTextDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExtractedTextDto.prototype, "editableText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateExtractedTextDto.prototype, "learnerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], UpdateExtractedTextDto.prototype, "ocrConfidence", void 0);
class OverrideResultItemDto {
    resultId;
    finalMarks;
    note;
}
exports.OverrideResultItemDto = OverrideResultItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OverrideResultItemDto.prototype, "resultId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OverrideResultItemDto.prototype, "finalMarks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OverrideResultItemDto.prototype, "note", void 0);
class OverrideResultsDto {
    results;
}
exports.OverrideResultsDto = OverrideResultsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OverrideResultItemDto),
    __metadata("design:type", Array)
], OverrideResultsDto.prototype, "results", void 0);
class ScriptSelectionDto {
    scriptIds;
}
exports.ScriptSelectionDto = ScriptSelectionDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ScriptSelectionDto.prototype, "scriptIds", void 0);
//# sourceMappingURL=dto.js.map