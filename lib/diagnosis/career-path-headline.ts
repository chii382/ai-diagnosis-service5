import type { DiagnosisAnswers, DiagnosisResult, DiagnosisResultBrief } from "@/lib/diagnosis/types";
import type { DiagnosisProfileContext } from "@/lib/diagnosis/profile-context";
import { getCareerPathPatternLabel, isValidCareerPathPatternId } from "@/lib/diagnosis/career-path-patterns";
import {
  resolveCareerPathFromLegacyHeadline,
  resolveCareerPathPattern,
} from "@/lib/diagnosis/resolve-career-path-pattern";

type ResultWithCareerPath = Pick<
  DiagnosisResult,
  "careerPathPatternId" | "careerPathHeadline" | "recommendedDirections" | "summary"
> & {
  answers?: DiagnosisAnswers;
};

/** 診断結果から「ずばり〜」表示ラベルを取得（マスタパターン優先） */
export function getCareerPathHeadline(
  result: DiagnosisResult | DiagnosisResultBrief,
  options?: {
    answers?: DiagnosisAnswers;
    profileContext?: DiagnosisProfileContext | null;
  },
): string {
  return getResolvedCareerPath(result, options).label;
}

export function getCareerPathHeadlineForChart(
  result: DiagnosisResult | DiagnosisResultBrief,
  options?: {
    answers?: DiagnosisAnswers;
    profileContext?: DiagnosisProfileContext | null;
  },
): string {
  return getCareerPathHeadline(result, options);
}

export function getResolvedCareerPath(
  result: ResultWithCareerPath,
  options?: {
    answers?: DiagnosisAnswers;
    profileContext?: DiagnosisProfileContext | null;
  },
): { patternId: string; label: string } {
  if (result.careerPathPatternId && isValidCareerPathPatternId(result.careerPathPatternId)) {
    return {
      patternId: result.careerPathPatternId,
      label: getCareerPathPatternLabel(result.careerPathPatternId),
    };
  }

  if (result.careerPathHeadline?.trim()) {
    const legacy = resolveCareerPathFromLegacyHeadline(
      result.careerPathHeadline,
      options?.answers ?? result.answers,
      options?.profileContext,
    );
    return { patternId: legacy.patternId, label: legacy.label };
  }

  if (options?.answers) {
    const resolved = resolveCareerPathPattern({
      patternIdFromAi: null,
      answers: options.answers,
      profileContext: options?.profileContext,
    });
    return { patternId: resolved.patternId, label: resolved.label };
  }

  return {
    patternId: "specialist_core",
    label: getCareerPathPatternLabel("specialist_core"),
  };
}

/** @deprecated 後方互換 */
export function normalizeCareerPathHeadline(text: string): string {
  return text.trim().replace(/…+/gu, "").replace(/\.\.\./g, "").trim();
}

/** @deprecated AI parse 前のフォールバック用 */
export function summarizeRecommendedDirections(_directions: string[]): string {
  return getCareerPathPatternLabel("specialist_core");
}

/** @deprecated */
export function deriveCareerPathHeadline(source: ResultWithCareerPath): string {
  return getCareerPathHeadline(source as DiagnosisResult, {
    answers: source.answers,
  });
}
