import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { fetchAdminDashboard } from "@/lib/admin/server";
import { isAdminRole } from "@/lib/user/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (!isAdminRole(session.user.role)) return adminForbiddenResponse();

  try {
    const data = await fetchAdminDashboard();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ダッシュボードの取得に失敗しました" },
      { status: 500 },
    );
  }
}
