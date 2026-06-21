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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const allow_anon_decorator_1 = require("../common/decorators/allow-anon.decorator");
const applications_service_1 = require("./applications.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const permission_guard_1 = require("../common/guards/permission.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
const tenants_service_1 = require("../tenants/tenants.service");
const prisma_service_1 = require("../common/prisma.service");
let ApplicationsController = class ApplicationsController {
    applications;
    tenants;
    prisma;
    constructor(applications, tenants, prisma) {
        this.applications = applications;
        this.tenants = tenants;
        this.prisma = prisma;
    }
    submit(dto) {
        return this.applications.createPublicApplication(dto);
    }
    getPublicForm(token) {
        return this.applications.getPublicApplicationForm(token);
    }
    submitPublicForm(dto) {
        return this.applications.submitApplication(dto);
    }
    async listForms() {
        const tenant = await this.tenants.getDefaultTenant();
        return this.prisma.applicationForm.findMany({
            where: { tenantId: tenant.id },
            include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } }
        });
    }
    approve(id, dto, req) {
        return this.applications.approveApplication(id, dto, req.user.id);
    }
    async createForm(dto) {
        const tenant = await this.tenants.getDefaultTenant();
        return this.prisma.applicationForm.create({
            data: {
                tenantId: tenant.id,
                name: dto.name,
                slug: dto.slug
            }
        });
    }
    async getForm(id) {
        return this.prisma.applicationForm.findUnique({
            where: { id },
            include: { versions: { orderBy: { versionNumber: "desc" } } }
        });
    }
    async saveFormVersion(id, dto, req) {
        const latest = await this.prisma.applicationFormVersion.findFirst({
            where: { formId: id },
            orderBy: { versionNumber: "desc" }
        });
        const nextVersion = (latest?.versionNumber || 0) + 1;
        return this.prisma.applicationFormVersion.create({
            data: {
                tenantId: (await this.tenants.getDefaultTenant()).id,
                formId: id,
                versionNumber: nextVersion,
                schemaJson: dto.schema,
                createdById: req.user.id
            }
        });
    }
    async publishForm(id, dto) {
        await this.prisma.applicationFormVersion.updateMany({
            where: { formId: id },
            data: { isPublished: false }
        });
        const version = await this.prisma.applicationFormVersion.update({
            where: { id: dto.versionId },
            data: { isPublished: true, publishedAt: new Date() }
        });
        await this.prisma.applicationForm.update({
            where: { id },
            data: { status: "published", currentVersionId: version.id }
        });
        return version;
    }
    async updateAdmissionsStatus(id, dto) {
        return this.prisma.applicationForm.update({
            where: { id },
            data: {
                admissionsOpenState: dto.admissionsOpenState,
                opensAt: dto.opensAt ? new Date(dto.opensAt) : null,
                closesAt: dto.closesAt ? new Date(dto.closesAt) : null,
                closedMessage: dto.closedMessage || null,
                openingMessage: dto.openingMessage || null
            }
        });
    }
    async listSubmissions(id) {
        return this.prisma.applicationSubmission.findMany({
            where: { formId: id },
            orderBy: { submittedAt: "desc" }
        });
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Post)("public"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PublicApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "submit", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Get)("new"),
    __param(0, (0, common_1.Query)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "getPublicForm", null);
__decorate([
    (0, allow_anon_decorator_1.AllowAnon)(),
    (0, common_1.Post)("new"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SubmitApplicationDto]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "submitPublicForm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Get)("forms"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.form.manage" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "listForms", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Post)(":id/approve"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "admissions.ticket.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.ApproveApplicationDto, Object]),
    __metadata("design:returntype", void 0)
], ApplicationsController.prototype, "approve", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Post)("forms"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.form.manage" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateApplicationFormDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "createForm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Get)("forms/:id"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.form.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "getForm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Post)("forms/:id/versions"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.form.manage" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SaveFormVersionDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "saveFormVersion", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Post)("forms/:id/publish"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.form.publish" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.PublishFormVersionDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "publishForm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Patch)("forms/:id/status"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.open.close" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAdmissionsStatusDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "updateAdmissionsStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permission_guard_1.PermissionGuard),
    (0, common_1.Get)("forms/:id/submissions"),
    (0, permissions_decorator_1.Permissions)({ module: "admissions", action: "applications.submissions.view" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "listSubmissions", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, common_1.Controller)("applications"),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService,
        tenants_service_1.TenantsService,
        prisma_service_1.PrismaService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map