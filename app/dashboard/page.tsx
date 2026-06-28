import Alert from "@mui/material/Alert";
import Link from "next/link";
import { buildProfileHref } from "@/lib/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MemberNav from "@/app/components/member/MemberNav";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";
import {
  ADMIN_ACCESS_DENIED_MESSAGE,
  ADMIN_ACCESS_DENIED_QUERY,
} from "@/lib/admin/require-admin";
import { jpTextSx } from "@/lib/typography";
import { fetchUserProfileForUser } from "@/lib/user/server";
import PlanStatusBadge from "@/app/components/member/PlanStatusBadge";

export const metadata = {
  title: "ダッシュボード | AIキャリア診断",
};

export const dynamic = "force-dynamic";

const glassCardSx = {
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.42)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
  transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
  "@media (hover: hover)": {
    "&:hover": {
      borderColor: "rgba(96,165,250,0.35)",
      boxShadow: "0 20px 56px rgba(56,123,255,0.12)",
      transform: "translateY(-2px)",
    },
  },
} as const;

const linkButtonSx = {
  justifyContent: "center",
  py: 1.1,
  px: 2.25,
  minWidth: { xs: "100%", sm: 220 },
  color: "rgba(255,255,255,0.88)",
  borderRadius: 2,
  border: "1px solid rgba(255,255,255,0.1)",
  backgroundColor: "rgba(255,255,255,0.04)",
  fontSize: { xs: "0.84rem", sm: "0.875rem" },
  whiteSpace: "nowrap",
  "&:hover": {
    backgroundColor: "rgba(56,123,255,0.12)",
    borderColor: "rgba(96,165,250,0.35)",
  },
} as const;

type DashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { error } = await searchParams;
  const adminAccessDenied = error === ADMIN_ACCESS_DENIED_QUERY;

  const dbUser = await fetchUserProfileForUser(session.user.id);
  if (!dbUser) {
    redirect("/auth/signin");
  }

  const displayName = dbUser.name || session.user.name || "会員";
  const displayImage = dbUser.image || session.user.image || null;
  const displayEmail = dbUser.email || session.user.email || "";
  const plan = dbUser.plan;

  return (
    <Box sx={{ position: "relative", minHeight: "100svh", overflowX: "hidden" }}>
      <MemberCinematicBackground />

      <Box className="dashboard-content-float" sx={{ position: "relative", zIndex: 1 }}>
        <MemberNav
          userName={displayName}
          userImage={displayImage}
          transparent
        />

        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Stack spacing={{ xs: 4, md: 5 }}>
            {adminAccessDenied && (
              <Alert severity="error" sx={{ maxWidth: 720 }}>
                {ADMIN_ACCESS_DENIED_MESSAGE}
              </Alert>
            )}
            <Stack spacing={2} sx={{ maxWidth: 720 }}>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: { xs: "0.68rem", md: "0.75rem" },
                  fontWeight: 600,
                  letterSpacing: "0.35em",
                }}
              >
                MEMBER AREA
              </Typography>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.85rem", sm: "2.5rem", md: "3rem" },
                  lineHeight: 1.2,
                  textShadow: "0 0 40px rgba(56,123,255,0.25)",
                }}
              >
                ようこそ、{displayName} さん
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.78)",
                  maxWidth: 640,
                  lineHeight: 1.85,
                  fontSize: { xs: "0.95rem", md: "1.05rem" },
                }}
              >
                <Box component="span" sx={{ display: "block" }}>
                  まずはプロフィールを入力してから、キャリア診断を始めましょう。
                </Box>
                <Box component="span" sx={{ display: "block" }}>
                  情報が増えるほど、あなたへの提案はより的確になります。
                </Box>
                <Box component="span" sx={{ display: "block" }}>
                  診断結果の確認や履歴の参照も、こちらから行えます。
                </Box>
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.72)",
                  fontSize: "0.78rem",
                  lineHeight: 1.6,
                }}
              >
                スタンダード・宇宙級プランは順次公開予定
              </Typography>
            </Stack>

            <Stack spacing={{ xs: 2, md: 2.5 }}>
            <Card sx={{ ...glassCardSx, height: "auto" }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack spacing={2.5}>
                  <Stack spacing={0.75}>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.28em",
                      }}
                    >
                      YOUR PROFILE
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.72)",
                        fontSize: { xs: "0.85rem", md: "0.92rem" },
                        lineHeight: 1.7,
                      }}
                    >
                      プロフィールを入力すると、診断結果の精度が上がります。診断の前にご確認ください。
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar
                      src={displayImage ?? undefined}
                      alt={displayName}
                      sx={{
                        width: 72,
                        height: 72,
                        border: "2px solid rgba(255,255,255,0.18)",
                        boxShadow: "0 0 24px rgba(56,123,255,0.2)",
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        spacing={2.5}
                        alignItems="center"
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mb: 0.75, rowGap: 1 }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                          {displayName || "未設定"}
                        </Typography>
                        <PlanStatusBadge plan={plan} />
                      </Stack>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
                        {displayEmail}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    component={Link}
                    href={buildProfileHref("/dashboard")}
                    variant="outlined"
                    fullWidth
                    startIcon={<PersonOutlineIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.35,
                      px: 2,
                      borderRadius: 2,
                      borderColor: "rgba(96,165,250,0.5)",
                      color: "rgba(255,255,255,0.92)",
                      backgroundColor: "rgba(56,123,255,0.12)",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "rgba(147,197,253,0.75)",
                        backgroundColor: "rgba(56,123,255,0.2)",
                        boxShadow: "0 0 24px rgba(56,123,255,0.18)",
                      },
                    }}
                  >
                    プロフィール設定
                  </Button>
                  <Button
                    component={Link}
                    href="/#pricing"
                    variant="contained"
                    fullWidth
                    startIcon={<WorkspacePremiumOutlinedIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.35,
                      px: 2,
                      borderRadius: 2,
                      fontWeight: 700,
                      color: "#fff",
                      background: "linear-gradient(90deg, #f97316 0%, #fb923c 55%, #fbbf24 100%)",
                      boxShadow: "0 8px 28px rgba(249,115,22,0.35)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #fb923c 0%, #fdba74 55%, #fcd34d 100%)",
                        boxShadow: "0 12px 36px rgba(249,115,22,0.45)",
                      },
                    }}
                  >
                    料金プランを変更する
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Box
              component={Link}
              href="/diagnosis"
              sx={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                borderRadius: 3,
                overflow: "hidden",
                position: "relative",
                border: "1px solid rgba(147,197,253,0.45)",
                background:
                  "linear-gradient(135deg, rgba(56,123,255,0.38) 0%, rgba(34,211,238,0.16) 42%, rgba(56,123,255,0.22) 100%)",
                boxShadow:
                  "0 12px 56px rgba(56,123,255,0.32), inset 0 1px 0 rgba(255,255,255,0.14)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                "@media (hover: hover)": {
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "rgba(147,197,253,0.65)",
                    boxShadow:
                      "0 20px 64px rgba(56,123,255,0.42), inset 0 1px 0 rgba(255,255,255,0.18)",
                  },
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 55% 80% at 100% 50%, rgba(34,211,238,0.22), transparent 58%)",
                  pointerEvents: "none",
                },
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2.5, sm: 3 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                sx={{ position: "relative", p: { xs: 2.5, md: 3.25 } }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      width: { xs: 52, md: 60 },
                      height: { xs: 52, md: 60 },
                      borderRadius: 2.5,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, rgba(56,123,255,0.55) 0%, rgba(34,211,238,0.35) 100%)",
                      border: "1px solid rgba(147,197,253,0.5)",
                      boxShadow: "0 0 28px rgba(56,123,255,0.35)",
                    }}
                  >
                    <PsychologyOutlinedIcon sx={{ fontSize: { xs: 28, md: 32 }, color: "#fff" }} />
                  </Box>
                  <Stack spacing={0.75}>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.65)",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.28em",
                      }}
                    >
                      CORE FEATURE
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.25rem", md: "1.45rem" },
                        lineHeight: 1.35,
                        textShadow: "0 0 24px rgba(56,123,255,0.35)",
                      }}
                    >
                      キャリア診断を始める
                    </Typography>
                    <Typography
                      sx={{
                        ...jpTextSx,
                        color: "rgba(255,255,255,0.78)",
                        fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.95rem" },
                        lineHeight: 1.7,
                        whiteSpace: "nowrap",
                      }}
                    >
                      5問・約3分で、AIがあなた専用の強み分析とキャリアロードマップを生成します。
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  startIcon={<AutoAwesomeIcon />}
                  tabIndex={-1}
                  sx={{
                    alignSelf: { xs: "stretch", sm: "center" },
                    py: 1.35,
                    px: { xs: 2.5, md: 3 },
                    fontWeight: 800,
                    fontSize: { xs: "0.92rem", md: "1rem" },
                    whiteSpace: "nowrap",
                    borderRadius: 2.5,
                    background: "linear-gradient(90deg, #387bff 0%, #22d3ee 100%)",
                    boxShadow: "0 8px 32px rgba(56,123,255,0.45)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #4d8bff 0%, #3dd9f0 100%)",
                      boxShadow: "0 12px 40px rgba(56,123,255,0.55)",
                    },
                  }}
                >
                  診断を始める
                </Button>
              </Stack>
            </Box>
            </Stack>

            <Box sx={{ maxWidth: 720, width: "100%" }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                useFlexGap
                sx={{
                  pt: { xs: 0.5, md: 1 },
                  justifyContent: { sm: "flex-start" },
                }}
              >
                <Button
                  component={Link}
                  href="/diagnosis/history"
                  startIcon={<HistoryOutlinedIcon />}
                  sx={linkButtonSx}
                >
                  診断履歴を見る
                </Button>
                <Button
                  component={Link}
                  href="/"
                  startIcon={<HomeOutlinedIcon />}
                  sx={linkButtonSx}
                >
                  トップページ（LP）へ戻る
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
