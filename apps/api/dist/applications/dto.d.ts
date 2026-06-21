export declare class PublicApplicationDto {
    parentName: string;
    parentEmail: string;
    parentPhone?: string;
    studentName: string;
    grade: string;
    token?: string;
}
export declare class FormFieldDto {
    key: string;
    type: string;
    label?: string;
    required?: boolean;
    options?: string[];
}
export declare class FormStepDto {
    title: string;
    fields: FormFieldDto[];
}
export declare class FormSchemaDto {
    title: string;
    description?: string;
    steps: FormStepDto[];
}
export declare class CreateApplicationFormDto {
    name: string;
    slug: string;
}
export declare class SaveFormVersionDto {
    schema: FormSchemaDto;
}
export declare class PublishFormVersionDto {
    versionId: string;
}
export declare class UpdateAdmissionsStatusDto {
    admissionsOpenState: string;
    opensAt?: string;
    closesAt?: string;
    closedMessage?: string;
    openingMessage?: string;
}
export declare class SubmitApplicationDto {
    token?: string;
    applicantName: string;
    guardianName: string;
    guardianEmail: string;
    guardianPhone?: string;
    submissionChannel?: string;
    payload?: Record<string, any>;
    files?: ApplicationFileDto[];
}
export declare class ApplicationFileDto {
    fieldKey: string;
    originalFilename: string;
    mimeType: string;
    contentBase64: string;
}
export declare class ApproveApplicationDto {
    gradeId?: string;
    classId?: string;
    relationshipType?: string;
}
