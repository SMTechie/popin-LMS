import { IsArray, IsBoolean, IsDateString, IsEmail, IsIn, IsObject, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateStudentDto {
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsOptional() @IsString() preferredName?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() identityNumber?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsObject() address?: Record<string, unknown>;
  @IsOptional() @IsString() medicalNotes?: string;
  @IsOptional() @IsString() studentNumber?: string;
  @IsOptional() @IsString() gradeId?: string;
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @IsString() admissionApplicationId?: string;
}

export class UpdateStudentDto extends CreateStudentDto {}

export class BulkImportStudentsDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateStudentDto)
  students!: CreateStudentDto[];
}

export class MoveStudentDto {
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @IsString() gradeId?: string;
  @IsString() reason!: string;
}

export class GuardianPermissionsDto {
  @IsOptional() @IsBoolean() viewFees?: boolean;
  @IsOptional() @IsBoolean() payFees?: boolean;
  @IsOptional() @IsBoolean() viewReports?: boolean;
  @IsOptional() @IsBoolean() viewHomework?: boolean;
  @IsOptional() @IsBoolean() receiveAnnouncements?: boolean;
  @IsOptional() @IsBoolean() messageTeachers?: boolean;
  @IsOptional() @IsBoolean() authorisePickup?: boolean;
  @IsOptional() @IsBoolean() submitApplications?: boolean;
  @IsOptional() @IsBoolean() bookAppointments?: boolean;
  @IsOptional() @IsBoolean() viewHostel?: boolean;
  @IsOptional() @IsBoolean() applyHostel?: boolean;
  @IsOptional() @IsBoolean() viewHostelBilling?: boolean;
  @IsOptional() @IsBoolean() submitHostelConcerns?: boolean;
  @IsOptional() @IsBoolean() viewHostelMovement?: boolean;
}

export class LinkGuardianDto extends GuardianPermissionsDto {
  @IsEmail() email!: string;
  @IsOptional() @IsString() name?: string;
  @IsIn(["Mother", "Father", "Guardian", "Grandparent", "Sponsor", "Emergency contact", "Pickup authorised person"])
  relationshipType!: string;
  @IsOptional() @IsBoolean() isPrimary?: boolean;
}

export class UpdateGuardianLinkDto extends GuardianPermissionsDto {
  @IsOptional() @IsBoolean() isPrimary?: boolean;
  @IsOptional() @IsIn(["ACTIVE", "PENDING", "REVOKED"]) status?: string;
}

export class CreateTeacherDto {
  @IsEmail() email!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() @MinLength(8) temporaryPassword?: string;
  @IsOptional() @IsArray() assignments?: Array<{ classId: string; subject: string; isPrimary?: boolean }>;
}

export class CreateGradeDto {
  @IsString() name!: string;
  @IsString() code!: string;
  @IsOptional() sortOrder?: number;
}

export class CreateClassDto {
  @IsString() name!: string;
  @IsString() code!: string;
  @IsString() gradeId!: string;
  @IsOptional() academicYear?: number;
  @IsOptional() @IsString() room?: string;
}

export class CreateSubjectDto {
  @IsString() name!: string;
  @IsString() code!: string;
}

export class AssignSubjectDto {
  @IsString() subjectId!: string;
}
