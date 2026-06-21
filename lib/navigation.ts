const ALLOWED_RETURN_PREFIXES = ["/dashboard", "/diagnosis", "/profile"] as const;

function isAllowedReturnPath(path: string): boolean {
  const pathname = path.split("?")[0];
  return ALLOWED_RETURN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** 編集・保存後の戻り先 URL を安全に解決する */
export function resolveInternalReturnTo(
  fallback: string,
  returnTo?: string | null,
): string {
  if (!returnTo?.trim()) return fallback;

  const path = returnTo.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (!isAllowedReturnPath(path)) return fallback;

  return path;
}

export function buildProfileHref(returnTo: string): string {
  return `/profile?returnTo=${encodeURIComponent(returnTo)}`;
}
