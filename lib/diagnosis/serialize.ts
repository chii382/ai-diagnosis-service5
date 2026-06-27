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
import { getCareerPathPatternLabel, isValidCareerPathPatternId } from "@/lib/diagnosis/career-path-patterns";

export type DiagnosisRecord = {
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

/** MongoDB ドキュメントを API / 画面用レコードに変換する */
export function diagnosisRecordFromMongo(doc: DiagnosisRecord): DiagnosisRecord {
  return {
    _id: doc._id,
    userId: doc.userId,
    answers: doc.answers,
    result: doc.result,
    resultBrief: doc.resultBrief,
    careerRoadmap: doc.careerRoadmap,
    careerRoadmapBrief: doc.careerRoadmapBrief,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

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
  | {
      ok: true;
      result: DiagnosisResult;
      careerRoadmap: CareerRoadmap;
      careerRoadmapBrief?: CareerRoadmapBrief;
    }
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

  const careerPathPatternIdRaw =
    typeof resultObj.careerPathPatternId === "string" ? resultObj.careerPathPatternId.trim() : "";
  if (!careerPathPatternIdRaw || !isValidCareerPathPatternId(careerPathPatternIdRaw)) {
    return { ok: false, error: "キャリアパスパターンを選択してください" };
  }
  const careerPathPatternId = careerPathPatternIdRaw;
  const careerPathHeadline = getCareerPathPatternLabel(careerPathPatternId);

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

  const parseBriefPhase = (value: unknown) => {
    if (!value || typeof value !== "object") return null;
    const phase = value as Record<string, unknown>;
    const period = typeof phase.period === "string" ? phase.period.trim() : "";
    const overview = typeof phase.overview === "string" ? phase.overview.trim() : "";
    if (!period || !overview) return null;
    const highlights = Array.isArray(phase.highlights)
      ? phase.highlights
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    return { period, overview, highlights };
  };

  let careerRoadmapBrief: CareerRoadmapBrief | undefined;
  const briefRaw = body.careerRoadmapBrief;
  if (briefRaw && typeof briefRaw === "object") {
    const briefObj = briefRaw as Record<string, unknown>;
    const briefShort = parseBriefPhase(briefObj.shortTerm);
    const briefMid = parseBriefPhase(briefObj.midTerm);
    const briefLong = parseBriefPhase(briefObj.longTerm);
    if (!briefShort || !briefMid || !briefLong) {
      return { ok: false, error: "各期間の方針概要を入力してください" };
    }
    careerRoadmapBrief = {
      shortTerm: briefShort,
      midTerm: briefMid,
      longTerm: briefLong,
    };
  }

  return {
    ok: true,
    result: { summary, strengths, recommendedDirections, careerPathPatternId, careerPathHeadline, advice },
    careerRoadmap: { shortTerm, midTerm, longTerm },
    careerRoadmapBrief,
  };
}
