import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CTAButton from "@/app/components/common/CTAButton";
import CosmicVideoBackground from "@/app/components/common/CosmicVideoBackground";

export default function CTASection() {
  return (
    <Box
      component="section"
      className="snap"
      sx={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <CosmicVideoBackground
        image="/images/cta-cosmos.png"
        position="center top"
        rise
        overlay="linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.55) 24%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0) 66%, rgba(0,0,0,0.25) 100%)"
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pt: { xs: 9, md: 11 } }}>
        <Stack spacing={{ xs: 2.5, md: 3 }} alignItems="center" textAlign="center">
          <Typography
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 600,
              letterSpacing: "0.35em",
            }}
          >
            START NOW
          </Typography>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontSize: { xs: "2.1rem", sm: "3rem", md: "3.75rem" },
              textShadow: "0 0 40px rgba(56,123,255,0.4)",
            }}
          >
            さあ、あなたの
            <br />
            キャリアを見つけよう
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.75)",
              fontSize: { xs: "1rem", md: "1.15rem" },
              maxWidth: 560,
              lineHeight: 1.9,
            }}
          >
            5問に答えるだけ。今すぐ無料で、あなただけのキャリアロードマップを手に入れましょう。
          </Typography>
          <Box sx={{ pt: 1 }}>
            <CTAButton appearance="solid" />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
