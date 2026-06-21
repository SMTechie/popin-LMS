import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PublicApplicationDto {
  @IsString()
  parentName!: string;

  @IsEmail()
  parentEmail!: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsString()
  studentName!: string;

  @IsString()
  grade!: string;

  @IsOptional()
  @IsString()
  token?: string;
}

export class FormFieldDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  label?: string;

  @IsOptional()
  required?: boolean;

  @IsOptional()
  options?: string[];
}

export class FormStepDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields!: FormFieldDto[];
}

export class FormSchemaDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormStepDto)
  steps!: FormStepDto[];
}

export class CreateApplicationFormDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;
}

export class SaveFormVersionDto {
  @ValidateNested()
  @Type(() => FormSchemaDto)
  schema!: FormSchemaDto;
}

export class PublishFormVersionDto {
  @IsString()
  @IsNotEmpty()
  versionId!: string;
}

export class UpdateAdmissionsStatusDto {
  @IsString()
  @IsNotEmpty()
  admissionsOpenState!: string;

  @IsOptional()
  @IsString()
  opensAt?: string;

  @IsOptional()
  @IsString()
  closesAt?: string;

  @IsOptional()
  @IsString()
  closedMessage?: string;

  @IsOptional()
  @IsString()
  openingMessage?: string;
}

export class SubmitApplicationDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsString()
  @IsNotEmpty()
  applicantName!: string;

  @IsString()
  @IsNotEmpty()
  guardianName!: string;

  @IsEmail()
  guardianEmail!: string;

  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @IsOptional()
  @IsString()
  submissionChannel?: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationFileDto)
  files?: ApplicationFileDto[];
}

export class ApplicationFileDto {
  @IsString()
  @IsNotEmpty()
  fieldKey!: string;

  @IsString()
  @IsNotEmpty()
  originalFilename!: string;

  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @IsString()
  @IsNotEmpty()
  contentBase64!: string;
}

export class ApproveApplicationDto {
  @IsOptional()
  @IsString()
  gradeId?: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsString()
  relationshipType?: string;
}
