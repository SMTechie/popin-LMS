import { ApplicationsService } from "./applications.service";
import { CreateApplicationFormDto, PublishFormVersionDto, PublicApplicationDto, SaveFormVersionDto, SubmitApplicationDto, UpdateAdmissionsStatusDto, ApproveApplicationDto } from "./dto";
import { TenantsService } from "../tenants/tenants.service";
import { PrismaService } from "../common/prisma.service";
export declare class ApplicationsController {
    private applications;
    private tenants;
    private prisma;
    constructor(applications: ApplicationsService, tenants: TenantsService, prisma: PrismaService);
    submit(dto: PublicApplicationDto): Promise<{
        reference: string;
    }>;
    getPublicForm(token?: string): Promise<{
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
    submitPublicForm(dto: SubmitApplicationDto): Promise<{
        submissionReference: string;
    }>;
    listForms(): Promise<({
        versions: {
            tenantId: string;
            id: string;
            createdAt: Date;
            createdById: string | null;
            publishedAt: Date | null;
            formId: string;
            isPublished: boolean;
            versionNumber: number;
            schemaJson: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        slug: string;
        currentVersionId: string | null;
        admissionsOpenState: string;
        opensAt: Date | null;
        closesAt: Date | null;
        closedMessage: string | null;
        openingMessage: string | null;
    })[]>;
    approve(id: string, dto: ApproveApplicationDto, req: any): Promise<{
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
    createForm(dto: CreateApplicationFormDto): Promise<{
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        slug: string;
        currentVersionId: string | null;
        admissionsOpenState: string;
        opensAt: Date | null;
        closesAt: Date | null;
        closedMessage: string | null;
        openingMessage: string | null;
    }>;
    getForm(id: string): Promise<({
        versions: {
            tenantId: string;
            id: string;
            createdAt: Date;
            createdById: string | null;
            publishedAt: Date | null;
            formId: string;
            isPublished: boolean;
            versionNumber: number;
            schemaJson: import("@prisma/client/runtime/library").JsonValue;
        }[];
    } & {
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        slug: string;
        currentVersionId: string | null;
        admissionsOpenState: string;
        opensAt: Date | null;
        closesAt: Date | null;
        closedMessage: string | null;
        openingMessage: string | null;
    }) | null>;
    saveFormVersion(id: string, dto: SaveFormVersionDto, req: any): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        createdById: string | null;
        publishedAt: Date | null;
        formId: string;
        isPublished: boolean;
        versionNumber: number;
        schemaJson: import("@prisma/client/runtime/library").JsonValue;
    }>;
    publishForm(id: string, dto: PublishFormVersionDto): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        createdById: string | null;
        publishedAt: Date | null;
        formId: string;
        isPublished: boolean;
        versionNumber: number;
        schemaJson: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateAdmissionsStatus(id: string, dto: UpdateAdmissionsStatusDto): Promise<{
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        slug: string;
        currentVersionId: string | null;
        admissionsOpenState: string;
        opensAt: Date | null;
        closesAt: Date | null;
        closedMessage: string | null;
        openingMessage: string | null;
    }>;
    listSubmissions(id: string): Promise<{
        tenantId: string;
        id: string;
        createdAt: Date;
        status: string;
        updatedAt: Date;
        submittedAt: Date;
        submissionReference: string;
        submissionChannel: string;
        applicantName: string | null;
        guardianName: string | null;
        guardianEmail: string | null;
        guardianPhone: string | null;
        payloadJson: import("@prisma/client/runtime/library").JsonValue;
        formId: string;
        formVersionId: string;
    }[]>;
}
