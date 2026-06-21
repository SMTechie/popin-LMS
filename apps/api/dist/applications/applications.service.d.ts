import { PrismaService } from "../common/prisma.service";
import { TenantsService } from "../tenants/tenants.service";
import { EmailOutboxService } from "../email/outbox.service";
import { AuditService } from "../audit/audit.service";
import { WorkflowService } from "../workflow/workflow.service";
import { PublicFormsService } from "../public-forms/public-forms.service";
import { StudentsService } from "../students/students.service";
export declare class ApplicationsService {
    private prisma;
    private tenants;
    private emailOutbox;
    private audit;
    private workflow;
    private forms;
    private students;
    constructor(prisma: PrismaService, tenants: TenantsService, emailOutbox: EmailOutboxService, audit: AuditService, workflow: WorkflowService, forms: PublicFormsService, students: StudentsService);
    createPublicApplication(input: {
        parentName: string;
        parentEmail: string;
        parentPhone?: string;
        studentName: string;
        grade: string;
        token?: string;
    }): Promise<{
        reference: string;
    }>;
    getPublicApplicationForm(token?: string): Promise<{
        admissionsOpen: boolean;
        admissionsOpenState: string;
        opensAt: Date | null;
        closesAt: Date | null;
        closedMessage: string | null;
        openingMessage: string | null;
        form: {
            tenantId: string;
            id: string;
            createdAt: Date;
            createdById: string | null;
            publishedAt: Date | null;
            formId: string;
            isPublished: boolean;
            versionNumber: number;
            schemaJson: import("@prisma/client/runtime/library").JsonValue;
        };
    }>;
    submitApplication(input: {
        applicantName: string;
        guardianName: string;
        guardianEmail: string;
        guardianPhone?: string;
        submissionChannel?: string;
        payload?: Record<string, any>;
        files?: Array<{
            fieldKey: string;
            originalFilename: string;
            mimeType: string;
            contentBase64: string;
        }>;
        token?: string;
    }): Promise<{
        submissionReference: string;
    }>;
    approveApplication(applicationId: string, dto: {
        gradeId?: string;
        classId?: string;
        relationshipType?: string;
    }, actorId: string): Promise<{
        application: {
            status: string;
            tenantId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            source: string;
            reference: string;
            sequence: number;
            parentName: string;
            parentEmail: string;
            parentPhone: string | null;
            studentName: string;
            grade: string;
        };
        learner: {
            tenantId: string;
            id: string;
            createdAt: Date;
            status: string;
            address: import("@prisma/client/runtime/library").JsonValue | null;
            updatedAt: Date;
            classId: string | null;
            gradeId: string | null;
            studentNumber: string;
            firstName: string;
            lastName: string;
            preferredName: string | null;
            dateOfBirth: Date | null;
            identityNumber: string | null;
            gender: string | null;
            email: string | null;
            phone: string | null;
            medicalNotes: string | null;
            admissionApplicationId: string | null;
            parentIds: import("@prisma/client/runtime/library").JsonValue | null;
            archivedAt: Date | null;
        };
    }>;
    private createAdmissionCard;
    private createTicket;
    private createTicketRecord;
    private systemUserId;
}
