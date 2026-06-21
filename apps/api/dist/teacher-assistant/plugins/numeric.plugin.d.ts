import { MarkingDecision, MarkingQuestion, SubjectMarkingPlugin } from "./types";
export declare class NumericMarkingPlugin implements SubjectMarkingPlugin {
    key: string;
    subjects: string[];
    supports(type: string): boolean;
    mark(question: MarkingQuestion, detectedAnswer: string): MarkingDecision;
}
