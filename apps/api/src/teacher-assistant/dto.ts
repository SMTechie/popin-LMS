import { Type } from "class-transformer";
import { Allow, IsArray, IsBoolean, IsDateString, IsDefined, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

export class MemoQuestionDto {
  @IsString() questionNumber!: string;
  @IsIn(["NUMERICAL","CALCULATION","MULTIPLE_CHOICE","TRUE_FALSE","FILL_BLANK","MATCHING","EXACT"]) questionType!: string;
  @IsDefined() @Allow() expectedAnswers!: unknown;
  @IsOptional() @Allow() alternativeAnswers?: unknown;
  @IsNumber() @Min(0) marks!: number;
  @IsOptional() @IsNumber() @Min(0) tolerance?: number;
  @IsOptional() @IsInt() @Min(0) @Max(10) decimalPrecision?: number;
  @IsOptional() @IsString() requiredUnit?: string;
  @IsOptional() @IsBoolean() caseSensitive?: boolean;
  @IsOptional() @IsBoolean() ignoreWhitespace?: boolean;
  @IsOptional() @Allow() partialMarkRules?: unknown;
}

export class CreateAssistantAssessmentDto {
  @IsString() subject!: string;
  @IsOptional() @IsString() gradeId?: string;
  @IsArray() classIds!: string[];
  @IsString() name!: string;
  @IsString() assessmentType!: string;
  @IsNumber() @Min(0.5) totalMarks!: number;
  @IsOptional() @IsDateString() dueAt?: string;
  @IsOptional() @IsArray() uploads?: unknown[];
  @IsOptional() @IsObject() settings?: Record<string, unknown>;
  @IsArray() @ValidateNested({ each: true }) @Type(() => MemoQuestionDto) questions!: MemoQuestionDto[];
}

export class ScriptUploadDto {
  @IsOptional() @IsString() learnerId?: string;
  @IsOptional() @IsString() detectedStudentNumber?: string;
  @IsOptional() @IsString() detectedStudentName?: string;
  @IsArray() originalFiles!: unknown[];
  @IsOptional() @IsString() extractedText?: string;
}

export class BatchUploadDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ScriptUploadDto) scripts!: ScriptUploadDto[];
}

export class UpdateExtractedTextDto {
  @IsString() editableText!: string;
  @IsOptional() @IsString() learnerId?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(1) ocrConfidence?: number;
}

export class OverrideResultItemDto {
  @IsString() resultId!: string;
  @IsNumber() @Min(0) finalMarks!: number;
  @IsOptional() @IsString() note?: string;
}
export class OverrideResultsDto { @IsArray() @ValidateNested({ each: true }) @Type(() => OverrideResultItemDto) results!: OverrideResultItemDto[]; }
export class ScriptSelectionDto { @IsArray() scriptIds!: string[]; }
