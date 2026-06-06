import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CTAButton from "@/app/components/common/CTAButton";
import CosmicVideoBackground from "@/app/components/common/CosmicVideoBackground";

export default function HeroSection() {
  return (
    <Box
      component="section"
      className="snap"
      sx={{
        position: "relative",
        minHeight: { xs: "82svh", md: "86svh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <CosmicVideoBackground
        image="/images/hero-cosmos.png"
        position="center 30%"
        overlay="linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.55) 100%)"
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" textAlign="center">
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 600,
              letterSpacing: "0.35em",
            }}
          >
            AI CAREER DIAGNOSIS
          </Typography>

          <Typography
            variant="h1"
            sx={{
              color: "#fff",
              fontSize: { xs: "2.4rem", sm: "3.4rem", md: "4.75rem" },
              textShadow: "0 0 40px rgba(56,123,255,0.35)",
            }}
          >
            5問でわかる、
            <br />
            あなたのキャリア
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontSize: { xs: "1rem", md: "1.2rem" },
              maxWidth: 640,
              lineHeight: 1.8,
            }}
          >
            AIがあなたに最適なキャリアロードマップを提案します
          </Typography>

          <Box sx={{ pt: 1 }}>
            <CTAButton appearance="solid" />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
