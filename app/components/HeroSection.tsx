import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LoggedOutCTA from "@/app/components/common/LoggedOutCTA";
import CosmicVideoBackground from "@/app/components/common/CosmicVideoBackground";
import HeroTypewriterText from "@/app/components/hero/HeroTypewriterText";

export default function HeroSection() {
  return (
    <Box
      id="top"
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
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: { xs: 1.25, sm: 2, md: 2.5 },
              width: "100%",
              maxWidth: 560,
              justifyContent: "center",
              px: { xs: 1, sm: 0 },
            }}
          >
            <Box
              aria-hidden
              sx={{
                flex: 1,
                height: "1px",
                maxWidth: { xs: 56, sm: 80, md: 96 },
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 35%, rgba(96,165,250,0.55) 100%)",
              }}
            />
            <Typography
              component="p"
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: { xs: "0.82rem", sm: "0.95rem", md: "1.08rem" },
                fontWeight: 600,
                letterSpacing: { xs: "0.26em", sm: "0.32em", md: "0.38em" },
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                textShadow: "0 0 28px rgba(56,123,255,0.25)",
              }}
            >
              AI CAREER DIAGNOSIS
            </Typography>
            <Box
              aria-hidden
              sx={{
                flex: 1,
                height: "1px",
                maxWidth: { xs: 56, sm: 80, md: 96 },
                background:
                  "linear-gradient(270deg, transparent 0%, rgba(255,255,255,0.15) 35%, rgba(96,165,250,0.55) 100%)",
              }}
            />
          </Box>

          <Typography
            variant="h1"
            className="hero-headline"
            sx={{
              color: "#fff",
              fontSize: { xs: "2.35rem", sm: "3.4rem", md: "4.75rem" },
              lineHeight: 1.22,
              textShadow: "0 0 40px rgba(56,123,255,0.35)",
            }}
          >
            <span className="hero-headline-line hero-headline-line-1">5問、3分で、</span>
            <span className="hero-headline-line hero-headline-line-2">
              <span className="hero-headline-phrase">あなたの人生は</span>
              <span className="hero-headline-phrase hero-headline-phrase-accent">変わる。</span>
            </span>
          </Typography>

          <HeroTypewriterText />

          <LoggedOutCTA appearance="solid" />
        </Stack>
      </Container>
    </Box>
  );
}
