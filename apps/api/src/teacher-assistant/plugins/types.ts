export type MarkingQuestion = {
  questionNumber: string; questionType: string; expectedAnswers: unknown; alternativeAnswers?: unknown;
  marks: number; tolerance?: number | null; decimalPrecision?: number | null; requiredUnit?: string | null;
  caseSensitive: boolean; ignoreWhitespace: boolean; partialMarkRules?: unknown;
};

export type MarkingDecision = { awarded: number; confidence: number; rule: string; explanation: string };

export interface SubjectMarkingPlugin {
  key: string;
  subjects: string[];
  supports(questionType: string): boolean;
  mark(question: MarkingQuestion, detectedAnswer: string): MarkingDecision;
}
