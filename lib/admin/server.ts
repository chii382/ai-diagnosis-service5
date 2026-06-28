import { resolveAvatarUrlForUser } from "@/lib/avatar-upload";
import { getResolvedCareerPath } from "@/lib/diagnosis/career-path-headline";
import {
  CAREER_PATH_CATEGORIES,
  getCareerPathCategory,
  getCareerPathPattern,
} from "@/lib/diagnosis/career-path-patterns";
import type { DiagnosisAnswers } from "@/lib/diagnosis/types";
import {
  diagnosisRecordFromMongo,
  serializeDiagnosis,
} from "@/lib/diagnosis/serialize";
import type { DiagnosisDocument } from "@/lib/diagnosis/types";
import {
  getDiagnosesCollection,
  getErrorLogsCollection,
  getMongoClientPromise,
  getUsersCollection,
  isMongoConfigured,
} from "@/lib/mongodb";
import { AGE_RANGE_OPTIONS, OCCUPATION_OPTIONS } from "@/lib/profile-options";
import { normalizeUserPlan, type UserPlan, getPlanAdminLabel, isPaidPlan } from "@/lib/plan";
import { DEFAULT_USER_ROLE, normalizeUserRole, type UserRole } from "@/lib/user/types";
import { ObjectId } from "mongodb";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatWeekKey(date: Date): string {
  const weekStart = startOfWeek(date);
  return formatDateKey(weekStart);
}

function formatMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** ミリ秒を人が読みやすい時間表記に変換 */
export function formatDurationMs(ms: number): string {
  const { value, unit } = formatDurationParts(ms);
  return `${value}${unit}`;
}

/** 数値と単位を分けて返す（管理画面のメトリクス表示用） */
export function formatDurationParts(ms: number): { value: number; unit: string } {
  if (ms < 1000) {
    return { value: Math.round(ms), unit: "ミリ秒" };
  }
  if (ms < 60_000) {
    return { value: Math.round(ms / 100) / 10, unit: "秒" };
  }
  return { value: Math.round(ms / 600) / 10, unit: "分" };
}

export function getMonthlyAiTokenLimit(): number {
  const raw = process.env.AI_TOKEN_MONTHLY_LIMIT?.trim();
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 500_000;
}

function sumAiTokenUsage(doc: Record<string, unknown>): number {
  const usage = doc.aiTokenUsage as { totalTokens?: number } | undefined;
  return typeof usage?.totalTokens === "number" && usage.totalTokens > 0 ? usage.totalTokens : 0;
}

const ageLabelMap = Object.fromEntries(AGE_RANGE_OPTIONS.map((o) => [o.value, o.label]));
const occupationLabelMap = Object.fromEntries(
  OCCUPATION_OPTIONS.map((o) => [o.value, o.label]),
);

function resolveLastLoginAt(doc: Record<string, unknown>): { at: string | null; recorded: boolean } {
  const lastLoginAt = doc.lastLoginAt;
  const updatedAt = doc.updatedAt;
  if (lastLoginAt instanceof Date) {
    return { at: lastLoginAt.toISOString(), recorded: true };
  }
  if (updatedAt instanceof Date) {
    return { at: updatedAt.toISOString(), recorded: false };
  }
  return { at: null, recorded: false };
}

export type AdminDashboardData = {
  todayDiagnosisCount: number;
  totalDiagnosisCount: number;
  activeUserCount: number;
  totalUserCount: number;
  recentDiagnoses: Array<{
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    summary: string;
    createdAt: string;
  }>;
  systemStatus: {
    database: { ok: boolean; latencyMs: number | null; message: string };
    api: { ok: boolean; latencyMs: number | null; message: string };
    sentry: { ok: boolean; message: string };
    anthropic: { ok: boolean; message: string };
  };
};

export type AdminUserListItem = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  plan: UserPlan;
  ageRange: string | null;
  occupation: string | null;
  diagnosisCount: number;
  lastLoginAt: string | null;
  createdAt: string | null;
};

