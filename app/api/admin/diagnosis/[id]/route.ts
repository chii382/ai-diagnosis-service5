import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { fetchAdminDiagnosisById } from "@/lib/admin/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { id } = await context.params;
  try {
    const diagnosis = await fetchAdminDiagnosisById(id);
    if (!diagnosis) {
      return NextResponse.json({ error: "診断結果が見つかりません" }, { status: 404 });
    }
    return NextResponse.json(diagnosis);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "診断結果の取得に失敗しました" },
      { status: 500 },
    );
  }
}
