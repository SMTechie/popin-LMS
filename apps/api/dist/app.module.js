"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const rbac_module_1 = require("./rbac/rbac.module");
const boards_module_1 = require("./boards/boards.module");
const workflow_module_1 = require("./workflow/workflow.module");
const email_module_1 = require("./email/email.module");
const payments_module_1 = require("./payments/payments.module");
const appointments_module_1 = require("./appointments/appointments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const settings_module_1 = require("./settings/settings.module");
const health_module_1 = require("./health/health.module");
const audit_module_1 = require("./audit/audit.module");
const queue_module_1 = require("./queue/queue.module");
const tenants_module_1 = require("./tenants/tenants.module");
const integrations_module_1 = require("./integrations/integrations.module");
const shop_module_1 = require("./shop/shop.module");
const public_forms_module_1 = require("./public-forms/public-forms.module");
const applications_module_1 = require("./applications/applications.module");
const webhooks_module_1 = require("./webhooks/webhooks.module");
const inventory_module_1 = require("./inventory/inventory.module");
const requisitions_module_1 = require("./requisitions/requisitions.module");
const teacher_module_1 = require("./teacher/teacher.module");
const students_module_1 = require("./students/students.module");
const parent_module_1 = require("./parent/parent.module");
const identity_module_1 = require("./identity/identity.module");
const teacher_assistant_module_1 = require("./teacher-assistant/teacher-assistant.module");
const hostel_module_1 = require("./hostel/hostel.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            rbac_module_1.RbacModule,
            boards_module_1.BoardsModule,
            workflow_module_1.WorkflowModule,
            email_module_1.EmailModule,
            payments_module_1.PaymentsModule,
            appointments_module_1.AppointmentsModule,
            notifications_module_1.NotificationsModule,
            settings_module_1.SettingsModule,
            health_module_1.HealthModule,
            audit_module_1.AuditModule,
            queue_module_1.QueueModule,
            tenants_module_1.TenantsModule,
            integrations_module_1.IntegrationsModule,
            shop_module_1.ShopModule,
            inventory_module_1.InventoryModule,
            requisitions_module_1.RequisitionsModule,
            public_forms_module_1.PublicFormsModule,
            applications_module_1.ApplicationsModule,
            webhooks_module_1.WebhooksModule,
            teacher_module_1.TeacherModule,
            students_module_1.StudentsModule,
            parent_module_1.ParentModule,
            identity_module_1.IdentityModule,
            teacher_assistant_module_1.TeacherAssistantModule,
            hostel_module_1.HostelModule
        ]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map