export type AdminUserDetail = AdminUserListItem & {
  gender: string | null;
  bio: string;
  emailVerified: string | null;
  updatedAt: string | null;
  lastLoginAtRecorded: boolean;
  diagnoses: Array<{
    id: string;
    summary: string;
    createdAt: string;
  }>;
};

export type AnalyticsPeriod = "day" | "week" | "month";

export type AdminAnalyticsData = {
  period: AnalyticsPeriod;
  diagnosisTrend: Array<{ label: string; count: number }>;
  topCareerPaths: Array<{ path: string; count: number }>;
  completionRate: number;
  usersWithDiagnosis: number;
  totalUsers: number;
  demographics: {
    byAgeRange: Array<{ label: string; count: number }>;
    byOccupation: Array<{ label: string; count: number }>;
  };
  planStats: {
    usersByPlan: Array<{ label: string; plan: UserPlan; count: number }>;
    diagnosesByPlan: Array<{ label: string; plan: UserPlan; count: number }>;
    paidUserRate: number;
    repeatDiagnosisRate: number;
  };
  careerPathCategories: Array<{ category: string; count: number }>;
  qualityMetrics: {
    editedDiagnosisRate: number;
    repeatDiagnosisRate: number;
    diagnosisApiFailureRate: number;
    avgDiagnosesPerActiveUser: number;
    avgAnalysisDurationMs: number;
    avgAnalysisDurationValue: number;
    avgAnalysisDurationUnit: string;
    avgAnalysisDurationDisplay: string;
    monthlyAiTokenTotal: number;
    monthlyAiTokenLimit: number;
    monthlyAiTokenDiagnosisCount: number;
    diagnosisSuccessCount: number;
    diagnosisFailureCount: number;
  };
};

export type AdminErrorLogItem = {
  id: string;
  message: string;
  stack?: string;
  url?: string;
  userId?: string;
  level: "error" | "warning";
  sentryEventId?: string;
  createdAt: string;
};

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const now = new Date();
  const todayStart = startOfDay(now);
  const activeSince = new Date(now);
  activeSince.setDate(activeSince.getDate() - 30);

  const [users, diagnoses] = await Promise.all([getUsersCollection(), getDiagnosesCollection()]);

  const [
    todayDiagnosisCount,
    totalDiagnosisCount,
    totalUserCount,
    activeUserCount,
    recentDocs,
  ] = await Promise.all([
    diagnoses.countDocuments({ createdAt: { $gte: todayStart } }),
    diagnoses.countDocuments({}),
    users.countDocuments({}),
    users.countDocuments({
      $or: [{ lastLoginAt: { $gte: activeSince } }, { updatedAt: { $gte: activeSince } }],
    }),
    diagnoses.find({}).sort({ createdAt: -1 }).limit(5).toArray(),
  ]);

  const userIds = [...new Set(recentDocs.map((doc) => doc.userId?.toString()).filter(Boolean))];
  const userObjectIds = userIds
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));
  const userDocs = userObjectIds.length
    ? await users.find({ _id: { $in: userObjectIds } }).toArray()
    : [];
  const userMap = new Map(userDocs.map((u) => [u._id.toString(), u]));

  const recentDiagnoses = recentDocs.map((doc) => {
    const userId = doc.userId?.toString() ?? "";
    const user = userMap.get(userId);
    const result = doc.result as { summary?: string } | undefined;
    return {
      id: doc._id.toString(),
      userId,
      userName: (user?.name as string | undefined) ?? "不明",
      userEmail: (user?.email as string | undefined) ?? "",
      summary: result?.summary ?? "診断結果",
      createdAt: (doc.createdAt as Date).toISOString(),
    };
  });

  const systemStatus = await fetchSystemStatus();

  return {
    todayDiagnosisCount,
    totalDiagnosisCount,
    activeUserCount,
    totalUserCount,
    recentDiagnoses,
    systemStatus,
  };
}

