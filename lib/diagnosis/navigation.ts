const DEFAULT_RESULT_PATH = (id: string) => `/diagnosis/${id}`;

/** 編集後の戻り先 URL を安全に解決する（アプリ内の診断関連パスのみ許可） */
export function resolveDiagnosisReturnTo(
  diagnosisId: string,
  returnTo?: string | null,
): string {
  const fallback = DEFAULT_RESULT_PATH(diagnosisId);
  if (!returnTo?.trim()) return fallback;

  const path = returnTo.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (!path.startsWith("/diagnosis/")) return fallback;

  return path;
}

export function buildDiagnosisEditHref(diagnosisId: string, returnTo: string): string {
  return `/diagnosis/${diagnosisId}/edit?returnTo=${encodeURIComponent(returnTo)}`;
}
