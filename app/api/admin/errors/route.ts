import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { fetchAdminErrorLogs } from "@/lib/admin/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));

  try {
    const data = await fetchAdminErrorLogs({ page, limit });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "エラーログの取得に失敗しました" },
      { status: 500 },
    );
  }
}
