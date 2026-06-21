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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const dto_1 = require("./dto");
const students_service_1 = require("./students.service");
let StudentsController = class StudentsController {
    students;
    constructor(students) {
        this.students = students;
    }
    list(search, status, gradeId, classId) { return this.students.list(search, status, gradeId, classId); }
    get(id) { return this.students.get(id); }
    create(dto, req) { return this.students.create(dto, req.user.id); }
    bulk(dto, req) { return this.students.bulkImport(dto, req.user.id); }
    teacher(dto, req) { return this.students.createTeacher(dto, req.user.id); }
    grade(dto, req) { return this.students.createGrade(dto, req.user.id); }
    schoolClass(dto, req) { return this.students.createClass(dto, req.user.id); }
    subject(dto, req) { return this.students.createSubject(dto, req.user.id); }
    assignSubject(id, dto, req) { return this.students.assignSubject(id, dto, req.user.id); }
    update(id, dto, req) { return this.students.update(id, dto, req.user.id); }
    archive(id, req) { return this.students.archive(id, req.user.id); }
    move(id, dto, req) { return this.students.move(id, dto, req.user.id); }
    link(id, dto, req) { return this.students.linkGuardian(id, dto, req.user.id); }
    permissions(id, dto, req) { return this.students.updateGuardian(id, dto, req.user.id); }
    unlink(id, req) { return this.students.unlinkGuardian(id, req.user.id); }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.view" }),
    __param(0, (0, common_1.Query)("search")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("gradeId")),
    __param(3, (0, common_1.Query)("classId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.view" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("import"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.import" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.BulkImportStudentsDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "bulk", null);
__decorate([
    (0, common_1.Post)("teachers"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "teacher.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTeacherDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "teacher", null);
__decorate([
    (0, common_1.Post)("grades"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGradeDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "grade", null);
__decorate([
    (0, common_1.Post)("classes"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateClassDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "schoolClass", null);
__decorate([
    (0, common_1.Post)("subjects"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateSubjectDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "subject", null);
__decorate([
    (0, common_1.Post)("classes/:id/subjects"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AssignSubjectDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "assignSubject", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateStudentDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/archive"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(":id/move"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "student.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.MoveStudentDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "move", null);
__decorate([
    (0, common_1.Post)(":id/guardians"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "guardian.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.LinkGuardianDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "link", null);
__decorate([
    (0, common_1.Patch)("guardian-links/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "guardian.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateGuardianLinkDto, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "permissions", null);
__decorate([
    (0, common_1.Delete)("guardian-links/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "students", action: "guardian.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "unlink", null);
exports.StudentsController = StudentsController = __decorate([
    (0, common_1.Controller)("students"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map