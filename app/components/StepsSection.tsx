import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import { SvgIconComponent } from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InsightsIcon from "@mui/icons-material/Insights";
import StarIcon from "@mui/icons-material/Star";
import PanelBackground from "@/app/components/common/PanelBackground";

interface Step {
  no: string;
  title: string;
  description: string;
  icon: SvgIconComponent;
  accent: string;
  glow: string;
  highlight?: boolean;
}

const steps: Step[] = [
  {
    no: "01",
    title: "質問に答える",
    description: "5つの質問に、直感で答えるだけ。\n所要時間は約3分です。",
    icon: EditNoteIcon,
    accent: "#22d3ee",
    glow: "rgba(34,211,238,0.25)",
  },
  {
    no: "02",
    title: "AIが分析する",
    description:
      "強み・適性・見逃されがちな可能性を、\n回答から見つけ出します。",
    icon: AutoAwesomeIcon,
    accent: "#ff3d81",
    glow: "rgba(255,61,129,0.32)",
    highlight: true,
  },
  {
    no: "03",
    title: "結果を受け取る",
    description: "あなたに合ったアドバイスと、\n次の一歩をわかりやすくお届けします。",
    icon: InsightsIcon,
    accent: "#a855f7",
    glow: "rgba(168,85,247,0.25)",
  },
];

export default function StepsSection() {
  return (
    <Box
      id="steps"
      component="section"
      className="snap"
      sx={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        py: { xs: 12, md: 0 },
      }}
    >
      <PanelBackground
        src="/images/steps-dark.png"
        position="center"
        overlay="linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)"
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: { xs: 6, md: 9 } }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 600,
              letterSpacing: "0.35em",
            }}
          >
            HOW IT WORKS
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: "#fff", fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.25 }}
          >
            <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
              3ステップで、
            </Box>
            <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
              診断完了
            </Box>
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <Grid key={s.no} size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    p: { xs: 3.5, md: 4 },
                    borderRadius: 3,
                    textAlign: "center",
                    border: `1px solid ${s.accent}${s.highlight ? "" : "55"}`,
                    background: `linear-gradient(180deg, ${s.accent}14 0%, rgba(0,0,0,0.5) 65%)`,
                    backdropFilter: "blur(3px)",
                    boxShadow: s.highlight
                      ? `0 0 0 1px ${s.accent}, 0 18px 60px ${s.glow}`
                      : `0 10px 40px ${s.glow}`,
                    transform: { md: s.highlight ? "translateY(-14px)" : "none" },
                    transition: "transform .3s ease, box-shadow .3s ease",
                    "&:hover": {
                      transform: { md: s.highlight ? "translateY(-18px)" : "translateY(-6px)" },
                      boxShadow: `0 0 0 1px ${s.accent}, 0 20px 70px ${s.glow}`,
                    },
                  }}
                >
                  {s.highlight && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -14,
                        left: "50%",
                        transform: "translateX(-50%)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 999,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        backgroundColor: s.accent,
                        color: "#0a0a0a",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        boxShadow: `0 0 18px ${s.glow}`,
                      }}
                    >
                      <StarIcon sx={{ fontSize: 14 }} />
                      ポイント
                    </Box>
                  )}

                  <Box
                    sx={{
                      width: 76,
                      height: 76,
                      mx: "auto",
                      mb: 2.5,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${s.accent}80`,
                      background: `radial-gradient(circle, ${s.accent}33 0%, transparent 70%)`,
                    }}
                  >
                    <Icon sx={{ fontSize: 38, color: s.accent }} />
                  </Box>

                  <Typography
                    sx={{
                      color: s.accent,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      mb: 1,
                    }}
                  >
                    STEP {s.no}
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{ color: "#fff", fontSize: { xs: "1.35rem", md: "1.5rem" }, mb: 1.5 }}
                  >
                    {s.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.72)",
                      fontSize: "0.95rem",
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {s.description}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
