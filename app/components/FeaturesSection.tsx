import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { SvgIconComponent } from "@mui/icons-material";
import PanelBackground from "@/app/components/common/PanelBackground";

interface Reason {
  icon: SvgIconComponent;
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    icon: AccessTimeIcon,
    title: "5問・約3分で完了",
    description:
      "忙しい方でも、すき間時間で終わります。\n質問に答えるだけです。",
  },
  {
    icon: PsychologyIcon,
    title: "深く読み解くAI",
    description:
      "表面的な回答だけでなく、\n背景まで踏まえて強みを整理します。",
  },
  {
    icon: TrackChangesIcon,
    title: "一人ひとりに合わせた提案",
    description:
      "型にはめないアドバイス。\n今のあなたに必要な内容だけをお届けします。",
  },
  {
    icon: MonetizationOnOutlinedIcon,
    title: "無料プランから利用可能",
    description:
      "まずは無料で体験できます。\nより詳しい分析は、\nスタンダード・宇宙級プランで\n順次提供予定です。",
  },
  {
    icon: PersonAddOutlinedIcon,
    title: "会員登録で履歴を保存",
    description:
      "Googleアカウントでログインすれば、\nプロフィールと診断履歴をいつでも確認できます。",
  },
  {
    icon: VerifiedOutlinedIcon,
    title: "専門家「あきらパパ」監修",
    description:
      "キャリア支援の専門家が監修。\n現場の知見に基づく、信頼できる診断です。",
  },
];

export default function FeaturesSection() {
  return (
    <Box
      id="features"
      component="section"
      sx={{
        position: "relative",
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        py: { xs: 10, md: 12 },
      }}
    >
      <PanelBackground
        src="/images/features-six-bg.png"
        position="center"
        overlay="linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.72) 100%)"
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 600,
              letterSpacing: "0.35em",
            }}
          >
            WHY CHOOSE US
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: "#fff", fontSize: { xs: "1.85rem", md: "2.6rem" }, lineHeight: 1.25 }}
          >
            <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
              選ばれる
            </Box>
            <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
              6つの理由
            </Box>
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <Grid key={r.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 10px 36px rgba(0,0,0,0.25)",
                    transition: "transform .25s ease, border-color .25s ease, background-color .25s ease",
                    "&:hover": {
                      transform: { md: "translateY(-4px)" },
                      backgroundColor: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(167,139,250,0.4)",
                    },
                  }}
                >
                  <Stack spacing={1.5} alignItems="center" textAlign="center">
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(167,139,250,0.15)",
                        border: "1px solid rgba(167,139,250,0.35)",
                      }}
                    >
                      <Icon sx={{ fontSize: 28, color: "#c4b5fd" }} />
                    </Box>
                    <Typography
                      variant="h3"
                      sx={{
                        color: "#fff",
                        fontSize: { xs: "1rem", md: "1.08rem" },
                        lineHeight: 1.45,
                      }}
                    >
                      {r.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.72)",
                        fontSize: { xs: "0.84rem", md: "0.88rem" },
                        lineHeight: 1.75,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {r.description}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
