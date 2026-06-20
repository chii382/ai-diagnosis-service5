"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { DeepAnalysisChartData } from "@/lib/diagnosis/chart-data";

interface DiagnosisDeepAnalysisChartProps {
  data: DeepAnalysisChartData;
}

export default function DiagnosisDeepAnalysisChart({ data }: DiagnosisDeepAnalysisChartProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontWeight: 700, mb: 2 }}>より深い分析データ</Typography>
      <Stack spacing={1.75}>
        {data.items.map((item) => (
          <Box key={item.label}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.82)" }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#93c5fd" }}>
                {item.score}
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 10,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${item.score}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #387bff 0%, #22d3ee 100%)",
                  boxShadow: "0 0 16px rgba(56,123,255,0.35)",
                  transition: "width 0.8s ease",
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
