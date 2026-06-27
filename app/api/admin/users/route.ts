import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { fetchAdminUsers } from "@/lib/admin/server";
import type { UserRole } from "@/lib/user/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));
  const search = searchParams.get("search") ?? undefined;
  const roleParam = searchParams.get("role");
  const role: UserRole | "all" =
    roleParam === "admin" || roleParam === "user" ? roleParam : "all";

  try {
    const data = await fetchAdminUsers({ page, limit, search, role });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ユーザー一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
}
