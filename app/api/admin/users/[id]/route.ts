import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { fetchAdminUserDetail, updateAdminUserRole } from "@/lib/admin/server";
import { normalizeUserRole, type UserRole } from "@/lib/user/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { id } = await context.params;
  try {
    const user = await fetchAdminUserDetail(id);
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ユーザー詳細の取得に失敗しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストが不正です" }, { status: 400 });
  }

  const roleRaw = (body as { role?: unknown }).role;
  const role: UserRole = normalizeUserRole(roleRaw);
  if (roleRaw !== "admin" && roleRaw !== "user") {
    return NextResponse.json({ error: "ロールは admin または user を指定してください" }, { status: 400 });
  }

  if (id === session.user.id && role !== "admin") {
    return NextResponse.json({ error: "自分自身の admin 権限は解除できません" }, { status: 400 });
  }

  try {
    const ok = await updateAdminUserRole(id, role, session.user.id);
    if (!ok) {
      return NextResponse.json({ error: "ロールの更新に失敗しました" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, role });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ロールの更新に失敗しました" },
      { status: 500 },
    );
  }
}
