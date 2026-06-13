"use client";

import { signIn } from "next-auth/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import ExploreIcon from "@mui/icons-material/Explore";

interface SignInFormProps {
  authConfigured?: boolean;
  callbackUrl?: string;
}

export default function SignInForm({
  authConfigured = false,
  callbackUrl = "/dashboard",
}: SignInFormProps) {

  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(900px 500px at 50% 0%, rgba(56,123,255,0.18), transparent 60%), #0a1020",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
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
                <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  Googleアカウントでログインすれば、
                  <br />
                  診断結果とプロフィールを一括で管理できます。
                </Typography>
              </Stack>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!authConfigured}
                startIcon={<GoogleIcon />}
                onClick={() => signIn("google", { callbackUrl })}
                sx={{ py: 1.4, maxWidth: 360 }}
              >
                Googleでログイン
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
