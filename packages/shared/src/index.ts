export type ModuleKey =
  | "board"
  | "requisition"
  | "scm"
  | "inventory"
  | "uniform_store"
  | "parent_portal"
  | "teacher_portal"
  | "ticket"
  | "admissions"
  | "analytics"
  | "branding"
  | "email"
  | "payments"
  | "licensing"
  | "automation"
  | "integrations"
  | "applications"
  | "students"
  | "hostel";

export type PermissionAction =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "move"
  | "assign"
  | "comment"
  | "attach"
  | "export"
  | "configure"
  | "inventory.item.create"
  | "inventory.item.update"
  | "inventory.item.archive"
  | "inventory.stock.receive"
  | "inventory.stock.adjust"
  | "inventory.stock.transfer"
  | "inventory.stock.issue"
  | "inventory.request.create"
  | "inventory.request.approve"
  | "inventory.request.fulfill"
  | "inventory.count.manage"
  | "inventory.settings.manage"
  | "inventory.reports.view"
  | "inventory.valuation.view"
  | "inventory.location.manage"
  | "inventory.import"
  | "inventory.export"
  | "inventory.audit.view"
  | "requisition.view"
  | "requisition.create"
  | "requisition.edit"
  | "requisition.approve"
  | "requisition.purchase"
  | "requisition.deliver";

export type ExtendedPermissionAction =
  | PermissionAction
  | "approve"
  | "purchase"
  | "deliver"
  | "integrations.manage"
  | "integrations.credentials.generate"
  | "integrations.credentials.rotate"
  | "integrations.logs.view"
  | "store.view"
  | "store.manage"
  | "store.publish"
  | "applications.form.manage"
  | "applications.form.publish"
  | "applications.open.close"
  | "applications.submissions.view"
  | "admissions.ticket.manage"
  | "teacher.view"
  | "teacher.manage"
  | "teacher.attendance"
  | "teacher.communicate"
  | "teacher.assistant"
  | "student.view"
  | "student.manage"
  | "student.import"
  | "guardian.manage"
  | "hostel.view"
  | "hostel.setup.manage"
  | "hostel.applications.manage"
  | "hostel.allocations.manage"
  | "hostel.attendance.manage"
  | "hostel.meals.manage"
  | "hostel.incidents.manage"
  | "hostel.maintenance.manage"
  | "hostel.visitors.manage"
  | "hostel.billing.manage"
  | "hostel.communicate"
  | "hostel.reports.view";

export type PermissionScope = {
  module: ModuleKey;
  boardId?: string;
  stageId?: string;
  action: ExtendedPermissionAction;
};

export const moduleLabels: Record<ModuleKey, string> = {
  board: "Board Engine",
  requisition: "Teacher Requisition Management",
  scm: "Supply Chain Management",
  inventory: "Inventory Management",
  uniform_store: "Uniform Store",
  parent_portal: "Parent Portal",
  teacher_portal: "Teacher Portal",
  hostel: "Hostel Management",
  ticket: "Ticket Management",
  admissions: "Admissions Applications",
  analytics: "Analytics Dashboard",
  branding: "Branding & Communications",
  email: "Email Routing & Comms",
  payments: "Payment Processing",
  licensing: "Licensing & Access",
  automation: "Workflow Automation",
  integrations: "Integrations",
  applications: "Applications",
  students: "Student Management"
};
