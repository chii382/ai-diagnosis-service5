import { getDiagnosesCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import {
  diagnosisRecordFromMongo,
  serializeDiagnosis,
  serializeDiagnosisListItem,
} from "@/lib/diagnosis/serialize";

export async function fetchDiagnosisForUser(id: string, userId: string) {
  if (!ObjectId.isValid(id)) return null;

  const diagnoses = await getDiagnosesCollection();
  const doc = await diagnoses.findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId),
  });

  if (!doc) return null;

  return serializeDiagnosis(
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
  );
}

export async function fetchDiagnosisHistoryForUser(userId: string) {
  const diagnoses = await getDiagnosesCollection();
  const docs = await diagnoses
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();

  return docs.map((doc) =>
    serializeDiagnosisListItem({
      _id: doc._id,
      userId: doc.userId as ObjectId,
      answers: doc.answers,
      result: doc.result,
      careerRoadmap: doc.careerRoadmap,
      createdAt: doc.createdAt as Date,
      updatedAt: doc.updatedAt as Date,
    }),
  );
}
