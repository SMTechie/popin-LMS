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
exports.ApproveApplicationDto = exports.ApplicationFileDto = exports.SubmitApplicationDto = exports.UpdateAdmissionsStatusDto = exports.PublishFormVersionDto = exports.SaveFormVersionDto = exports.CreateApplicationFormDto = exports.FormSchemaDto = exports.FormStepDto = exports.FormFieldDto = exports.PublicApplicationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PublicApplicationDto {
    parentName;
    parentEmail;
    parentPhone;
    studentName;
    grade;
    token;
}
exports.PublicApplicationDto = PublicApplicationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicApplicationDto.prototype, "parentName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], PublicApplicationDto.prototype, "parentEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicApplicationDto.prototype, "parentPhone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicApplicationDto.prototype, "studentName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicApplicationDto.prototype, "grade", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PublicApplicationDto.prototype, "token", void 0);
class FormFieldDto {
    key;
    type;
    label;
    required;
    options;
}
exports.FormFieldDto = FormFieldDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FormFieldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], FormFieldDto.prototype, "required", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], FormFieldDto.prototype, "options", void 0);
class FormStepDto {
    title;
    fields;
}
exports.FormStepDto = FormStepDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FormStepDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FormFieldDto),
    __metadata("design:type", Array)
], FormStepDto.prototype, "fields", void 0);
class FormSchemaDto {
    title;
    description;
    steps;
}
exports.FormSchemaDto = FormSchemaDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], FormSchemaDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FormSchemaDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FormStepDto),
    __metadata("design:type", Array)
], FormSchemaDto.prototype, "steps", void 0);
class CreateApplicationFormDto {
    name;
    slug;
}
exports.CreateApplicationFormDto = CreateApplicationFormDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApplicationFormDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApplicationFormDto.prototype, "slug", void 0);
class SaveFormVersionDto {
    schema;
}
exports.SaveFormVersionDto = SaveFormVersionDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FormSchemaDto),
    __metadata("design:type", FormSchemaDto)
], SaveFormVersionDto.prototype, "schema", void 0);
class PublishFormVersionDto {
    versionId;
}
exports.PublishFormVersionDto = PublishFormVersionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PublishFormVersionDto.prototype, "versionId", void 0);
class UpdateAdmissionsStatusDto {
    admissionsOpenState;
    opensAt;
    closesAt;
    closedMessage;
    openingMessage;
}
exports.UpdateAdmissionsStatusDto = UpdateAdmissionsStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAdmissionsStatusDto.prototype, "admissionsOpenState", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdmissionsStatusDto.prototype, "opensAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdmissionsStatusDto.prototype, "closesAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdmissionsStatusDto.prototype, "closedMessage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAdmissionsStatusDto.prototype, "openingMessage", void 0);
class SubmitApplicationDto {
    token;
    applicantName;
    guardianName;
    guardianEmail;
    guardianPhone;
    submissionChannel;
    payload;
    files;
}
exports.SubmitApplicationDto = SubmitApplicationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitApplicationDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitApplicationDto.prototype, "applicantName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitApplicationDto.prototype, "guardianName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SubmitApplicationDto.prototype, "guardianEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitApplicationDto.prototype, "guardianPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitApplicationDto.prototype, "submissionChannel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SubmitApplicationDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ApplicationFileDto),
    __metadata("design:type", Array)
], SubmitApplicationDto.prototype, "files", void 0);
class ApplicationFileDto {
    fieldKey;
    originalFilename;
    mimeType;
    contentBase64;
}
exports.ApplicationFileDto = ApplicationFileDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplicationFileDto.prototype, "fieldKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplicationFileDto.prototype, "originalFilename", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplicationFileDto.prototype, "mimeType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApplicationFileDto.prototype, "contentBase64", void 0);
class ApproveApplicationDto {
    gradeId;
    classId;
    relationshipType;
}
exports.ApproveApplicationDto = ApproveApplicationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveApplicationDto.prototype, "gradeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveApplicationDto.prototype, "classId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveApplicationDto.prototype, "relationshipType", void 0);
//# sourceMappingURL=dto.js.map