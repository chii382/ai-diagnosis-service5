import fs from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import { buildDiagnosisProfileContext } from "@/lib/diagnosis/profile-context";
import { getResolvedCareerPath } from "@/lib/diagnosis/career-path-headline";
import {
  getCareerPathPatternLabel,
  isValidCareerPathPatternId,
} from "@/lib/diagnosis/career-path-patterns";
import type { DiagnosisAnswers, DiagnosisResult, DiagnosisResultBrief } from "@/lib/diagnosis/types";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    process.env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
}

const dryRun = process.argv.includes("--dry-run");

type DiagnosisDoc = {
  _id: ObjectId;
  userId: ObjectId;
  answers: DiagnosisAnswers;
  result: DiagnosisResult;
  resultBrief?: DiagnosisResultBrief;
  updatedAt?: Date;
};

function needsMigration(
  result: Pick<DiagnosisResult, "careerPathPatternId" | "careerPathHeadline">,
  resolved: { patternId: string; label: string },
): boolean {
  const hasValidId =
    Boolean(result.careerPathPatternId) &&
    isValidCareerPathPatternId(result.careerPathPatternId as string);
  if (!hasValidId) return true;
  if (result.careerPathPatternId !== resolved.patternId) return true;
  if ((result.careerPathHeadline ?? "").trim() !== resolved.label) return true;
  return false;
}

function syncBrief(
  brief: DiagnosisResultBrief | undefined,
  patternId: string,
  label: string,
): DiagnosisResultBrief | undefined {
  if (!brief) return undefined;
  if (
    brief.careerPathPatternId === patternId &&
    (brief.careerPathHeadline ?? "").trim() === label
  ) {
    return undefined;
  }
  return {
    ...brief,
    careerPathPatternId: patternId,
    careerPathHeadline: label,
  };
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("MONGODB_URI が未設定です (.env.local)");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  let scanned = 0;
  let updated = 0;
  let skipped = 0;
  const samples: Array<{ id: string; from: string; to: string }> = [];

  try {
    await client.connect();
    const db = client.db();
    const diagnoses = db.collection<DiagnosisDoc>("diagnoses");
    const users = db.collection("users");

    const cursor = diagnoses.find({});
    for await (const doc of cursor) {
      scanned += 1;

      const user = await users.findOne(
        { _id: doc.userId },
        { projection: { name: 1, gender: 1, ageRange: 1, occupation: 1, bio: 1 } },
      );
      const profileContext = user ? buildDiagnosisProfileContext(user) : null;

      const resolved = getResolvedCareerPath(doc.result, {
        answers: doc.answers,
        profileContext,
      });

      const resultNeedsUpdate = needsMigration(doc.result, resolved);
      const nextBrief = syncBrief(doc.resultBrief, resolved.patternId, resolved.label);
      const briefNeedsUpdate = Boolean(nextBrief);

      if (!resultNeedsUpdate && !briefNeedsUpdate) {
        skipped += 1;
        continue;
      }

      const fromLabel =
        doc.result.careerPathHeadline?.trim() ||
        (doc.result.careerPathPatternId && isValidCareerPathPatternId(doc.result.careerPathPatternId)
          ? getCareerPathPatternLabel(doc.result.careerPathPatternId)
          : "(未設定)");

      if (samples.length < 10) {
        samples.push({
          id: doc._id.toString(),
          from: `${doc.result.careerPathPatternId ?? "—"} / ${fromLabel}`,
          to: `${resolved.patternId} / ${resolved.label}`,
        });
      }

      const $set: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (resultNeedsUpdate) {
        $set["result.careerPathPatternId"] = resolved.patternId;
        $set["result.careerPathHeadline"] = resolved.label;
      }
      if (briefNeedsUpdate && nextBrief) {
        $set["resultBrief.careerPathPatternId"] = nextBrief.careerPathPatternId;
        $set["resultBrief.careerPathHeadline"] = nextBrief.careerPathHeadline;
      }

      if (!dryRun) {
        await diagnoses.updateOne({ _id: doc._id }, { $set });
      }
      updated += 1;
    }

    console.log(`mode: ${dryRun ? "dry-run" : "apply"}`);
    console.log(`scanned: ${scanned}`);
    console.log(`updated: ${updated}`);
    console.log(`skipped (already ok): ${skipped}`);
    if (samples.length > 0) {
      console.log("\nsamples:");
      for (const s of samples) {
        console.log(`  ${s.id}`);
        console.log(`    from: ${s.from}`);
        console.log(`    to:   ${s.to}`);
      }
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
