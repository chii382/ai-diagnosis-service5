"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import ExploreIcon from "@mui/icons-material/Explore";
import { jpTextSx } from "@/lib/typography";

/** ログイン画面専用（dashboard-hero 等と混同しない） */
const SIGNIN_BG = "/images/signin-bg.png";

interface SignInFormProps {
  authConfigured?: boolean;
  callbackUrl?: string;
}

export default function SignInForm({
  authConfigured = false,
  callbackUrl = "/dashboard",
}: SignInFormProps) {
  const [signingIn, setSigningIn] = useState(false);

  async function handleGoogleSignIn() {
    if (signingIn || !authConfigured) return;
    setSigningIn(true);
    startProcessingPending();
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setSigningIn(false);
      stopProcessingPending();
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <Box aria-hidden sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        <Box
          component="img"
          src={SIGNIN_BG}
          alt=""
          decoding="async"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: { xs: "28% center", md: "center center" },
            filter: "brightness(1.18) contrast(1.1) saturate(1.12)",
            transform: "translateZ(0)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.12) 52%, rgba(0,0,0,0.32) 100%),
              radial-gradient(ellipse 85% 65% at 50% 45%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.28) 100%)
            `,
          }}
        />
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Card
          sx={{
            backgroundColor: "rgba(8, 12, 24, 0.82)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.45)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <ExploreIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  AIキャリア診断
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                  会員ログイン
                </Typography>
                <Typography
                  sx={{
                    ...jpTextSx,
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.85,
                    fontSize: { xs: "0.98rem", sm: "1.05rem" },
                    letterSpacing: "0.04em",
                  }}
                >
                  あなたの中の宇宙への扉を開きましょう
                </Typography>
              </Stack>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!authConfigured || signingIn}
                startIcon={<GoogleIcon />}
                onClick={() => void handleGoogleSignIn()}
                sx={{ py: 1.4, maxWidth: 360 }}
              >
                {signingIn ? "ログイン中..." : "Googleでログイン"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
