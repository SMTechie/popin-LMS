import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { RbacModule } from "./rbac/rbac.module";
import { BoardsModule } from "./boards/boards.module";
import { WorkflowModule } from "./workflow/workflow.module";
import { EmailModule } from "./email/email.module";
import { PaymentsModule } from "./payments/payments.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SettingsModule } from "./settings/settings.module";
import { HealthModule } from "./health/health.module";
import { AuditModule } from "./audit/audit.module";
import { QueueModule } from "./queue/queue.module";
import { TenantsModule } from "./tenants/tenants.module";
import { IntegrationsModule } from "./integrations/integrations.module";
import { ShopModule } from "./shop/shop.module";
import { PublicFormsModule } from "./public-forms/public-forms.module";
import { ApplicationsModule } from "./applications/applications.module";
import { WebhooksModule } from "./webhooks/webhooks.module";
import { InventoryModule } from "./inventory/inventory.module";
import { RequisitionsModule } from "./requisitions/requisitions.module";
import { TeacherModule } from "./teacher/teacher.module";
import { StudentsModule } from "./students/students.module";
import { ParentModule } from "./parent/parent.module";
import { IdentityModule } from "./identity/identity.module";
import { TeacherAssistantModule } from "./teacher-assistant/teacher-assistant.module";
import { HostelModule } from "./hostel/hostel.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RbacModule,
    BoardsModule,
    WorkflowModule,
    EmailModule,
    PaymentsModule,
    AppointmentsModule,
    NotificationsModule,
    SettingsModule,
    HealthModule,
    AuditModule,
    QueueModule,
    TenantsModule,
    IntegrationsModule,
    ShopModule,
    InventoryModule,
    RequisitionsModule,
    PublicFormsModule,
    ApplicationsModule,
    WebhooksModule,
    TeacherModule,
    StudentsModule,
    ParentModule,
    IdentityModule,
    TeacherAssistantModule,
    HostelModule
  ]
})
export class AppModule {}
