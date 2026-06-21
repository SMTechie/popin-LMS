import { MarkingDecision, MarkingQuestion, SubjectMarkingPlugin } from "./types";

const asList = (value: unknown) => Array.isArray(value) ? value.map(String) : [String(value ?? "")];
const normalise = (value: string, question: MarkingQuestion) => {
  let result = value.trim();
  if (question.ignoreWhitespace) result = result.replace(/\s+/g, " ");
  if (!question.caseSensitive) result = result.toLowerCase();
  return result;
};

export class ObjectiveMarkingPlugin implements SubjectMarkingPlugin {
  key = "objective";
  subjects = ["EMS", "Computer Applications Technology", "Information Technology", "Multiple Choice", "General Objective"];
  supports(type: string) { return ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "MATCHING", "EXACT"].includes(type); }
  mark(question: MarkingQuestion, detectedAnswer: string): MarkingDecision {
    const acceptable = [...asList(question.expectedAnswers), ...asList(question.alternativeAnswers).filter(Boolean)].map((item) => normalise(item, question));
    const detected = normalise(detectedAnswer, question);
    if (question.questionType === "MATCHING") {
      const pairs = (value: string) => value.split(/[;,|]/).map((item) => item.trim()).filter(Boolean).sort().join("|");
      const expectedPairs = pairs(asList(question.expectedAnswers).join("|"));
      const exactMapping = pairs(detected) === expectedPairs;
      return exactMapping
        ? { awarded: question.marks, confidence: 1, rule: "Matching map (order independent)", explanation: "All configured pairs match; shuffled answer order is ignored." }
        : { awarded: 0, confidence: detected ? .95 : .5, rule: "Matching map mismatch", explanation: "One or more configured pairs are missing or incorrect." };
    }
    const exact = acceptable.includes(detected);
    if (exact) return { awarded: question.marks, confidence: 1, rule: `${question.questionType}: exact acceptable answer`, explanation: `Detected answer matches one of ${acceptable.length} configured acceptable answer(s).` };
    const partialRules = Array.isArray(question.partialMarkRules) ? question.partialMarkRules as Array<{ answer?: string; marks?: number }> : [];
    const partial = partialRules.find((rule) => normalise(String(rule.answer || ""), question) === detected);
    if (partial) return { awarded: Math.min(question.marks, Number(partial.marks || 0)), confidence: .95, rule: "Configured partial-answer rule", explanation: "Detected answer matches a teacher-defined partial-mark rule." };
    return { awarded: 0, confidence: detected ? .98 : .5, rule: `${question.questionType}: no match`, explanation: "Detected answer does not match the memorandum or alternatives." };
  }
}
