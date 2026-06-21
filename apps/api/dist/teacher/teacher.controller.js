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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
const teacher_service_1 = require("./teacher.service");
let TeacherController = class TeacherController {
    teacher;
    constructor(teacher) {
        this.teacher = teacher;
    }
    dashboard(req) { return this.teacher.dashboard(req.user.id); }
    classes(req) { return this.teacher.classes(req.user.id); }
    createWorkItem(req, dto) { return this.teacher.createWorkItem(req.user.id, dto); }
    updateWorkItem(req, id, dto) { return this.teacher.updateWorkItem(req.user.id, id, dto); }
    attendance(req, dto) { return this.teacher.submitAttendance(req.user.id, dto); }
    queries(req) { return this.teacher.parentQueries(req.user.id); }
    reply(req, id, dto) { return this.teacher.replyToQuery(req.user.id, id, dto); }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.view" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)("classes"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.view" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "classes", null);
__decorate([
    (0, common_1.Post)("work-items"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.manage" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateTeacherWorkItemDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "createWorkItem", null);
__decorate([
    (0, common_1.Patch)("work-items/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.manage" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateTeacherWorkItemDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "updateWorkItem", null);
__decorate([
    (0, common_1.Post)("attendance"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.attendance" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.SubmitAttendanceDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "attendance", null);
__decorate([
    (0, common_1.Get)("parent-queries"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.communicate" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "queries", null);
__decorate([
    (0, common_1.Patch)("parent-queries/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "teacher_portal", action: "teacher.communicate" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.ReplyParentQueryDto]),
    __metadata("design:returntype", void 0)
], TeacherController.prototype, "reply", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)("teacher"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map