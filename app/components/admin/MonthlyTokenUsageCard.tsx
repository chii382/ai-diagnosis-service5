"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminChartBox from "@/app/components/admin/AdminChartBox";
import { adminGlassCardSx } from "@/app/components/admin/adminStyles";

const chartTooltipStyle = {
  contentStyle: {
    backgroundColor: "rgba(8,12,24,0.95)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8,
    color: "#fff",
  },
};

interface MonthlyTokenUsageCardProps {
  used: number;
  limit: number;
  diagnosisCount: number;
}

export default function MonthlyTokenUsageCard({
  used,
  limit,
  diagnosisCount,
}: MonthlyTokenUsageCardProps) {
  const remaining = Math.max(limit - used, 0);
  const usageRate = limit > 0 ? Math.min(Math.round((used / limit) * 1000) / 10, 100) : 0;
  const chartData = [{ label: "今月", used, remaining }];

  return (
    <Card sx={{ ...adminGlassCardSx, height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mb: 1.5 }}>
          今月のAIトークン使用量
        </Typography>

        <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mb: 2 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "#f472b6", lineHeight: 1, fontSize: "2.5rem" }}
          >
            {used.toLocaleString("ja-JP")}
          </Typography>
          <Typography sx={{ fontWeight: 600, color: "rgba(251,207,232,0.9)", fontSize: "0.95rem" }}>
            トークン
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>
            使用率: {usageRate}%
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.72rem" }}>
            集計: {diagnosisCount} 件
          </Typography>
        </Stack>

        <AdminChartBox height={140}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
              <XAxis
                type="number"
                stroke="rgba(255,255,255,0.45)"
                fontSize={11}
                tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
                domain={[0, limit]}
              />
              <YAxis
                type="category"
                dataKey="label"
                stroke="rgba(255,255,255,0.45)"
                fontSize={11}
                width={40}
              />
              <Tooltip
                contentStyle={chartTooltipStyle.contentStyle}
                formatter={(value, name) => {
                  const numeric = typeof value === "number" ? value : Number(value ?? 0);
                  return [
                    `${numeric.toLocaleString("ja-JP")} トークン`,
                    name === "used" ? "使用済み" : "残り",
                  ];
                }}
              />
              <Legend
                wrapperStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                formatter={(value) => (value === "used" ? "使用済み" : "残り（上限まで）")}
              />
              <Bar dataKey="used" stackId="tokens" fill="#f472b6" name="used" radius={[4, 0, 0, 4]} />
              <Bar
                dataKey="remaining"
                stackId="tokens"
                fill="rgba(255,255,255,0.12)"
                name="remaining"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
        </AdminChartBox>
      </CardContent>
    </Card>
  );
}
