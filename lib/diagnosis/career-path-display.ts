import {
  getCareerPathPatternLabel,
  isValidCareerPathPatternId,
} from "@/lib/diagnosis/career-path-patterns";
import type { DiagnosisResult, DiagnosisResultBrief } from "@/lib/diagnosis/types";

/** 結果画面向け：マスタ ID / 保存ラベルのみ参照（resolve ロジックは使わない） */
export function getCareerPathDisplayLabel(
  result: DiagnosisResult | DiagnosisResultBrief,
): string {
  if (result.careerPathPatternId && isValidCareerPathPatternId(result.careerPathPatternId)) {
    return getCareerPathPatternLabel(result.careerPathPatternId);
  }
  const saved = result.careerPathHeadline?.trim();
  if (saved) return saved;
  return getCareerPathPatternLabel("specialist_core");
}