async function fetchSystemStatus(): Promise<AdminDashboardData["systemStatus"]> {
  let dbOk = false;
  let dbLatency: number | null = null;
  let dbMessage = "未接続";

  if (isMongoConfigured()) {
    const started = Date.now();
    try {
      const client = await getMongoClientPromise();
      await client.db().command({ ping: 1 });
      dbLatency = Date.now() - started;
      dbOk = true;
      dbMessage = "接続正常";
    } catch {
      dbMessage = "接続失敗";
    }
  }

  let apiOk = false;
  let apiLatency: number | null = null;
  let apiMessage = "計測不可";

  if (isMongoConfigured()) {
    const started = Date.now();
    try {
      const diagnoses = await getDiagnosesCollection();
      await diagnoses.estimatedDocumentCount();
      apiLatency = Date.now() - started;
      apiOk = true;
      apiMessage = "応答正常";
    } catch {
      apiMessage = "応答異常";
    }
  }

  return {
    database: { ok: dbOk, latencyMs: dbLatency, message: dbMessage },
    api: { ok: apiOk, latencyMs: apiLatency, message: apiMessage },
    sentry: {
      ok: Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN),
      message: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN ? "設定済み" : "未設定",
    },
    anthropic: {
      ok: Boolean(process.env.ANTHROPIC_API_KEY),
      message: process.env.ANTHROPIC_API_KEY ? "APIキー設定済み" : "未設定",
    },
  };
}

export async function fetchAdminUsers(options: {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole | "all";
}): Promise<{ items: AdminUserListItem[]; total: number }> {
  const { page, limit, search, role } = options;
  const users = await getUsersCollection();
  const diagnoses = await getDiagnosesCollection();

  const filter: Record<string, unknown> = {};
  if (role && role !== "all") {
    filter.role = role;
  }
  if (search?.trim()) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const total = await users.countDocuments(filter);
  const docs = await users
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const userIds = docs.map((doc) => doc._id);
  const diagnosisCounts = userIds.length
    ? await diagnoses
        .aggregate<{ _id: ObjectId; count: number }>([
          { $match: { userId: { $in: userIds } } },
          { $group: { _id: "$userId", count: { $sum: 1 } } },
        ])
        .toArray()
    : [];
  const countMap = new Map(diagnosisCounts.map((item) => [item._id.toString(), item.count]));

  const items: AdminUserListItem[] = docs.map((doc) => {
    const id = doc._id.toString();
    const rawImage = (doc.image as string | undefined) ?? "";
    const lastLogin = resolveLastLoginAt(doc);
    return {
      id,
      name: (doc.name as string | undefined) ?? "",
      email: (doc.email as string | undefined) ?? "",
      image: resolveAvatarUrlForUser(id, rawImage),
      role: normalizeUserRole(doc.role),
      plan: normalizeUserPlan(doc.plan),
      ageRange: (doc.ageRange as string | undefined) ?? null,
      occupation: (doc.occupation as string | undefined) ?? null,
      diagnosisCount: countMap.get(id) ?? 0,
      lastLoginAt: lastLogin.at,
      createdAt: doc.createdAt ? (doc.createdAt as Date).toISOString() : null,
    };
  });

  return { items, total };
}

