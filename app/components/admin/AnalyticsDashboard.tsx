"use client";

import { useCallback, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminGlassCardSx } from "@/app/components/admin/adminStyles";
import StatCard from "@/app/components/admin/StatCard";
import type { AdminAnalyticsData, AnalyticsPeriod } from "@/lib/admin/server";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(8,12,24,0.95)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    color: "#fff",
  },
};

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("day");
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    startProcessingPending();
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "取得に失敗しました");
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得に失敗しました");
    } finally {
      setLoading(false);
      stopProcessingPending();
    }
  }, [period]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExport = () => {
    window.location.href = `/api/admin/analytics/export?period=${period}`;
  };

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Tabs
          value={period}
          onChange={(_, value: AnalyticsPeriod) => setPeriod(value)}
          sx={{
            "& .MuiTab-root": { color: "rgba(255,255,255,0.65)" },
            "& .Mui-selected": { color: "#fff !important" },
            "& .MuiTabs-indicator": { backgroundColor: "#60a5fa" },
          }}
        >
          <Tab label="日別" value="day" />
          <Tab label="週別" value="week" />
          <Tab label="月別" value="month" />
        </Tabs>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          sx={{ borderColor: "rgba(255,255,255,0.25)", color: "#fff" }}
        >
          CSVエクスポート
        </Button>
      </Stack>

      {data && mounted && (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard label="診断完了率" value={`${data.completionRate}%`} accent="#4ade80" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                label="診断実施ユーザー"
                value={data.usersWithDiagnosis}
                helper={`総ユーザー ${data.totalUsers}`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                label="期間内診断数"
                value={data.diagnosisTrend.reduce((sum, row) => sum + row.count, 0)}
                helper={period === "day" ? "直近30日" : period === "week" ? "直近12週" : "直近12ヶ月"}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
            プラン別分析
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="有料ユーザー率"
                value={`${data.planStats.paidUserRate}%`}
                helper={`総ユーザー ${data.totalUsers} 名`}
                accent="#f472b6"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                label="再診断率"
                value={`${data.planStats.repeatDiagnosisRate}%`}
                helper="期間内に2回以上診断したユーザーの割合"
                accent="#a78bfa"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ ...adminGlassCardSx, height: "100%" }}>
                <CardContent>
                  <Typography sx={{ mb: 1.5, fontWeight: 600, fontSize: "0.95rem" }}>
                    プラン別ユーザー数
                  </Typography>
                  <Box sx={{ width: "100%", height: 160 }}>
                    <ResponsiveContainer>
                      <BarChart data={data.planStats.usersByPlan}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                        <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                        <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                        <Bar dataKey="count" name="ユーザー数" fill="#f472b6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ ...adminGlassCardSx, height: "100%" }}>
                <CardContent>
                  <Typography sx={{ mb: 1.5, fontWeight: 600, fontSize: "0.95rem" }}>
                    プラン別診断数
                  </Typography>
                  <Box sx={{ width: "100%", height: 160 }}>
                    <ResponsiveContainer>
                      <BarChart data={data.planStats.diagnosesByPlan}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                        <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                        <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                        <Bar dataKey="count" name="診断数" fill="#818cf8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={adminGlassCardSx}>
            <CardContent>
              <Typography sx={{ mb: 2, fontWeight: 600 }}>診断数トレンド</Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={data.diagnosisTrend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="診断数"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ ...adminGlassCardSx, height: "100%" }}>
                <CardContent>
                  <Typography sx={{ mb: 2, fontWeight: 600 }}>人気キャリアパス TOP10</Typography>
                  <Box sx={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart data={data.topCareerPaths} layout="vertical" margin={{ left: 8, right: 16 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                        <XAxis type="number" stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                        <YAxis
                          type="category"
                          dataKey="path"
                          width={180}
                          stroke="rgba(255,255,255,0.5)"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                        <Bar dataKey="count" name="件数" fill="#818cf8" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Card sx={adminGlassCardSx}>
                  <CardContent>
                    <Typography sx={{ mb: 2, fontWeight: 600 }}>年代別傾向</Typography>
                    <Box sx={{ width: "100%", height: 140 }}>
                      <ResponsiveContainer>
                        <BarChart data={data.demographics.byAgeRange}>
                          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" fontSize={11} />
                          <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                          <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                          <Bar dataKey="count" fill="#34d399" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={adminGlassCardSx}>
                  <CardContent>
                    <Typography sx={{ mb: 2, fontWeight: 600 }}>職種別傾向</Typography>
                    <Box sx={{ width: "100%", height: 140 }}>
                      <ResponsiveContainer>
                        <BarChart data={data.demographics.byOccupation.slice(0, 8)}>
                          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                          <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                          <Bar dataKey="count" fill="#fbbf24" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Card sx={adminGlassCardSx}>
            <CardContent>
              <Typography sx={{ mb: 2, fontWeight: 600 }}>キャリアパスカテゴリ別（9分類）</Typography>
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={data.careerPathCategories}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="category"
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={11}
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={72}
                    />
                    <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                    <Tooltip contentStyle={chartTooltipStyle.contentStyle} />
                    <Bar dataKey="count" name="件数" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
            診断品質メトリクス
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                label="結果編集率"
                value={`${data.qualityMetrics.editedDiagnosisRate}%`}
                helper="ユーザーが結果を手動編集した割合"
                accent="#fb923c"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                label="再診断率"
                value={`${data.qualityMetrics.repeatDiagnosisRate}%`}
                helper="期間内に2回以上診断"
                accent="#a78bfa"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                label="診断API失敗率"
                value={`${data.qualityMetrics.diagnosisApiFailureRate}%`}
                helper={`成功 ${data.qualityMetrics.diagnosisSuccessCount} / 失敗 ${data.qualityMetrics.diagnosisFailureCount}`}
                accent="#f87171"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                label="1ユーザー平均診断回数"
                value={data.qualityMetrics.avgDiagnosesPerActiveUser}
                helper="期間内の診断実施ユーザーあたり"
                accent="#34d399"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard
                label="平均AI分析時間"
                value={
                  data.qualityMetrics.avgAnalysisDurationSec !== null
                    ? `${data.qualityMetrics.avgAnalysisDurationSec}秒`
                    : "—"
                }
                helper={
                  data.qualityMetrics.avgAnalysisDurationSec !== null
                    ? "診断APIの処理時間"
                    : "新規診断からデータ蓄積中"
                }
                accent="#60a5fa"
              />
            </Grid>
          </Grid>
        </>
      )}

      {loading && !data && (
        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>読み込み中...</Typography>
      )}
    </Stack>
  );
}
