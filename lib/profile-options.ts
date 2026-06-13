export const GENDER_OPTIONS = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
] as const;

export const AGE_RANGE_OPTIONS = [
  { value: "10s", label: "10代" },
  { value: "20s", label: "20代" },
  { value: "30s", label: "30代" },
  { value: "40s", label: "40代" },
  { value: "50s", label: "50代" },
  { value: "60s", label: "60代" },
  { value: "70s", label: "70代" },
] as const;

export const OCCUPATION_OPTIONS = [
  { value: "office_worker", label: "会社員（事務・総合職）" },
  { value: "engineer", label: "エンジニア・IT" },
  { value: "sales", label: "営業" },
  { value: "marketing", label: "マーケティング・広報" },
  { value: "designer", label: "デザイナー・クリエイター" },
  { value: "consultant", label: "コンサルタント" },
  { value: "manager", label: "管理職・経営者" },
  { value: "medical", label: "医療・福祉" },
  { value: "education", label: "教育・研究" },
  { value: "service", label: "サービス・接客" },
  { value: "manufacturing", label: "製造・技術職" },
  { value: "freelance", label: "フリーランス・自営業" },
  { value: "student", label: "学生" },
  { value: "part_time", label: "パート・アルバイト" },
  { value: "other", label: "その他" },
] as const;

export type GenderValue = (typeof GENDER_OPTIONS)[number]["value"];
export type AgeRangeValue = (typeof AGE_RANGE_OPTIONS)[number]["value"];
export type OccupationValue = (typeof OCCUPATION_OPTIONS)[number]["value"];

export const BIO_MAX_LENGTH = 500;

export function parseOptionalSelect(
  value: unknown,
  allowed: Set<string>,
): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  return allowed.has(value) ? value : null;
}

export function parseBio(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, BIO_MAX_LENGTH);
}
