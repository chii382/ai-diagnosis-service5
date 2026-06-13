import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MemberNav from "@/app/components/member/MemberNav";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";

export const metadata = {
  title: "ダッシュボード | AIキャリア診断",
};

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

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const { user } = session;

  return (
    <Box sx={{ position: "relative", minHeight: "100svh", overflow: "hidden" }}>
      <MemberCinematicBackground />

      <Box className="dashboard-content-float" sx={{ position: "relative", zIndex: 1 }}>
        <MemberNav
          userName={user.name}
          userImage={user.image}
          transparent
        />

        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Stack spacing={{ xs: 4, md: 5 }}>
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
                <Box component="span" sx={{ display: "block" }}>
                  ようこそ、
                </Box>
                <Box component="span" sx={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {user.name ?? "会員"} さん
                </Box>
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
                  会員専用エリアへようこそ。
                </Box>
                <Box component="span" sx={{ display: "block" }}>
                  診断結果の確認、プロフィールの編集はこちらから。
                </Box>
                <Box component="span" sx={{ display: "block" }}>
                  情報が増えるほど、あなたへの提案はより的確になります。
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

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={glassCardSx}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack spacing={2.5}>
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
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={user.image ?? undefined}
                          alt={user.name ?? "ユーザー"}
                          sx={{
                            width: 64,
                            height: 64,
                            border: "2px solid rgba(255,255,255,0.18)",
                            boxShadow: "0 0 24px rgba(56,123,255,0.2)",
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {user.name ?? "未設定"}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)" }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          p: { xs: 2, md: 2.25 },
                          borderRadius: 2.5,
                          background:
                            "linear-gradient(135deg, rgba(56,123,255,0.32) 0%, rgba(34,211,238,0.14) 48%, rgba(99,102,241,0.1) 100%)",
                          border: "1px solid rgba(147,197,253,0.55)",
                          boxShadow:
                            "0 0 36px rgba(56,123,255,0.22), inset 0 1px 0 rgba(255,255,255,0.14)",
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                          <Box
                            aria-hidden
                            sx={{
                              width: 9,
                              height: 9,
                              borderRadius: "50%",
                              flexShrink: 0,
                              backgroundColor: "#4ade80",
                              boxShadow: "0 0 12px rgba(74,222,128,0.85)",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              letterSpacing: "0.14em",
                              color: "rgba(255,255,255,0.82)",
                            }}
                          >
                            ご利用中のプラン
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: { xs: "1.2rem", md: "1.3rem" },
                            fontWeight: 700,
                            color: "#fff",
                            letterSpacing: "0.06em",
                            textShadow: "0 0 24px rgba(147,197,253,0.45)",
                          }}
                        >
                          無料プラン
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={glassCardSx}>
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack spacing={2}>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          letterSpacing: "0.28em",
                        }}
                      >
                        LINKS
                      </Typography>
                      <Stack spacing={1}>
                        <Button
                          component={Link}
                          href="/profile"
                          startIcon={<PersonOutlineIcon />}
                          sx={{
                            justifyContent: "flex-start",
                            py: 1.25,
                            px: 1.5,
                            color: "rgba(255,255,255,0.9)",
                            borderRadius: 2,
                            border: "1px solid rgba(255,255,255,0.08)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            "&:hover": {
                              backgroundColor: "rgba(56,123,255,0.12)",
                              borderColor: "rgba(96,165,250,0.3)",
                            },
                          }}
                        >
                          プロフィール設定
                        </Button>
                        <Button
                          component={Link}
                          href="/"
                          startIcon={<HomeOutlinedIcon />}
                          sx={{
                            justifyContent: "flex-start",
                            py: 1.25,
                            px: 1.5,
                            color: "rgba(255,255,255,0.9)",
                            borderRadius: 2,
                            border: "1px solid rgba(255,255,255,0.08)",
                            backgroundColor: "rgba(255,255,255,0.03)",
                            "&:hover": {
                              backgroundColor: "rgba(56,123,255,0.12)",
                              borderColor: "rgba(96,165,250,0.3)",
                            },
                          }}
                        >
                          トップページ（LP）へ戻る
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
