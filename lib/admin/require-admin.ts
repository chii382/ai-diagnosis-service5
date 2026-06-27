import { auth } from "@/auth";
import { isAdminRole } from "@/lib/user/types";
import { NextResponse } from "next/server";

export {
  ADMIN_ACCESS_DENIED_MESSAGE,
  ADMIN_ACCESS_DENIED_QUERY,
  adminAccessDeniedPath,
} from "@/lib/admin/access-denied";

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!isAdminRole(session.user.role)) return null;
  return session;
}

export function adminForbiddenResponse() {
  return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
}

export function adminUnauthorizedResponse() {
  return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
}
