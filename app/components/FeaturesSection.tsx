import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { SvgIconComponent } from "@mui/icons-material";
import PanelBackground from "@/app/components/common/PanelBackground";

interface Feature {
  no: string;
  icon: SvgIconComponent;
  title: string;
  description: string;
  image: string;
}

const FEATURE_OVERLAY =
  "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 48%, rgba(0,0,0,0.05) 100%)";

const features: Feature[] = [
  {
    no: "01",
    icon: AccessTimeIcon,
    title: "たった5問・3分で完了",
    description:
      "忙しくてもスキマ時間でOK。5つの質問に直感で答えるだけで、診断が完了します。",
    image: "/images/feature-blue.png",
  },
  {
    no: "02",
    icon: PsychologyIcon,
    title: "AIが深く分析",
    description:
      "あなたの回答からAIが強み・適性・価値観を多角的に分析。客観的な視点であなたを捉えます。",
    image: "/images/feature-indigo.png",
  },
  {
    no: "03",
    icon: AutoAwesomeIcon,
    title: "パーソナライズされた提案",
    description:
      "分析結果をもとに、あなただけのキャリアロードマップを提案。次の一歩が明確になります。",
    image: "/images/feature-teal.png",
  },
];

export default function FeaturesSection() {
  return (
    <Box id="features">
      {features.map((f) => {
        const Icon = f.icon;
        return (
          <Box
            key={f.no}
            component="section"
            sx={{
              position: "relative",
              minHeight: { xs: 420, md: 500 },
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
              backgroundColor: "#000",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <PanelBackground
              src={f.image}
              position="center"
              overlay={FEATURE_OVERLAY}
            />
            <Container
              maxWidth="lg"
              sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 7 } }}
            >
              <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ maxWidth: 620 }}>
                <Icon
                  sx={{
                    fontSize: { xs: 40, md: 52 },
                    color: "rgba(255,255,255,0.92)",
                  }}
                />
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    fontWeight: 600,
                    letterSpacing: "0.35em",
                  }}
                >
                  FEATURE {f.no}
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "2rem", sm: "2.6rem", md: "3.25rem" },
                  }}
                >
                  {f.title}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: { xs: "1rem", md: "1.15rem" },
                    lineHeight: 1.9,
                  }}
                >
                  {f.description}
                </Typography>
              </Stack>
            </Container>
          </Box>
        );
      })}
    </Box>
  );
}
