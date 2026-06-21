export type UserPlan = "free" | "standard" | "premium";

/** 確認用: true の間は有料チャートをモザイクなしで表示 */
export const PREVIEW_PREMIUM_CHARTS = false;

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
  return "free";
}

export function getPlanLabel(plan: UserPlan): string {
  switch (plan) {
    case "standard":
      return "スタンダードプラン";
    case "premium":
      return "宇宙級プラン";
    default:
      return "無料プラン";
  }
}
