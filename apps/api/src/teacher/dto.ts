import { IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateTeacherWorkItemDto {
  @IsString() @IsNotEmpty() type!: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() classId?: string;
  @IsOptional() @IsString() instructions?: string;
  @IsOptional() @IsDateString() dueAt?: string;
  @IsOptional() @IsBoolean() visibleToParents?: boolean;
  @IsOptional() @IsArray() attachments?: unknown[];
  @IsOptional() @IsArray() curriculumOutcomes?: unknown[];
  @IsOptional() @IsString() linkedWorkItemId?: string;
}

export class UpdateTeacherWorkItemDto extends CreateTeacherWorkItemDto {
  @IsOptional() @IsString() status?: string;
}

export class AttendanceEntryDto {
  @IsString() learnerId!: string;
  @IsString() status!: string;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsBoolean() notifyParent?: boolean;
}

export class SubmitAttendanceDto {
  @IsString() classId!: string;
  @IsDateString() registerDate!: string;
  @IsOptional() @IsBoolean() submit?: boolean;
  @IsArray() @ValidateNested({ each: true }) @Type(() => AttendanceEntryDto) entries!: AttendanceEntryDto[];
}

export class ReplyParentQueryDto {
  @IsString() @IsNotEmpty() response!: string;
  @IsOptional() @IsBoolean() resolve?: boolean;
  @IsOptional() @IsBoolean() escalate?: boolean;
}

export class CreateTimetableEntryDto {
  @IsString() classId!: string;
  @IsString() subject!: string;
  @IsInt() @Min(0) @Max(6) dayOfWeek!: number;
  @IsString() startsAt!: string;
  @IsString() endsAt!: string;
  @IsOptional() @IsString() room?: string;
}
