import { DIAGNOSIS_QUESTIONS } from "@/lib/diagnosis/questions";
import type { DiagnosisAnswers, DiagnosisResult } from "@/lib/diagnosis/types";

export const RADAR_AXES = [
  "分析・論理力",
  "共感・協調力",
  "実行・推進力",
  "創造・発想力",
  "リーダーシップ",
  "成長・挑戦志向",
] as const;

export const DEEP_ANALYSIS_LABELS = [
  "キャリア適合度",
  "成長ポテンシャル",
  "挑戦・変革志向",
  "対人・協働力",
  "専門性深化",
  "ワークライフ",
] as const;

export type RadarChartData = {
  axes: readonly string[];
  scores: number[];
};

export type DeepAnalysisChartData = {
  items: { label: string; score: number }[];
};

const ANSWER_AXIS_WEIGHTS: Record<
  keyof DiagnosisAnswers,
  readonly (readonly number[])[]
> = {
  q1: [
    [2, 1, 2, 1, 1, 3],
    [1, 1, 3, 0, 0, 1],
    [2, 2, 2, 1, 1, 2],
    [1, 1, 2, 1, 2, 2],
  ],
  q2: [
    [1, 3, 1, 1, 1, 1],
    [2, 1, 1, 1, 0, 3],
    [1, 1, 2, 3, 1, 2],
    [1, 2, 2, 1, 3, 1],
  ],
  q3: [
    [3, 1, 2, 1, 0, 2],
    [1, 2, 2, 1, 3, 1],
    [1, 1, 2, 2, 1, 3],
    [1, 2, 1, 1, 1, 2],
  ],
  q4: [
    [3, 1, 1, 1, 0, 2],
    [1, 3, 1, 1, 2, 1],
    [1, 1, 3, 1, 1, 1],
    [1, 1, 1, 3, 1, 2],
  ],
  q5: [
    [2, 1, 2, 1, 0, 3],
    [1, 1, 2, 1, 2, 1],
    [1, 2, 1, 1, 0, 1],
    [1, 2, 1, 1, 1, 2],
  ],
};

function optionIndex(questionId: keyof DiagnosisAnswers, answer: string): number {
  const question = DIAGNOSIS_QUESTIONS.find((item) => item.id === questionId);
  if (!question) return 0;
  const index = question.options.indexOf(answer as (typeof question.options)[number]);
  return index >= 0 ? index : 0;
}

function normalizeScore(total: number, maxTotal: number): number {
  const ratio = Math.min(total / maxTotal, 1);
  return Math.round(42 + ratio * 53);
}

export function buildRadarChartData(answers: DiagnosisAnswers): RadarChartData {
  const totals = RADAR_AXES.map(() => 0);

  for (const question of DIAGNOSIS_QUESTIONS) {
    const index = optionIndex(question.id, answers[question.id]);
    const weights = ANSWER_AXIS_WEIGHTS[question.id][index];
    weights.forEach((weight, axisIndex) => {
      totals[axisIndex] += weight;
    });
  }

  const maxTotal = DIAGNOSIS_QUESTIONS.length * 3;

  return {
    axes: RADAR_AXES,
    scores: totals.map((total) => normalizeScore(total, maxTotal)),
  };
}

export function buildDeepAnalysisChartData(
  answers: DiagnosisAnswers,
  result: DiagnosisResult,
): DeepAnalysisChartData {
  const radar = buildRadarChartData(answers);
  const strengthBoost = Math.min(result.strengths.length * 4, 12);
  const directionBoost = Math.min(result.recommendedDirections.length * 3, 9);

  const baseScores = [
    normalizeScore(radar.scores[0] + radar.scores[2], 120),
    normalizeScore(radar.scores[5] + strengthBoost, 120),
    normalizeScore(radar.scores[4] + radar.scores[5], 120),
    normalizeScore(radar.scores[1] + radar.scores[4], 120),
    normalizeScore(radar.scores[0] + radar.scores[3], 120),
    normalizeScore(radar.scores[1] + 6, 120),
  ];

  const adjusted = baseScores.map((score, index) =>
    Math.min(98, score + (index % 2 === 0 ? directionBoost / 2 : 0)),
  );

  return {
    items: DEEP_ANALYSIS_LABELS.map((label, index) => ({
      label,
      score: adjusted[index],
    })),
  };
}
