"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ExploreIcon from "@mui/icons-material/Explore";

interface MemberNavProps {
  userName?: string | null;
  userImage?: string | null;
  /** シネマティック背景の上に載せる LP 風ヘッダー */
  transparent?: boolean;
}

const navLinks = [
  { href: "/dashboard", label: "ダッシュボード", match: (path: string) => path === "/dashboard" },
  { href: "/diagnosis", label: "診断", match: (path: string) => path.startsWith("/diagnosis") },
  { href: "/profile", label: "プロフィール", match: (path: string) => path === "/profile" },
];

const navButtonSx = (active: boolean) =>
  ({
    color: active ? "#fff" : "rgba(255,255,255,0.65)",
    backgroundColor: active ? "rgba(56,123,255,0.18)" : "transparent",
    "&:hover": {
      backgroundColor: active ? "rgba(56,123,255,0.24)" : "rgba(255,255,255,0.06)",
    },
  }) as const;

export default function MemberNav({
  userName,
  userImage,
  transparent = false,
}: MemberNavProps) {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.appBar + 10,
        pointerEvents: "auto",
        background: transparent
          ? "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 100%)"
          : "rgba(10,16,32,0.85)",
        backdropFilter: transparent ? "blur(2px)" : "blur(12px)",
        borderBottom: transparent ? "none" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        <Link href="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mr: 1, cursor: "pointer" }}
          >
            <ExploreIcon sx={{ color: "primary.main", fontSize: 22 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}>
              AIキャリア診断
            </Typography>
          </Stack>
        </Link>

        <Stack direction="row" spacing={0.5} sx={{ flex: 1 }}>
          {navLinks.map((link) => {
            const active = link.match(pathname);
            return (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                size="small"
                sx={navButtonSx(active)}
              >
                {link.label}
              </Button>
            );
          })}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Avatar
            src={userImage ?? undefined}
            alt={userName ?? "ユーザー"}
            sx={{ width: 32, height: 32, border: "1px solid rgba(255,255,255,0.2)" }}
          />
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 160 }} noWrap>
              {userName ?? "ゲスト"}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => signOut({ callbackUrl: "/" })}
            sx={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.8)",
              "&:hover": { borderColor: "rgba(255,255,255,0.35)" },
            }}
          >
            ログアウト
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