export async function fetchAdminUserDetail(userId: string): Promise<AdminUserDetail | null> {
  if (!ObjectId.isValid(userId)) return null;

  const users = await getUsersCollection();
  const diagnoses = await getDiagnosesCollection();
  const doc = await users.findOne({ _id: new ObjectId(userId) });
  if (!doc) return null;

  const diagnosisDocs = await diagnoses
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  const diagnosisCount = await diagnoses.countDocuments({ userId: new ObjectId(userId) });

  const id = doc._id.toString();
  const rawImage = (doc.image as string | undefined) ?? "";
  const lastLogin = resolveLastLoginAt(doc);

  return {
    id,
    name: (doc.name as string | undefined) ?? "",
    email: (doc.email as string | undefined) ?? "",
    image: resolveAvatarUrlForUser(id, rawImage),
    role: normalizeUserRole(doc.role),
    plan: normalizeUserPlan(doc.plan),
    gender: (doc.gender as string | undefined) ?? null,
    ageRange: (doc.ageRange as string | undefined) ?? null,
    occupation: (doc.occupation as string | undefined) ?? null,
    bio: (doc.bio as string | undefined) ?? "",
    emailVerified: doc.emailVerified
      ? (doc.emailVerified as Date).toISOString()
      : null,
    diagnosisCount,
    lastLoginAt: lastLogin.at,
    lastLoginAtRecorded: lastLogin.recorded,
    createdAt: doc.createdAt ? (doc.createdAt as Date).toISOString() : null,
    updatedAt: doc.updatedAt ? (doc.updatedAt as Date).toISOString() : null,
    diagnoses: diagnosisDocs.map((d) => ({
      id: d._id.toString(),
      summary: (d.result as { summary?: string } | undefined)?.summary ?? "診断結果",
      createdAt: (d.createdAt as Date).toISOString(),
    })),
  };
}

export async function fetchAdminDiagnosisById(id: string): Promise<DiagnosisDocument | null> {
  if (!ObjectId.isValid(id)) return null;

  const diagnoses = await getDiagnosesCollection();
  const doc = await diagnoses.findOne({ _id: new ObjectId(id) });
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

export async function updateAdminUserRole(
  userId: string,
  role: UserRole,
  actorId: string,
): Promise<boolean> {
  if (!ObjectId.isValid(userId)) return false;
  if (userId === actorId && role !== "admin") return false;

  const users = await getUsersCollection();
  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role, updatedAt: new Date() } },
  );
  return result.matchedCount === 1;
}

