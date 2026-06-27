import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { fetchAdminAnalytics, type AnalyticsPeriod } from "@/lib/admin/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parsePeriod(value: string | null): AnalyticsPeriod {
  if (value === "week" || value === "month") return value;
  return "day";
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return adminUnauthorizedResponse();
  if (session.user.role !== "admin") return adminForbiddenResponse();

  const { searchParams } = new URL(request.url);
  const period = parsePeriod(searchParams.get("period"));

  try {
    const data = await fetchAdminAnalytics(period);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "分析データの取得に失敗しました" },
      { status: 500 },
    );
  }
}
