"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsModule = void 0;
const common_1 = require("@nestjs/common");
const applications_controller_1 = require("./applications.controller");
const applications_service_1 = require("./applications.service");
const prisma_service_1 = require("../common/prisma.service");
const tenants_module_1 = require("../tenants/tenants.module");
const email_module_1 = require("../email/email.module");
const audit_module_1 = require("../audit/audit.module");
const workflow_module_1 = require("../workflow/workflow.module");
const public_forms_module_1 = require("../public-forms/public-forms.module");
const students_module_1 = require("../students/students.module");
let ApplicationsModule = class ApplicationsModule {
};
exports.ApplicationsModule = ApplicationsModule;
exports.ApplicationsModule = ApplicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [tenants_module_1.TenantsModule, email_module_1.EmailModule, audit_module_1.AuditModule, workflow_module_1.WorkflowModule, public_forms_module_1.PublicFormsModule, students_module_1.StudentsModule],
        controllers: [applications_controller_1.ApplicationsController],
        providers: [applications_service_1.ApplicationsService, prisma_service_1.PrismaService],
        exports: [applications_service_1.ApplicationsService]
    })
], ApplicationsModule);
//# sourceMappingURL=applications.module.js.map