export async function fetchAdminAnalytics(period: AnalyticsPeriod): Promise<AdminAnalyticsData> {
  const diagnoses = await getDiagnosesCollection();
  const users = await getUsersCollection();
  const now = new Date();
  const rangeStart = new Date(now);

  if (period === "day") {
    rangeStart.setDate(rangeStart.getDate() - 29);
  } else if (period === "week") {
    rangeStart.setDate(rangeStart.getDate() - 7 * 11);
  } else {
    rangeStart.setMonth(rangeStart.getMonth() - 11);
    rangeStart.setDate(1);
  }

  const monthStart = startOfMonth(now);

  const [diagnosisDocs, totalUsers, usersWithDiagnosisAgg, userDocsWithDiagnosis, allUserDocs, diagnosisApiErrors, monthlyDiagnosisDocs] =
    await Promise.all([
      diagnoses.find({ createdAt: { $gte: rangeStart } }).toArray(),
      users.countDocuments({}),
      diagnoses
        .aggregate<{ count: number }>([{ $group: { _id: "$userId" } }, { $count: "count" }])
        .toArray(),
      users
        .aggregate([
          {
            $lookup: {
              from: "diagnoses",
              localField: "_id",
              foreignField: "userId",
              as: "diagnoses",
            },
          },
          { $match: { "diagnoses.0": { $exists: true } } },
          { $project: { ageRange: 1, occupation: 1 } },
        ])
        .toArray(),
      users.find({}, { projection: { plan: 1 } }).toArray(),
      getErrorLogsCollection().then((col) =>
        col.countDocuments({
          createdAt: { $gte: rangeStart },
          $or: [
            { url: { $regex: /\/api\/diagnosis/i } },
            { message: { $regex: /Diagnosis POST/i } },
          ],
        }),
      ),
      diagnoses
        .find({ createdAt: { $gte: monthStart } }, { projection: { aiTokenUsage: 1 } })
        .toArray(),
    ]);

  const trendMap = new Map<string, number>();
  for (const doc of diagnosisDocs) {
    const createdAt = doc.createdAt as Date;
    const key =
      period === "day"
        ? formatDateKey(createdAt)
        : period === "week"
          ? formatWeekKey(createdAt)
          : formatMonthKey(createdAt);
    trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }

  const diagnosisTrend: Array<{ label: string; count: number }> = [];
  if (period === "day") {
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      diagnosisTrend.push({ label: key.slice(5), count: trendMap.get(key) ?? 0 });
    }
  } else if (period === "week") {
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 7);
      const key = formatWeekKey(d);
      diagnosisTrend.push({ label: key, count: trendMap.get(key) ?? 0 });
    }
  } else {
    for (let i = 11; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = formatMonthKey(d);
      diagnosisTrend.push({ label: key, count: trendMap.get(key) ?? 0 });
    }
  }

  const pathMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();
  for (const category of CAREER_PATH_CATEGORIES) {
    categoryMap.set(category.label, 0);
  }

  const userPlanCache = new Map<string, UserPlan>();
  for (const userDoc of allUserDocs) {
    userPlanCache.set(userDoc._id.toString(), normalizeUserPlan(userDoc.plan));
  }

  const diagnosesByPlanMap = new Map<UserPlan, number>([
    ["free", 0],
    ["standard", 0],
    ["premium", 0],
  ]);
  const periodUserDiagnosisCounts = new Map<string, number>();
  let editedCount = 0;
  let durationTotalMs = 0;
  let durationCount = 0;

  for (const doc of diagnosisDocs) {
    const result = doc.result as
      | {
          careerPathPatternId?: string;
          careerPathHeadline?: string;
          recommendedDirections?: string[];
          summary?: string;
        }
      | undefined;
    if (result) {
      const resolved = getResolvedCareerPath(
        {
          careerPathPatternId: result.careerPathPatternId,
          careerPathHeadline: result.careerPathHeadline,
          recommendedDirections: result.recommendedDirections ?? [],
          summary: result.summary ?? "",
        },
        { answers: doc.answers as DiagnosisAnswers },
      );
      const path = resolved.label.trim();
      if (path) {
        pathMap.set(path, (pathMap.get(path) ?? 0) + 1);
      }
      const pattern = getCareerPathPattern(resolved.patternId);
      const categoryLabel =
        getCareerPathCategory(pattern?.categoryId ?? "specialist")?.label ?? "その他";
      categoryMap.set(categoryLabel, (categoryMap.get(categoryLabel) ?? 0) + 1);
    }

    const userId = doc.userId?.toString() ?? "";
    if (userId) {
      periodUserDiagnosisCounts.set(userId, (periodUserDiagnosisCounts.get(userId) ?? 0) + 1);
      const plan = userPlanCache.get(userId) ?? "free";
      diagnosesByPlanMap.set(plan, (diagnosesByPlanMap.get(plan) ?? 0) + 1);
    }

    if (doc.userEditedAt) {
      editedCount += 1;
    }

    const durationMs = doc.analysisDurationMs as number | undefined;
    if (typeof durationMs === "number" && durationMs > 0) {
      durationTotalMs += durationMs;
      durationCount += 1;
    }
  }
  const topCareerPaths = [...pathMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const careerPathCategories = [...categoryMap.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const usersByPlanMap = new Map<UserPlan, number>([
    ["free", 0],
    ["standard", 0],
    ["premium", 0],
  ]);
  for (const userDoc of allUserDocs) {
    const plan = normalizeUserPlan(userDoc.plan);
    usersByPlanMap.set(plan, (usersByPlanMap.get(plan) ?? 0) + 1);
  }

  const planOrder: UserPlan[] = ["free", "standard", "premium"];
  const usersByPlan = planOrder.map((plan) => ({
    plan,
    label: getPlanAdminLabel(plan),
    count: usersByPlanMap.get(plan) ?? 0,
  }));
  const diagnosesByPlan = planOrder.map((plan) => ({
    plan,
    label: getPlanAdminLabel(plan),
    count: diagnosesByPlanMap.get(plan) ?? 0,
  }));

  const paidUserCount = allUserDocs.filter((doc) => isPaidPlan(normalizeUserPlan(doc.plan))).length;
  const paidUserRate =
    totalUsers > 0 ? Math.round((paidUserCount / totalUsers) * 1000) / 10 : 0;

  const periodActiveUsers = periodUserDiagnosisCounts.size;
  const periodRepeatUsers = [...periodUserDiagnosisCounts.values()].filter((count) => count >= 2).length;
  const repeatDiagnosisRate =
    periodActiveUsers > 0
      ? Math.round((periodRepeatUsers / periodActiveUsers) * 1000) / 10
      : 0;

  const diagnosisSuccessCount = diagnosisDocs.length;
  const diagnosisFailureCount = diagnosisApiErrors;
  const diagnosisApiFailureRate =
    diagnosisSuccessCount + diagnosisFailureCount > 0
      ? Math.round(
          (diagnosisFailureCount / (diagnosisSuccessCount + diagnosisFailureCount)) * 1000,
        ) / 10
      : 0;
  const editedDiagnosisRate =
    diagnosisSuccessCount > 0
      ? Math.round((editedCount / diagnosisSuccessCount) * 1000) / 10
      : 0;
  const avgDiagnosesPerActiveUser =
    periodActiveUsers > 0
      ? Math.round((diagnosisSuccessCount / periodActiveUsers) * 100) / 100
      : 0;
  const avgAnalysisDurationMs =
    durationCount > 0 ? Math.round(durationTotalMs / durationCount) : 0;
  const avgDurationParts = formatDurationParts(avgAnalysisDurationMs);
  const avgAnalysisDurationDisplay = formatDurationMs(avgAnalysisDurationMs);
  const monthlyAiTokenLimit = getMonthlyAiTokenLimit();

  let monthlyAiTokenTotal = 0;
  let monthlyAiTokenDiagnosisCount = 0;
  for (const doc of monthlyDiagnosisDocs) {
    const tokens = sumAiTokenUsage(doc as Record<string, unknown>);
    if (tokens > 0) {
      monthlyAiTokenTotal += tokens;
      monthlyAiTokenDiagnosisCount += 1;
    }
  }

  const usersWithDiagnosis = usersWithDiagnosisAgg[0]?.count ?? 0;
  const completionRate = totalUsers > 0 ? Math.round((usersWithDiagnosis / totalUsers) * 1000) / 10 : 0;

  const ageCounts = new Map<string, number>();
  const occupationCounts = new Map<string, number>();
  for (const doc of userDocsWithDiagnosis) {
    const age = (doc.ageRange as string | undefined) ?? "unknown";
    const occupation = (doc.occupation as string | undefined) ?? "unknown";
    ageCounts.set(age, (ageCounts.get(age) ?? 0) + 1);
    occupationCounts.set(occupation, (occupationCounts.get(occupation) ?? 0) + 1);
  }

  return {
    period,
    diagnosisTrend,
    topCareerPaths,
    completionRate,
    usersWithDiagnosis,
    totalUsers,
    demographics: {
      byAgeRange: [...ageCounts.entries()]
        .map(([value, count]) => ({
          label: ageLabelMap[value] ?? "未設定",
          count,
        }))
        .sort((a, b) => b.count - a.count),
      byOccupation: [...occupationCounts.entries()]
        .map(([value, count]) => ({
          label: occupationLabelMap[value] ?? "未設定",
          count,
        }))
        .sort((a, b) => b.count - a.count),
    },
    planStats: {
      usersByPlan,
      diagnosesByPlan,
      paidUserRate,
      repeatDiagnosisRate,
    },
    careerPathCategories,
    qualityMetrics: {
      editedDiagnosisRate,
      repeatDiagnosisRate,
      diagnosisApiFailureRate,
      avgDiagnosesPerActiveUser,
      avgAnalysisDurationMs,
      avgAnalysisDurationValue: avgDurationParts.value,
      avgAnalysisDurationUnit: avgDurationParts.unit,
      avgAnalysisDurationDisplay,
      monthlyAiTokenTotal,
      monthlyAiTokenLimit,
      monthlyAiTokenDiagnosisCount,
      diagnosisSuccessCount,
      diagnosisFailureCount,
    },
  };
}

export function analyticsToCsv(data: AdminAnalyticsData): string {
  const lines: string[] = [
    "セクション,項目,値",
    "概要,診断完了率(%),"+data.completionRate,
    "概要,診断実施ユーザー数,"+data.usersWithDiagnosis,
    "概要,総ユーザー数,"+data.totalUsers,
  ];
  for (const row of data.diagnosisTrend) {
    lines.push(`診断トレンド,${row.label},${row.count}`);
  }
  for (const row of data.topCareerPaths) {
    lines.push(`人気キャリアパス,"${row.path.replace(/"/g, '""')}",${row.count}`);
  }
  for (const row of data.demographics.byAgeRange) {
    lines.push(`年代別,${row.label},${row.count}`);
  }
  for (const row of data.demographics.byOccupation) {
    lines.push(`職種別,${row.label},${row.count}`);
  }
  for (const row of data.planStats.usersByPlan) {
    lines.push(`プラン別ユーザー,${row.label},${row.count}`);
  }
  for (const row of data.planStats.diagnosesByPlan) {
    lines.push(`プラン別診断数,${row.label},${row.count}`);
  }
  lines.push(`プラン別,有料ユーザー率(%),${data.planStats.paidUserRate}`);
  lines.push(`プラン別,再診断率(%),${data.planStats.repeatDiagnosisRate}`);
  for (const row of data.careerPathCategories) {
    lines.push(`キャリアパスカテゴリ,"${row.category.replace(/"/g, '""')}",${row.count}`);
  }
  lines.push(`品質,結果編集率(%),${data.qualityMetrics.editedDiagnosisRate}`);
  lines.push(`品質,再診断率(%),${data.qualityMetrics.repeatDiagnosisRate}`);
  lines.push(`品質,診断API失敗率(%),${data.qualityMetrics.diagnosisApiFailureRate}`);
  lines.push(`品質,1ユーザー平均診断回数,${data.qualityMetrics.avgDiagnosesPerActiveUser}`);
  lines.push(
    `品質,診断平均時間,${data.qualityMetrics.avgAnalysisDurationDisplay}`,
  );
  lines.push(
    `品質,今月のAIトークン合計,${data.qualityMetrics.monthlyAiTokenTotal}`,
  );
  lines.push(
    `品質,今月のAIトークン上限,${data.qualityMetrics.monthlyAiTokenLimit}`,
  );
  return `\uFEFF${lines.join("\n")}`;
}

export async function fetchAdminErrorLogs(options: {
  page: number;
  limit: number;
}): Promise<{ items: AdminErrorLogItem[]; total: number }> {
  const { page, limit } = options;
  const errorLogs = await getErrorLogsCollection();
  const total = await errorLogs.countDocuments({});
  const docs = await errorLogs
    .find({})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    total,
    items: docs.map((doc) => ({
      id: doc._id.toString(),
      message: (doc.message as string | undefined) ?? "Unknown error",
      stack: doc.stack as string | undefined,
      url: doc.url as string | undefined,
      userId: doc.userId as string | undefined,
      level: (doc.level as "error" | "warning" | undefined) ?? "error",
      sentryEventId: doc.sentryEventId as string | undefined,
      createdAt: (doc.createdAt as Date).toISOString(),
    })),
  };
}

export async function ensureUserRoleDefaults(): Promise<void> {
  const users = await getUsersCollection();
  await users.updateMany({ role: { $exists: false } }, { $set: { role: DEFAULT_USER_ROLE } });
}

export async function bootstrapAdminByEmail(email: string): Promise<void> {
  if (!email.trim()) return;
  const users = await getUsersCollection();
  await users.updateOne({ email }, { $set: { role: "admin", updatedAt: new Date() } });
}

/** ADMIN_EMAILS（カンマ区切り）を優先。未設定時は ADMIN_BOOTSTRAP_EMAIL を使用 */
export function getAdminBootstrapEmails(): string[] {
  const fromList = process.env.ADMIN_EMAILS?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  if (fromList?.length) return fromList;

  const single = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim();
  return single ? [single] : [];
}
