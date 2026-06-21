export declare class MemoQuestionDto {
    questionNumber: string;
    questionType: string;
    expectedAnswers: unknown;
    alternativeAnswers?: unknown;
    marks: number;
    tolerance?: number;
    decimalPrecision?: number;
    requiredUnit?: string;
    caseSensitive?: boolean;
    ignoreWhitespace?: boolean;
    partialMarkRules?: unknown;
}
export declare class CreateAssistantAssessmentDto {
    subject: string;
    gradeId?: string;
    classIds: string[];
    name: string;
    assessmentType: string;
    totalMarks: number;
    dueAt?: string;
    uploads?: unknown[];
    settings?: Record<string, unknown>;
    questions: MemoQuestionDto[];
}
export declare class ScriptUploadDto {
    learnerId?: string;
    detectedStudentNumber?: string;
    detectedStudentName?: string;
    originalFiles: unknown[];
    extractedText?: string;
}
export declare class BatchUploadDto {
    scripts: ScriptUploadDto[];
}
export declare class UpdateExtractedTextDto {
    editableText: string;
    learnerId?: string;
    ocrConfidence?: number;
}
export declare class OverrideResultItemDto {
    resultId: string;
    finalMarks: number;
    note?: string;
}
export declare class OverrideResultsDto {
    results: OverrideResultItemDto[];
}
export declare class ScriptSelectionDto {
    scriptIds: string[];
}
