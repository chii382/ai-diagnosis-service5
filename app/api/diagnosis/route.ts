import { auth } from "@/auth";
import { analyzeDiagnosisAnswers, isAnthropicConfigured } from "@/lib/diagnosis/analyze";
import { buildDiagnosisProfileContext } from "@/lib/diagnosis/profile-context";
import { validateAnswers } from "@/lib/diagnosis/questions";
import {
  serializeDiagnosis,
  serializeDiagnosisListItem,
} from "@/lib/diagnosis/serialize";
import { getDiagnosesCollection, getUsersCollection } from "@/lib/mongodb";
import { persistErrorLog } from "@/lib/sentry/error-log";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const diagnoses = await getDiagnosesCollection();
  const docs = await diagnoses
    .find({ userId: new ObjectId(session.user.id) })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({
    items: docs.map((doc) =>
      serializeDiagnosisListItem({
        _id: doc._id,
        userId: doc.userId as ObjectId,
        answers: doc.answers,
        result: doc.result,
        careerRoadmap: doc.careerRoadmap,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
      }),
    ),
  });
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAnthropicConfigured()) {
      return NextResponse.json(
        { error: "AI診断の設定（ANTHROPIC_API_KEY）が未設定です" },
        { status: 503 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const answersBody =
      body && typeof body === "object" && "answers" in body
        ? (body as { answers: unknown }).answers
        : body;

    const validated = validateAnswers(answersBody);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(session.user.id) });
    const profileContext = user
      ? buildDiagnosisProfileContext({
          name: user.name,
          gender: user.gender,
          ageRange: user.ageRange,
          occupation: user.occupation,
          bio: user.bio,
        })
      : null;

    const analysisStartedAt = Date.now();
    const analysis = await analyzeDiagnosisAnswers(validated.answers, profileContext);
    const analysisDurationMs = Date.now() - analysisStartedAt;
    const now = new Date();
    const userId = new ObjectId(session.user.id);

    const diagnoses = await getDiagnosesCollection();
    const insertResult = await diagnoses.insertOne({
      userId,
      answers: validated.answers,
      result: analysis.result,
      resultBrief: analysis.resultBrief,
      careerRoadmap: analysis.careerRoadmap,
      careerRoadmapBrief: analysis.careerRoadmapBrief,
      analysisDurationMs,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      serializeDiagnosis({
        _id: insertResult.insertedId,
        userId,
        answers: validated.answers,
        result: analysis.result,
        resultBrief: analysis.resultBrief,
        careerRoadmap: analysis.careerRoadmap,
        careerRoadmapBrief: analysis.careerRoadmapBrief,
        createdAt: now,
        updatedAt: now,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Diagnosis POST failed:", error);
    const session = await auth().catch(() => null);
    await persistErrorLog({
      message: error instanceof Error ? error.message : "Diagnosis POST failed",
      stack: error instanceof Error ? error.stack : undefined,
      url: "/api/diagnosis",
      userId: session?.user?.id,
      level: "error",
    });
    return NextResponse.json(
      { error: "診断の実行に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 },
    );
  }
}
