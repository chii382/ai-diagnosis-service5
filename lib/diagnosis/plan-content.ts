import type {
  CareerRoadmap,
  CareerRoadmapBrief,
  CareerRoadmapPhase,
  CareerRoadmapPhaseBrief,
  DiagnosisDocument,
  DiagnosisResult,
  DiagnosisResultBrief,
} from "@/lib/diagnosis/types";
import { canViewPremiumContent, type UserPlan } from "@/lib/plan";

function hasTruncationEllipsis(text: string): boolean {
  return text.trimEnd().endsWith("…");
}

/** 末尾の省略記号を除き、句点で終わる完全な文に整える */
export function ensureCompleteSentence(text: string): string {
  const cleaned = text.trim().replace(/…+$/u, "").trimEnd();
  if (!cleaned) return cleaned;
  if (/[。！？]$/.test(cleaned)) return cleaned;
  return `${cleaned}。`;
}

function normalizeLegacyBriefPhase(
  phase: CareerRoadmapPhaseBrief & { goal?: string },
): CareerRoadmapPhaseBrief {
  if (phase.overview?.trim()) {
    return {
      period: phase.period,
      overview: phase.overview.trim(),
      highlights: phase.highlights ?? [],
    };
  }
  if (phase.goal?.trim()) {
    return {
      period: phase.period,
      overview: phase.goal.trim(),
      highlights: [],
    };
  }
  return phase;
}

function derivePhaseBrief(phase: CareerRoadmapPhase): CareerRoadmapPhaseBrief {
  const primaryGoal = phase.goals[0] ?? "キャリアの方向性を明確にする";
  const secondaryGoal = phase.goals[1];
  const primaryAction = phase.actions[0];

  const overview = [
    `この期間は、${primaryGoal.replace(/。$/, "")}ことを重点テーマとして進めます。`,
    secondaryGoal
      ? `あわせて${secondaryGoal.replace(/。$/, "")}方向への成長も視野に入れ、次のステップへつなげていきます。`
      : primaryAction
        ? `特に${primaryAction.replace(/。$/, "")}などが、この時期の核となる取り組みです。`
        : "方向性を固めながら、次のフェーズへの準備を進めます。",
  ].join("");

  const highlights = [primaryGoal, secondaryGoal ?? primaryAction ?? primaryGoal]
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .filter((item, index, arr) => arr.indexOf(item) === index);

  return {
    period: phase.period,
    overview,
    highlights: highlights.slice(0, 2),
  };
}

export function deriveResultBrief(result: DiagnosisResult): DiagnosisResultBrief {
  return {
    summary: ensureCompleteSentence(result.summary),
    strengths: result.strengths.slice(0, 1),
    recommendedDirections: result.recommendedDirections.slice(0, 1),
    advice: ensureCompleteSentence(result.advice),
  };
}

export function deriveRoadmapBrief(roadmap: CareerRoadmap): CareerRoadmapBrief {
  return {
    shortTerm: derivePhaseBrief(roadmap.shortTerm),
    midTerm: derivePhaseBrief(roadmap.midTerm),
    longTerm: derivePhaseBrief(roadmap.longTerm),
  };
}

export function resolveResultBrief(diagnosis: DiagnosisDocument): DiagnosisResultBrief {
  return diagnosis.resultBrief ?? deriveResultBrief(diagnosis.result);
}

function resolveBriefPhase(
  phase: CareerRoadmapPhaseBrief & { goal?: string },
  fullPhase: CareerRoadmapPhase,
): CareerRoadmapPhaseBrief {
  const normalized = normalizeLegacyBriefPhase(phase);
  if (hasTruncationEllipsis(normalized.overview)) {
    return derivePhaseBrief(fullPhase);
  }
  return {
    ...normalized,
    overview: ensureCompleteSentence(normalized.overview),
  };
}

export function resolveRoadmapBrief(diagnosis: DiagnosisDocument): CareerRoadmapBrief {
  const brief = diagnosis.careerRoadmapBrief ?? deriveRoadmapBrief(diagnosis.careerRoadmap);
  return {
    shortTerm: resolveBriefPhase(brief.shortTerm, diagnosis.careerRoadmap.shortTerm),
    midTerm: resolveBriefPhase(brief.midTerm, diagnosis.careerRoadmap.midTerm),
    longTerm: resolveBriefPhase(brief.longTerm, diagnosis.careerRoadmap.longTerm),
  };
}

export function getResultForPlan(
  diagnosis: DiagnosisDocument,
  _plan: UserPlan,
): DiagnosisResult {
  return diagnosis.result;
}

export function getRoadmapForPlan(
  diagnosis: DiagnosisDocument,
  plan: UserPlan,
): CareerRoadmap | CareerRoadmapBrief {
  if (canViewPremiumContent(plan)) return diagnosis.careerRoadmap;
  return resolveRoadmapBrief(diagnosis);
}

export function isDetailedRoadmap(
  roadmap: CareerRoadmap | CareerRoadmapBrief,
): roadmap is CareerRoadmap {
  return "goals" in roadmap.shortTerm;
}

export const FREE_PLAN_ROADMAP_NOTICE = {
  intro: "無料プランでは各期間の方針概要を表示しています。",
  highlight: "有料プランでは、目標と具体的アクションを含む詳細ロードマップを確認できます。",
} as const;
