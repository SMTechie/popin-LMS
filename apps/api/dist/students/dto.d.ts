export declare class CreateStudentDto {
    firstName: string;
    lastName: string;
    preferredName?: string;
    dateOfBirth?: string;
    identityNumber?: string;
    gender?: string;
    email?: string;
    phone?: string;
    address?: Record<string, unknown>;
    medicalNotes?: string;
    studentNumber?: string;
    gradeId?: string;
    classId?: string;
    admissionApplicationId?: string;
}
export declare class UpdateStudentDto extends CreateStudentDto {
}
export declare class BulkImportStudentsDto {
    students: CreateStudentDto[];
}
export declare class MoveStudentDto {
    classId?: string;
    gradeId?: string;
    reason: string;
}
export declare class GuardianPermissionsDto {
    viewFees?: boolean;
    payFees?: boolean;
    viewReports?: boolean;
    viewHomework?: boolean;
    receiveAnnouncements?: boolean;
    messageTeachers?: boolean;
    authorisePickup?: boolean;
    submitApplications?: boolean;
    bookAppointments?: boolean;
    viewHostel?: boolean;
    applyHostel?: boolean;
    viewHostelBilling?: boolean;
    submitHostelConcerns?: boolean;
    viewHostelMovement?: boolean;
}
export declare class LinkGuardianDto extends GuardianPermissionsDto {
    email: string;
    name?: string;
    relationshipType: string;
    isPrimary?: boolean;
}
export declare class UpdateGuardianLinkDto extends GuardianPermissionsDto {
    isPrimary?: boolean;
    status?: string;
}
export declare class CreateTeacherDto {
    email: string;
    name: string;
    temporaryPassword?: string;
    assignments?: Array<{
        classId: string;
        subject: string;
        isPrimary?: boolean;
    }>;
}
export declare class CreateGradeDto {
    name: string;
    code: string;
    sortOrder?: number;
}
export declare class CreateClassDto {
    name: string;
    code: string;
    gradeId: string;
    academicYear?: number;
    room?: string;
}
export declare class CreateSubjectDto {
    name: string;
    code: string;
}
export declare class AssignSubjectDto {
    subjectId: string;
}
