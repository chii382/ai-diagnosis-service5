import type { ReactNode } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HistoryIcon from "@mui/icons-material/History";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DiagnosisPdfExportButton, {
  DIAGNOSIS_RESULT_EXPORT_ROOT_ID,
} from "@/app/components/diagnosis/DiagnosisPdfExportButton";
import DiagnosisEditActionButton from "@/app/components/diagnosis/DiagnosisEditActionButton";
import DiagnosisAnswersRecap from "@/app/components/diagnosis/DiagnosisAnswersRecap";
import DiagnosisPremiumChartsSection from "@/app/components/diagnosis/DiagnosisPremiumChartsSection";
import FreePlanBadge from "@/app/components/diagnosis/FreePlanBadge";
import PlanStatusBadge from "@/app/components/member/PlanStatusBadge";
import PlanUpgradeNotice from "@/app/components/diagnosis/PlanUpgradeNotice";
import RoadmapBriefBody from "@/app/components/diagnosis/RoadmapBriefBody";
import RoadmapPhaseBody from "@/app/components/diagnosis/RoadmapPhaseBody";
import JpBulletText from "@/app/components/common/JpBulletText";
import { getCareerPathDisplayLabel } from "@/lib/diagnosis/career-path-display";
import {
  FREE_PLAN_ROADMAP_NOTICE,
  getResultForPlan,
  getRoadmapForPlan,
} from "@/lib/diagnosis/plan-content";
import { buildDiagnosisEditHref, resolveDiagnosisReturnTo } from "@/lib/diagnosis/navigation";
import type {
  CareerRoadmap,
  CareerRoadmapBrief,
  CareerRoadmapPhase,
  DiagnosisDocument,
} from "@/lib/diagnosis/types";
import { glassCardSx, eyebrowSx } from "@/app/components/member/memberStyles";
import { canEditDiagnosisResult, canViewPremiumContent, type UserPlan } from "@/lib/plan";
import { jpBodyTextSx } from "@/lib/typography";

const outlinedActionButtonSx = {
  borderColor: "rgba(255,255,255,0.2)",
  color: "rgba(255,255,255,0.85)",
  whiteSpace: "nowrap",
} as const;

interface DiagnosisResultViewProps {
  diagnosis: DiagnosisDocument;
  plan: UserPlan;
  showActions?: boolean;
  returnTo?: string;
}

