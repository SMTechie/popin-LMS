import { MarkingDecision, MarkingQuestion, SubjectMarkingPlugin } from "./types";

function numeric(value: string) {
  let clean = value.trim().replace(/[R$€£,\s]/g, "");
  const fraction = clean.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  if (clean.endsWith("%")) return Number(clean.slice(0, -1)) / 100;
  clean = clean.replace(/×10\^?/i, "e");
  const parsed = Number(clean.replace(/[^0-9eE+\-.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export class NumericMarkingPlugin implements SubjectMarkingPlugin {
  key = "numeric";
  subjects = ["Mathematics", "Mathematical Literacy", "Accounting", "Physical Sciences"];
  supports(type: string) { return ["NUMERICAL", "CALCULATION"].includes(type); }
  mark(question: MarkingQuestion, detectedAnswer: string): MarkingDecision {
    const expectedRaw = Array.isArray(question.expectedAnswers) ? question.expectedAnswers[0] : question.expectedAnswers;
    const expected = numeric(String(expectedRaw)); const detected = numeric(detectedAnswer);
    if (expected === null || detected === null) return { awarded: 0, confidence: .45, rule: "Numerical parse failed", explanation: "Expected or detected value could not be parsed as a number; teacher review is required." };
    const tolerance = Number(question.tolerance || 0); const difference = Math.abs(expected - detected);
    const unitOk = !question.requiredUnit || detectedAnswer.toLowerCase().includes(question.requiredUnit.toLowerCase());
    const precisionOk = question.decimalPrecision === null || question.decimalPrecision === undefined || (detectedAnswer.split(".")[1]?.replace(/\D/g, "").length || 0) === question.decimalPrecision;
    if (difference <= tolerance && unitOk && precisionOk) return { awarded: question.marks, confidence: 1, rule: `Numerical tolerance ±${tolerance}${question.requiredUnit ? ` with unit ${question.requiredUnit}` : ""}`, explanation: `Difference ${difference} is within the configured tolerance.` };
    const partialRules = Array.isArray(question.partialMarkRules) ? question.partialMarkRules as Array<{ tolerance?: number; marks?: number }> : [];
    const partial = partialRules.find((rule) => difference <= Number(rule.tolerance || 0));
    if (partial) return { awarded: Math.min(question.marks, Number(partial.marks || 0)), confidence: .94, rule: "Numerical partial tolerance", explanation: `Answer falls within teacher-defined partial tolerance; difference is ${difference}.` };
    const reason = !unitOk ? "required unit is missing" : !precisionOk ? "decimal precision does not match" : `difference ${difference} exceeds tolerance ${tolerance}`;
    return { awarded: 0, confidence: .98, rule: "Numerical rule not satisfied", explanation: `No marks suggested because ${reason}.` };
  }
}
