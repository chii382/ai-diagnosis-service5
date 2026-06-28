"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DiagnosisDeepAnalysisChart from "@/app/components/diagnosis/DiagnosisDeepAnalysisChart";
import DiagnosisRadarChart from "@/app/components/diagnosis/DiagnosisRadarChart";
import PremiumSandstormOverlay from "@/app/components/diagnosis/PremiumSandstormOverlay";
import { glassCardSx } from "@/app/components/member/memberStyles";
import { jpTextSx } from "@/lib/typography";
import {
  buildDeepAnalysisChartData,
  buildRadarChartData,
} from "@/lib/diagnosis/chart-data";
import type { DiagnosisDocument } from "@/lib/diagnosis/types";
import { canViewPremiumCharts, type UserPlan } from "@/lib/plan";

interface DiagnosisPremiumChartsSectionProps {
  diagnosis: DiagnosisDocument;
  plan?: UserPlan;
}

export default function DiagnosisPremiumChartsSection({
  diagnosis,
  plan = "free",
}: DiagnosisPremiumChartsSectionProps) {
  const unlocked = canViewPremiumCharts(plan);
  const radarData = buildRadarChartData(diagnosis.answers);
  const deepAnalysisData = buildDeepAnalysisChartData(diagnosis.answers, diagnosis.result);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          詳細分析グラフ
        </Typography>
        {!unlocked && (
          <Chip
            icon={<LockOutlinedIcon sx={{ fontSize: "16px !important" }} />}
            label="有料プラン限定"
            size="small"
            className="premium-upgrade-badge"
            sx={{
              backgroundColor: "rgba(56,123,255,0.18)",
              color: "#93c5fd",
              border: "1px solid rgba(96,165,250,0.35)",
              fontWeight: 700,
            }}
          />
        )}
      </Stack>

      <Card sx={{ ...glassCardSx, position: "relative", overflow: "hidden" }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 }, position: "relative", overflow: "hidden" }}>
            <Box
              className={unlocked ? undefined : "premium-locked-charts"}
              aria-hidden={!unlocked}
              sx={unlocked ? undefined : { pointerEvents: "none", userSelect: "none" }}
            >
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DiagnosisRadarChart data={radarData} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DiagnosisDeepAnalysisChart data={deepAnalysisData} />
                </Grid>
              </Grid>
            </Box>

            {!unlocked && <PremiumSandstormOverlay />}

            {!unlocked && (
              <Box
                role="region"
                aria-label="有料プランへのアップグレード案内"
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: { xs: 2, md: 3 },
                  pointerEvents: "none",
                }}
              >
                <Card
                  className="premium-upgrade-card"
                  sx={{
                    pointerEvents: "auto",
                    maxWidth: 480,
                    width: "100%",
                    backgroundColor: "rgba(8,12,24,0.82)",
                    border: "1px solid rgba(96,165,250,0.35)",
                    backdropFilter: "blur(10px)",
                  }}
                >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Box
                    className="premium-lock-icon"
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(56,123,255,0.35) 0%, rgba(34,211,238,0.2) 100%)",
                      border: "1px solid rgba(147,197,253,0.45)",
                    }}
                  >
                    <LockOutlinedIcon sx={{ fontSize: 28, color: "#93c5fd" }} />
                  </Box>

                  <Stack spacing={0.75}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.1rem", md: "1.2rem" },
                        letterSpacing: "0.04em",
                        background: "linear-gradient(90deg, #fff 0%, #93c5fd 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      有料プラン限定コンテンツ
                    </Typography>
                    <Stack spacing={0.75} sx={{ width: "100%" }}>
                      <Typography
                        sx={{
                          ...jpTextSx,
                          color: "rgba(255,255,255,0.78)",
                          lineHeight: 1.85,
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          whiteSpace: { xs: "normal", sm: "nowrap" },
                          wordBreak: { xs: "keep-all", sm: "normal" },
                        }}
                      >
                        このエリアの内容は、有料プランの会員のみ閲覧できます。
                      </Typography>
                      <Typography
                        sx={{
                          ...jpTextSx,
                          color: "rgba(255,255,255,0.78)",
                          lineHeight: 1.85,
                          fontSize: { xs: "0.85rem", sm: "0.9rem" },
                          whiteSpace: { xs: "normal", sm: "nowrap" },
                          wordBreak: { xs: "keep-all", sm: "normal" },
                        }}
                      >
                        アップグレードすると、すべての分析結果を確認できます。
                      </Typography>
                    </Stack>
                  </Stack>

                  <Button
                    component={Link}
                    href="/#pricing"
                    variant="contained"
                    size="large"
                    fullWidth
                    className="premium-upgrade-btn"
                    sx={{
                      py: 1.35,
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      background: "linear-gradient(90deg, #387bff 0%, #22d3ee 50%, #387bff 100%)",
                      boxShadow: "0 8px 32px rgba(56,123,255,0.45)",
                      "&:hover": {
                        boxShadow: "0 12px 40px rgba(56,123,255,0.55)",
                      },
                    }}
                  >
                    有料プランにアップグレード
                  </Button>
                </Stack>
              </CardContent>
            </Card>
              </Box>
            )}
          </CardContent>
        </Card>
    </Stack>
  );
}
