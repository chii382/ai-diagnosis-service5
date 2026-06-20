import type { ObjectId } from "mongodb";
import type {
  CareerRoadmap,
  CareerRoadmapBrief,
  DiagnosisAnswers,
  DiagnosisDocument,
  DiagnosisListItem,
  DiagnosisResult,
  DiagnosisResultBrief,
} from "@/lib/diagnosis/types";

type DiagnosisRecord = {
  _id: ObjectId;
  userId: ObjectId;
  answers: DiagnosisAnswers;
  result: DiagnosisResult;
  resultBrief?: DiagnosisResultBrief;
  careerRoadmap: CareerRoadmap;
  careerRoadmapBrief?: CareerRoadmapBrief;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeDiagnosis(doc: DiagnosisRecord): DiagnosisDocument {
  return {
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
    answers: doc.answers,
    result: doc.result,
    resultBrief: doc.resultBrief,
    careerRoadmap: doc.careerRoadmap,
    careerRoadmapBrief: doc.careerRoadmapBrief,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function serializeDiagnosisListItem(doc: DiagnosisRecord): DiagnosisListItem {
  return {
    id: doc._id.toString(),
    summary: doc.result.summary,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function validateDiagnosisUpdate(input: unknown):
  | { ok: true; result: DiagnosisResult; careerRoadmap: CareerRoadmap }
  | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "更新データが不正です" };
  }

  const body = input as Record<string, unknown>;
  const resultRaw = body.result;
  const roadmapRaw = body.careerRoadmap;

  if (!resultRaw || typeof resultRaw !== "object" || !roadmapRaw || typeof roadmapRaw !== "object") {
    return { ok: false, error: "result と careerRoadmap が必要です" };
  }

  const resultObj = resultRaw as Record<string, unknown>;
  const summary = typeof resultObj.summary === "string" ? resultObj.summary.trim() : "";
  const advice = typeof resultObj.advice === "string" ? resultObj.advice.trim() : "";

  if (!summary || !advice) {
    return { ok: false, error: "サマリーとアドバイスは必須です" };
  }

  const toArray = (value: unknown, label: string): string[] | null => {
    if (!Array.isArray(value)) return null;
    const items = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
    if (items.length === 0) return null;
    return items;
  };

  const strengths = toArray(resultObj.strengths, "strengths");
  const recommendedDirections = toArray(resultObj.recommendedDirections, "recommendedDirections");
  if (!strengths || !recommendedDirections) {
    return { ok: false, error: "強みとおすすめ方向性を1件以上入力してください" };
  }

  const parsePhase = (value: unknown) => {
    if (!value || typeof value !== "object") return null;
    const phase = value as Record<string, unknown>;
    const period = typeof phase.period === "string" ? phase.period.trim() : "";
    const goals = toArray(phase.goals, "goals");
    const actions = toArray(phase.actions, "actions");
    if (!period || !goals || !actions) return null;
    return { period, goals, actions };
  };

  const roadmapObj = roadmapRaw as Record<string, unknown>;
  const shortTerm = parsePhase(roadmapObj.shortTerm);
  const midTerm = parsePhase(roadmapObj.midTerm);
  const longTerm = parsePhase(roadmapObj.longTerm);

  if (!shortTerm || !midTerm || !longTerm) {
    return { ok: false, error: "キャリアロードマップの各期間を入力してください" };
  }

  return {
    ok: true,
    result: { summary, strengths, recommendedDirections, advice },
    careerRoadmap: { shortTerm, midTerm, longTerm },
  };
}
