import { auth } from "@/auth";
import {
  diagnosisRecordFromMongo,
  serializeDiagnosis,
  validateDiagnosisUpdate,
} from "@/lib/diagnosis/serialize";
import { getDiagnosesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { canEditDiagnosisResult, getDefaultUserPlan } from "@/lib/plan";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getOwnedDiagnosis(id: string, userId: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const diagnoses = await getDiagnosesCollection();
  return diagnoses.findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  });
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const doc = await getOwnedDiagnosis(id, session.user.id);

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    serializeDiagnosis(
      diagnosisRecordFromMongo({
        _id: doc._id,
        userId: doc.userId as ObjectId,
        answers: doc.answers,
        result: doc.result,
        resultBrief: doc.resultBrief,
        careerRoadmap: doc.careerRoadmap,
        careerRoadmapBrief: doc.careerRoadmapBrief,
        createdAt: doc.createdAt as Date,
        updatedAt: doc.updatedAt as Date,
      }),
    ),
  );
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const doc = await getOwnedDiagnosis(id, session.user.id);

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const plan = getDefaultUserPlan();
  if (!canEditDiagnosisResult(plan)) {
    return NextResponse.json(
      { error: "診断結果の編集は有料プラン限定です" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validated = validateDiagnosisUpdate(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const now = new Date();
  const diagnoses = await getDiagnosesCollection();
  const updateFields: Record<string, unknown> = {
    result: validated.result,
    careerRoadmap: validated.careerRoadmap,
    updatedAt: now,
  };
  if (validated.careerRoadmapBrief) {
    updateFields.careerRoadmapBrief = validated.careerRoadmapBrief;
  }

  await diagnoses.updateOne({ _id: doc._id }, { $set: updateFields });

  return NextResponse.json(
    serializeDiagnosis({
      _id: doc._id,
      userId: doc.userId as ObjectId,
      answers: doc.answers,
      result: validated.result,
      resultBrief: doc.resultBrief,
      careerRoadmap: validated.careerRoadmap,
      careerRoadmapBrief: validated.careerRoadmapBrief ?? doc.careerRoadmapBrief,
      createdAt: doc.createdAt as Date,
      updatedAt: now,
    }),
  );
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const doc = await getOwnedDiagnosis(id, session.user.id);

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const diagnoses = await getDiagnosesCollection();
  await diagnoses.deleteOne({ _id: doc._id });

  return NextResponse.json({ success: true });
}
