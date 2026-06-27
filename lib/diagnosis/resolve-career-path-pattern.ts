import type { DiagnosisProfileContext } from "@/lib/diagnosis/profile-context";
import {
  CAREER_PATH_PATTERNS,
  getCareerPathPattern,
  getCareerPathPatternLabel,
  isValidCareerPathPatternId,
  type CareerPathPattern,
} from "@/lib/diagnosis/career-path-patterns";
import type { DiagnosisAnswers } from "@/lib/diagnosis/types";
import type { OccupationValue } from "@/lib/profile-options";
import { DIAGNOSIS_QUESTIONS } from "@/lib/diagnosis/questions";

export type ResolvedCareerPath = {
  patternId: string;
  categoryId: string;
  label: string;
};

const Q3_CATEGORY: Record<number, string> = {
  0: "specialist",
  1: "manager",
  2: "career_change",
  3: "work_life",
};

const Q2_CATEGORY_BOOST: Record<number, string[]> = {
  0: ["social"],
  1: ["specialist", "ai_digital"],
  2: ["creative"],
  3: ["manager", "hybrid"],
};

const Q4_OCCUPATION_BOOST: Record<number, OccupationValue[]> = {
  0: ["engineer", "consultant"],
  1: ["sales", "service"],
  2: ["manufacturing", "office_worker"],
  3: ["designer", "marketing"],
};

function optionIndex(questionId: keyof DiagnosisAnswers, answers: DiagnosisAnswers): number {
  const question = DIAGNOSIS_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return -1;
  return question.options.indexOf(answers[questionId] as (typeof question.options)[number]);
}

function scorePattern(
  pattern: CareerPathPattern,
  categoryId: string,
  occupation?: OccupationValue,
  q2Index = -1,
): number {
  let score = pattern.categoryId === categoryId ? 10 : 0;
  if (occupation && pattern.occupationHints?.includes(occupation)) score += 5;
  const boosts = q2Index >= 0 ? Q2_CATEGORY_BOOST[q2Index] : [];
  if (boosts.includes(pattern.categoryId)) score += 2;
  return score;
}

function pickBestInCategory(
  categoryId: string,
  occupation?: OccupationValue,
  q2Index = -1,
): CareerPathPattern {
  const candidates = CAREER_PATH_PATTERNS.filter((p) => p.categoryId === categoryId);
  if (candidates.length === 0) {
    return CAREER_PATH_PATTERNS[0];
  }
  const ranked = [...candidates].sort(
    (a, b) => scorePattern(b, categoryId, occupation, q2Index) - scorePattern(a, categoryId, occupation, q2Index),
  );
  return ranked[0];
}

function resolveCategoryFromAnswers(answers: DiagnosisAnswers): string {
  const q3 = optionIndex("q3", answers);
  if (q3 >= 0 && Q3_CATEGORY[q3]) return Q3_CATEGORY[q3];

  const q2 = optionIndex("q2", answers);
  if (q2 >= 0 && Q2_CATEGORY_BOOST[q2]?.[0]) return Q2_CATEGORY_BOOST[q2][0];

  return "specialist";
}

function inferOccupationFromQ4(answers: DiagnosisAnswers): OccupationValue | undefined {
  const q4 = optionIndex("q4", answers);
  if (q4 < 0) return undefined;
  return Q4_OCCUPATION_BOOST[q4]?.[0];
}

/** 回答・プロフィールからパターンをルール判定 */
export function resolveCareerPathFromAnswers(
  answers: DiagnosisAnswers,
  profileContext?: DiagnosisProfileContext | null,
): ResolvedCareerPath {
  const occupation =
    (profileContext?.occupationValue as OccupationValue | undefined) ??
    inferOccupationFromQ4(answers);
  const categoryId = resolveCategoryFromAnswers(answers);
  const q2Index = optionIndex("q2", answers);
  const pattern = pickBestInCategory(categoryId, occupation, q2Index);

  return {
    patternId: pattern.id,
    categoryId: pattern.categoryId,
    label: pattern.label,
  };
}

export function resolveCareerPathPattern(options: {
  patternIdFromAi?: string | null;
  answers: DiagnosisAnswers;
  profileContext?: DiagnosisProfileContext | null;
}): ResolvedCareerPath {
  const { patternIdFromAi, answers, profileContext } = options;
  if (patternIdFromAi && isValidCareerPathPatternId(patternIdFromAi)) {
    const pattern = getCareerPathPattern(patternIdFromAi)!;
    return {
      patternId: pattern.id,
      categoryId: pattern.categoryId,
      label: pattern.label,
    };
  }
  return resolveCareerPathFromAnswers(answers, profileContext);
}

/** 既存データ（patternId なし）向け：保存 headline から近いパターンを推定 */
export function resolveCareerPathFromLegacyHeadline(
  headline: string,
  answers?: DiagnosisAnswers,
  profileContext?: DiagnosisProfileContext | null,
): ResolvedCareerPath {
  const normalized = headline.trim();
  if (normalized) {
    const exact = CAREER_PATH_PATTERNS.find((p) => p.label === normalized);
    if (exact) {
      return { patternId: exact.id, categoryId: exact.categoryId, label: exact.label };
    }
    const partial = CAREER_PATH_PATTERNS.find(
      (p) => normalized.includes(p.label) || p.label.includes(normalized),
    );
    if (partial) {
      return { patternId: partial.id, categoryId: partial.categoryId, label: partial.label };
    }
  }
  if (answers) {
    return resolveCareerPathFromAnswers(answers, profileContext);
  }
  return {
    patternId: "specialist_core",
    categoryId: "specialist",
    label: getCareerPathPatternLabel("specialist_core"),
  };
}
