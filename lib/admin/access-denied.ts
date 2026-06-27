/** Edge middleware からも import 可（Node.js / MongoDB 依存なし） */

export const ADMIN_ACCESS_DENIED_QUERY = "admin_required";
export const ADMIN_ACCESS_DENIED_MESSAGE = "管理者以外はアクセスできません";

export function adminAccessDeniedPath(): string {
  return `/dashboard?error=${ADMIN_ACCESS_DENIED_QUERY}`;
}