function RoadmapCard({
  title,
  period,
  children,
  badge,
}: {
  title: string;
  period: string;
  children: ReactNode;
  badge?: string;
}) {
  return (
    <Card sx={{ ...glassCardSx, height: "100%", minWidth: 0 }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
            <Chip
              label={period}
              size="small"
              sx={{ backgroundColor: "rgba(56,123,255,0.18)" }}
            />
            {badge === "無料版" ? (
              <FreePlanBadge compact />
            ) : badge ? (
              <Chip label={badge} size="small" sx={{ backgroundColor: "rgba(56,123,255,0.18)" }} />
            ) : null}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function DiagnosisResultView({
  diagnosis,
  plan,
  showActions = true,
  returnTo,
}: DiagnosisResultViewProps) {
  const resultReturnTo = resolveDiagnosisReturnTo(diagnosis._id, returnTo);
  const created = new Date(diagnosis.createdAt).toLocaleString("ja-JP");
  const isPremium = canViewPremiumContent(plan);
  const canEdit = canEditDiagnosisResult(plan);
  const result = getResultForPlan(diagnosis, plan);
  const roadmap = getRoadmapForPlan(diagnosis, plan);
  const isDetailedRoadmap = (value: CareerRoadmap | CareerRoadmapBrief): value is CareerRoadmap =>
    "shortTerm" in value && "goals" in value.shortTerm;

  const roadmapPhases: {
    title: string;
    key: keyof CareerRoadmap;
  }[] = [
    { title: "短期", key: "shortTerm" },
    { title: "中期", key: "midTerm" },
    { title: "長期", key: "longTerm" },
  ];

  return (
    <Stack spacing={3}>
      <Box id={DIAGNOSIS_RESULT_EXPORT_ROOT_ID}>
      <DiagnosisAnswersRecap answers={diagnosis.answers} createdAt={created} />

      <Stack spacing={1.5} alignItems="center" sx={{ py: 0.5, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(56,123,255,0.25) 0%, rgba(34,211,238,0.15) 100%)",
            border: "1px solid rgba(96,165,250,0.3)",
            color: "#93c5fd",
            fontSize: "1.1rem",
            lineHeight: 1,
          }}
          aria-hidden
        >
          ↓
        </Box>
        <Typography sx={{ ...eyebrowSx, color: "rgba(147,197,253,0.85)" }}>
          AI ANALYSIS
        </Typography>
      </Stack>

      <Card
        sx={{
          ...glassCardSx,
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          backgroundColor: "rgba(8,12,24,0.9)",
          border: "1px solid rgba(96,165,250,0.35)",
          boxShadow:
            "0 20px 56px rgba(0,0,0,0.5), 0 0 40px rgba(56,123,255,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #387bff 0%, #22d3ee 50%, #387bff 100%)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, pt: { xs: 3, md: 3.5 } }}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography sx={eyebrowSx}>DIAGNOSIS RESULT</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "1rem", md: "1.05rem" } }}>
                AI診断結果
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              className="diagnosis-result-summary"
              sx={{
                fontWeight: 700,
                lineHeight: 1.55,
                fontSize: { xs: "1.15rem", md: "1.35rem" },
                background: "linear-gradient(90deg, #fff 0%, rgba(147,197,253,0.95) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {result.summary}
            </Typography>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 700 }}>あなたの強み</Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {result.strengths.map((item) => (
                  <Chip key={item} label={item} sx={{ backgroundColor: "rgba(56,123,255,0.15)" }} />
                ))}
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography sx={{ fontWeight: 700 }}>おすすめの方向性</Typography>
              <Stack spacing={0.5}>
                {result.recommendedDirections.map((item) => (
                  <JpBulletText key={item}>{item}</JpBulletText>
                ))}
              </Stack>
            </Stack>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.28)",
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>ずばりあなたのキャリアパスは？</Typography>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.05rem", md: "1.15rem" },
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {getCareerPathDisplayLabel(result)}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(56,123,255,0.1)",
                border: "1px solid rgba(96,165,250,0.25)",
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1 }}>AIからのアドバイス</Typography>
              <Typography sx={{ ...jpBodyTextSx, flex: "unset", color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}>
                {result.advice}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isPremium ? "詳細キャリアロードマップ" : "キャリアロードマップ"}
          </Typography>
          <PlanStatusBadge plan={plan} />
        </Stack>
        {!isPremium && (
          <PlanUpgradeNotice
            intro={FREE_PLAN_ROADMAP_NOTICE.intro}
            highlight={FREE_PLAN_ROADMAP_NOTICE.highlight}
          />
        )}
        <Grid container spacing={2}>
          {roadmapPhases.map(({ title, key }) => {
            if (isDetailedRoadmap(roadmap)) {
              const phase = roadmap[key] as CareerRoadmapPhase;
              return (
                <Grid key={key} size={{ xs: 12, lg: 4 }} sx={{ minWidth: 0 }}>
                  <RoadmapCard title={title} period={phase.period}>
                    <RoadmapPhaseBody phase={phase} />
                  </RoadmapCard>
                </Grid>
              );
            }

            const phase = roadmap[key];
            return (
              <Grid key={key} size={{ xs: 12, lg: 4 }} sx={{ minWidth: 0 }}>
                <RoadmapCard title={title} period={phase.period} badge="無料版">
                  <RoadmapBriefBody phase={phase} />
                </RoadmapCard>
              </Grid>
            );
          })}
        </Grid>
      </Stack>

      <DiagnosisPremiumChartsSection diagnosis={diagnosis} plan={plan} />
      </Box>

      {showActions && (
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          flexWrap="wrap"
          useFlexGap
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
            <DiagnosisPdfExportButton
              plan={plan}
              diagnosisId={diagnosis._id}
              createdAt={diagnosis.createdAt}
            />
            <DiagnosisEditActionButton
              editHref={buildDiagnosisEditHref(diagnosis._id, resultReturnTo)}
              unlocked={canEdit}
            />
            <Button
              component={Link}
              href="/diagnosis/history"
              variant="outlined"
              startIcon={<HistoryIcon />}
              sx={outlinedActionButtonSx}
            >
              履歴一覧
            </Button>
            <Button component={Link} href="/diagnosis" variant="contained">
              もう一度診断する
            </Button>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            useFlexGap
            flexWrap="wrap"
            sx={{ ml: { lg: "auto" } }}
          >
            <Button
              component={Link}
              href="/dashboard"
              variant="outlined"
              startIcon={<DashboardOutlinedIcon />}
              sx={outlinedActionButtonSx}
            >
              ダッシュボードに戻る
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              startIcon={<HomeOutlinedIcon />}
              sx={outlinedActionButtonSx}
            >
              LPに戻る
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
