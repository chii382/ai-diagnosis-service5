"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { signOut } from "next-auth/react";

const authButtonSx = {
  ml: { xs: 0.5, md: 1 },
  flexShrink: 0,
  fontSize: { xs: "0.72rem", md: "0.8rem" },
  fontWeight: 600,
  letterSpacing: "0.06em",
  px: { xs: 1.25, md: 2 },
  py: 0.75,
  whiteSpace: "nowrap",
} as const;

export default function HeaderAuthActions() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  useEffect(() => {
    if (status !== "loading") {
      setLoadingTimedOut(false);
      return;
    }

    const timer = window.setTimeout(() => setLoadingTimedOut(true), 4000);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (status === "loading" && !loadingTimedOut) {
    return (
      <Box
        sx={{
          ml: { xs: 0.5, md: 1 },
          width: { xs: 72, md: 88 },
          height: 34,
          borderRadius: 3,
          flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      />
    );
  }

  if (!user) {
    return (
      <Button
        component={NextLink}
        href="/auth/signin?callbackUrl=%2Fdashboard"
        variant="outlined"
        size="small"
        startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
        sx={{
          ...authButtonSx,
          borderColor: "rgba(255,255,255,0.35)",
          color: "#fff",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.6)",
            backgroundColor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        ログイン
      </Button>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ ml: { xs: 0.5, md: 1 }, flexShrink: 0 }}
    >
      <Button
        component={NextLink}
        href="/dashboard"
        variant="outlined"
        size="small"
        startIcon={<DashboardIcon sx={{ fontSize: 18 }} />}
        sx={{
          ...authButtonSx,
          ml: 0,
          borderColor: "rgba(56,123,255,0.45)",
          color: "#fff",
          backgroundColor: "rgba(56,123,255,0.1)",
          boxShadow: "0 0 20px rgba(56,123,255,0.12)",
          "&:hover": {
            borderColor: "rgba(96,165,250,0.7)",
            backgroundColor: "rgba(56,123,255,0.18)",
          },
        }}
      >
        Dashboard
      </Button>
      <Box
        aria-label="ログイン中"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          px: { xs: 0.75, sm: 1.25 },
          py: 0.5,
          borderRadius: 999,
          border: "1px solid rgba(74,222,128,0.4)",
          backgroundColor: "rgba(74,222,128,0.1)",
        }}
      >
        <Avatar
          src={user.image ?? undefined}
          alt={user.name ?? "ユーザー"}
          sx={{
            width: 28,
            height: 28,
            fontSize: "0.85rem",
            fontWeight: 700,
            bgcolor: "#22c55e",
            color: "#fff",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          {user.name?.charAt(0) ?? "?"}
        </Avatar>
        <Typography
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
            fontSize: "0.68rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          ログイン中
        </Typography>
      </Box>
      <Button
        variant="outlined"
        size="small"
        aria-label="ログアウト"
        startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
        onClick={() => signOut({ callbackUrl: "/" })}
        sx={{
          ...authButtonSx,
          ml: 0,
          minWidth: { xs: 40, sm: "auto" },
          px: { xs: 1, sm: 1.25, md: 2 },
          borderColor: "rgba(255,255,255,0.28)",
          color: "rgba(255,255,255,0.9)",
          "& .MuiButton-startIcon": {
            mr: { xs: 0, sm: 1 },
          },
          "&:hover": {
            borderColor: "rgba(255,255,255,0.45)",
            backgroundColor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          ログアウト
        </Box>
      </Button>
    </Stack>
  );
}
