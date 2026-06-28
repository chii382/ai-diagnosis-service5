export type UserPlan = "free" | "standard" | "premium";

export const DEFAULT_USER_PLAN: UserPlan = "free";

/** 確認用: true の間は有料チャートをモザイクなしで表示 */
export const PREVIEW_PREMIUM_CHARTS = false;

export function normalizeUserPlan(plan: unknown): UserPlan {
  if (plan === "standard" || plan === "premium") return plan;
  return "free";
}

export function isPaidPlan(plan: UserPlan): boolean {
  return plan !== "free";
}

export function canViewPremiumCharts(plan: UserPlan): boolean {
  if (PREVIEW_PREMIUM_CHARTS) return true;
  return plan !== "free";
}

/** 詳細な診断結果・ロードマップ・分析グラフを閲覧できるか */
export function canViewPremiumContent(plan: UserPlan): boolean {
  return canViewPremiumCharts(plan);
}

/** 診断結果の手動編集が可能か（全プランで利用可） */
export function canEditDiagnosisResult(_plan: UserPlan): boolean {
  return true;
}

export function getDefaultUserPlan(): UserPlan {
  return DEFAULT_USER_PLAN;
}

/** 管理画面向けの短いプラン表示 */
export function getPlanAdminLabel(plan: UserPlan): string {
  switch (plan) {
    case "standard":
      return "有料（スタンダード）";
    case "premium":
      return "有料（宇宙級）";
    default:
      return "無料";
  }
}

/** 会員画面向けのプラン表示（ダッシュボード等） */
export function getPlanLabel(plan: UserPlan): string {
  switch (plan) {
    case "standard":
      return "有料スタンダードプラン";
    case "premium":
      return "有料宇宙級プラン";
    default:
      return "無料プラン";
  }
}

/** プランバッジのステータスドット色 */
export function getPlanIndicatorStyle(plan: UserPlan): { color: string; glow: string } {
  switch (plan) {
    case "standard":
      return { color: "#fb923c", glow: "rgba(251,146,60,0.85)" };
    case "premium":
      return { color: "#c084fc", glow: "rgba(192,132,252,0.85)" };
    default:
      return { color: "#4ade80", glow: "rgba(74,222,128,0.85)" };
  }
}
