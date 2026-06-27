import { auth } from "@/auth";
import { adminForbiddenResponse, adminUnauthorizedResponse } from "@/lib/admin/require-admin";
import { analyticsToCsv, fetchAdminAnalytics, type AnalyticsPeriod } from "@/lib/admin/server";
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
    const csv = analyticsToCsv(data);
    const filename = `analytics-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "CSVの生成に失敗しました" },
      { status: 500 },
    );
  }
}
