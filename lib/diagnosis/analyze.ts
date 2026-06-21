import Anthropic from "@anthropic-ai/sdk";
import type { DiagnosisProfileContext } from "@/lib/diagnosis/profile-context";
import {
  deriveRoadmapBrief,
  ensureCompleteSentence,
} from "@/lib/diagnosis/plan-content";
import { buildDiagnosisPrompt } from "@/lib/diagnosis/prompts";
import type {
  CareerRoadmap,
  CareerRoadmapBrief,
  DiagnosisAnswers,
  DiagnosisResult,
  DiagnosisResultBrief,
} from "@/lib/diagnosis/types";

const DEFAULT_MODEL = "claude-haiku-4-5-20251001";

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

function getModelId(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  return value.map((item) => item.trim()).filter(Boolean);
}

function parseResult(value: unknown, field: string): DiagnosisResult {
  if (!value || typeof value !== "object") {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  const obj = value as Record<string, unknown>;
  const summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
  const advice = typeof obj.advice === "string" ? obj.advice.trim() : "";
  if (!summary || !advice) {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  return {
    summary,
    advice,
    strengths: asStringArray(obj.strengths, `${field}.strengths`),
    recommendedDirections: asStringArray(
      obj.recommendedDirections,
      `${field}.recommendedDirections`,
    ),
  };
}

function parsePhase(value: unknown, field: string) {
  if (!value || typeof value !== "object") {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  const phase = value as Record<string, unknown>;
  if (typeof phase.period !== "string" || !phase.period.trim()) {
    throw new Error(`AI response field "${field}.period" is invalid`);
  }
  return {
    period: phase.period.trim(),
    goals: asStringArray(phase.goals, `${field}.goals`),
    actions: asStringArray(phase.actions, `${field}.actions`),
  };
}

function parseBriefPhase(value: unknown, field: string) {
  if (!value || typeof value !== "object") {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  const phase = value as Record<string, unknown>;
  const period = typeof phase.period === "string" ? phase.period.trim() : "";
  const overviewRaw =
    typeof phase.overview === "string"
      ? phase.overview.trim()
      : typeof phase.goal === "string"
        ? phase.goal.trim()
        : "";
  if (!period || !overviewRaw) {
    throw new Error(`AI response field "${field}" is invalid`);
  }

  const highlights = Array.isArray(phase.highlights)
    ? phase.highlights
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

  return {
    period,
    overview: ensureCompleteSentence(overviewRaw),
    highlights,
  };
}

function parseRoadmap(value: unknown, field: string): CareerRoadmap {
  if (!value || typeof value !== "object") {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  const roadmapObj = value as Record<string, unknown>;
  return {
    shortTerm: parsePhase(roadmapObj.shortTerm, `${field}.shortTerm`),
    midTerm: parsePhase(roadmapObj.midTerm, `${field}.midTerm`),
    longTerm: parsePhase(roadmapObj.longTerm, `${field}.longTerm`),
  };
}

function parseRoadmapBrief(value: unknown, field: string): CareerRoadmapBrief {
  if (!value || typeof value !== "object") {
    throw new Error(`AI response field "${field}" is invalid`);
  }
  const roadmapObj = value as Record<string, unknown>;
  return {
    shortTerm: parseBriefPhase(roadmapObj.shortTerm, `${field}.shortTerm`),
    midTerm: parseBriefPhase(roadmapObj.midTerm, `${field}.midTerm`),
    longTerm: parseBriefPhase(roadmapObj.longTerm, `${field}.longTerm`),
  };
}

export type AnalysisOutput = {
  result: DiagnosisResult;
  resultBrief: DiagnosisResultBrief;
  careerRoadmap: CareerRoadmap;
  careerRoadmapBrief: CareerRoadmapBrief;
};

export function parseAnalysisResponse(raw: string): AnalysisOutput {
  const parsed = JSON.parse(extractJson(raw)) as Record<string, unknown>;

  const resultRaw = parsed.result ?? parsed;
  const result = parseResult(resultRaw, "result");

  const resultBriefRaw = parsed.resultBrief;
  const resultBriefParsed = resultBriefRaw
    ? parseResult(resultBriefRaw, "resultBrief")
    : {
        summary: result.summary,
        strengths: result.strengths.slice(0, 1),
        recommendedDirections: result.recommendedDirections.slice(0, 1),
        advice: result.advice,
      };
  const resultBrief = {
    ...resultBriefParsed,
    summary: ensureCompleteSentence(resultBriefParsed.summary),
    advice: ensureCompleteSentence(resultBriefParsed.advice),
  };

  const roadmapRaw = parsed.careerRoadmap;
  if (!roadmapRaw || typeof roadmapRaw !== "object") {
    throw new Error("AI response careerRoadmap is invalid");
  }
  const careerRoadmap = parseRoadmap(roadmapRaw, "careerRoadmap");

  const roadmapBriefRaw = parsed.careerRoadmapBrief;
  const careerRoadmapBrief = roadmapBriefRaw
    ? parseRoadmapBrief(roadmapBriefRaw, "careerRoadmapBrief")
    : deriveRoadmapBrief(careerRoadmap);

  return { result, resultBrief, careerRoadmap, careerRoadmapBrief };
}

export async function analyzeDiagnosisAnswers(
  answers: DiagnosisAnswers,
  profileContext?: DiagnosisProfileContext | null,
): Promise<AnalysisOutput> {
  if (!isAnthropicConfigured()) {
    throw new Error("ANTHROPIC_API_KEY が未設定です");
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: getModelId(),
    max_tokens: 4096,
    messages: [
      { role: "user", content: buildDiagnosisPrompt(answers, profileContext) },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  if (!text.trim()) {
    throw new Error("AI response was empty");
  }

  return parseAnalysisResponse(text);
}
