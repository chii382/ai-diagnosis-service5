import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AdminNav from "@/app/components/admin/AdminNav";
import StatCard from "@/app/components/admin/StatCard";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";
import MemberNav from "@/app/components/member/MemberNav";
import { adminGlassCardSx } from "@/app/components/admin/adminStyles";
import { adminAccessDeniedPath } from "@/lib/admin/require-admin";
import { fetchAdminDashboard } from "@/lib/admin/server";
import { isAdminRole } from "@/lib/user/types";

export const metadata = {
  title: "管理者ダッシュボード | AIキャリア診断",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/admin");
  if (!isAdminRole(session.user.role)) redirect(adminAccessDeniedPath());

  const data = await fetchAdminDashboard();

  return (
    <Box sx={{ position: "relative", minHeight: "100svh", overflow: "hidden" }}>
      <MemberCinematicBackground />
      <MemberNav />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 3, md: 5 } }}>
        <AdminNav />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="本日の診断数" value={data.todayDiagnosisCount} accent="#60a5fa" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="総診断数" value={data.totalDiagnosisCount} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="アクティブユーザー"
              value={data.activeUserCount}
              helper="直近30日"
              accent="#4ade80"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard label="総ユーザー数" value={data.totalUserCount} accent="#c084fc" />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card sx={adminGlassCardSx}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2 }}>最近の診断結果</Typography>
                <Stack spacing={1.5}>
                  {data.recentDiagnoses.length === 0 && (
                    <Typography sx={{ color: "rgba(255,255,255,0.55)" }}>
                      診断データがありません
                    </Typography>
                  )}
                  {data.recentDiagnoses.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        border: "1px solid rgba(255,255,255,0.1)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }} noWrap>
                        {item.summary}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>
                        {item.userName} · {new Date(item.createdAt).toLocaleString("ja-JP")}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={2}>
              <Card sx={adminGlassCardSx}>
                <CardContent>
                  <Typography sx={{ fontWeight: 700, mb: 2 }}>システムステータス</Typography>
                  <Stack spacing={1.5}>
                    <StatusRow
                      label="データベース"
                      ok={data.systemStatus.database.ok}
                      detail={`${data.systemStatus.database.message}${
                        data.systemStatus.database.latencyMs != null
                          ? ` (${data.systemStatus.database.latencyMs}ms)`
                          : ""
                      }`}
                    />
                    <StatusRow
                      label="API応答"
                      ok={data.systemStatus.api.ok}
                      detail={`${data.systemStatus.api.message}${
                        data.systemStatus.api.latencyMs != null
                          ? ` (${data.systemStatus.api.latencyMs}ms)`
                          : ""
                      }`}
                    />
                    <StatusRow
                      label="Sentry"
                      ok={data.systemStatus.sentry.ok}
                      detail={data.systemStatus.sentry.message}
                    />
                    <StatusRow
                      label="Anthropic API"
                      ok={data.systemStatus.anthropic.ok}
                      detail={data.systemStatus.anthropic.message}
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={adminGlassCardSx}>
                <CardContent>
                  <Typography sx={{ fontWeight: 700, mb: 2 }}>クイックアクション</Typography>
                  <Stack spacing={1}>
                    <Button
                      component={Link}
                      href="/admin/users"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ justifyContent: "space-between", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                    >
                      ユーザー管理
                    </Button>
                    <Button
                      component={Link}
                      href="/admin/analytics"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ justifyContent: "space-between", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                    >
                      分析レポート
                    </Button>
                    <Button
                      component={Link}
                      href="/admin/errors"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ justifyContent: "space-between", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
                    >
                      エラーログ
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function StatusRow({ label, ok, detail }: { label: string; ok: boolean; detail: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {ok ? (
        <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 18 }} />
      ) : (
        <ErrorOutlineIcon sx={{ color: "#f87171", fontSize: 18 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>{label}</Typography>
        <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>{detail}</Typography>
      </Box>
      <Chip label={ok ? "OK" : "NG"} size="small" color={ok ? "success" : "error"} />
    </Stack>
  );
}
