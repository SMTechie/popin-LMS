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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherAssistantController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
const teacher_assistant_service_1 = require("./teacher-assistant.service");
let TeacherAssistantController = class TeacherAssistantController {
    assistant;
    constructor(assistant) {
        this.assistant = assistant;
    }
    dashboard(req) { return this.assistant.dashboard(req.user.id); }
    create(req, dto) { return this.assistant.create(req.user.id, dto); }
    get(req, id) { return this.assistant.get(req.user.id, id); }
    analytics(req, id) { return this.assistant.analytics(req.user.id, id); }
    upload(req, id, dto) { return this.assistant.uploadBatch(req.user.id, id, dto); }
    text(req, id, dto) { return this.assistant.updateExtractedText(req.user.id, id, dto); }
    override(req, id, dto) { return this.assistant.override(req.user.id, id, dto); }
    approve(req, id, dto) { return this.assistant.approve(req.user.id, id, dto); }
    publish(req, id, dto) { return this.assistant.publish(req.user.id, id, dto); }
};
exports.TeacherAssistantController = TeacherAssistantController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Post)("assessments"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateAssistantAssessmentDto]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("assessments/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "get", null);
__decorate([
    (0, common_1.Get)("assessments/:id/analytics"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "analytics", null);
__decorate([
    (0, common_1.Post)("assessments/:id/scripts"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.BatchUploadDto]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "upload", null);
__decorate([
    (0, common_1.Patch)("scripts/:id/extracted-text"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateExtractedTextDto]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "text", null);
__decorate([
    (0, common_1.Patch)("scripts/:id/results"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.OverrideResultsDto]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "override", null);
__decorate([
    (0, common_1.Post)("assessments/:id/approve"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.ScriptSelectionDto]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)("assessments/:id/publish"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.ScriptSelectionDto]),
    __metadata("design:returntype", void 0)
], TeacherAssistantController.prototype, "publish", null);
exports.TeacherAssistantController = TeacherAssistantController = __decorate([
    (0, common_1.Controller)("teacher-assistant"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.assistant" }),
    __metadata("design:paramtypes", [teacher_assistant_service_1.TeacherAssistantService])
], TeacherAssistantController);
//# sourceMappingURL=teacher-assistant.controller.js.map