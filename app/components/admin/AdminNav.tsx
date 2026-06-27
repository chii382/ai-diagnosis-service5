"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { startNavigationPending } from "@/lib/navigation-pending";

const outlinedActionButtonSx = {
  borderColor: "rgba(255,255,255,0.2)",
  color: "rgba(255,255,255,0.85)",
  whiteSpace: "nowrap",
} as const;

const tabs = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/users", label: "ユーザー管理" },
  { href: "/admin/analytics", label: "分析レポート" },
  { href: "/admin/errors", label: "エラーログ" },
] as const;

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();
  const current =
    tabs.find((tab) =>
      tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href),
    )?.href ?? "/admin";

  function handleTabChange(_event: React.SyntheticEvent, value: string) {
    if (value === current) return;
    startNavigationPending();
    router.push(value);
  }

  return (
    <Box sx={{ mb: 3 }}>
      <StackHeader />
      <Tabs
        value={current}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mt: 2,
          "& .MuiTab-root": {
            color: "rgba(255,255,255,0.65)",
            minHeight: 44,
            fontSize: "0.85rem",
          },
          "& .Mui-selected": { color: "#fff !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#60a5fa" },
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.href} label={tab.label} value={tab.href} />
        ))}
      </Tabs>
    </Box>
  );
}

function StackHeader() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "flex-start" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AdminPanelSettingsIcon sx={{ color: "#60a5fa", fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
            管理者ダッシュボード
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>
            サービス運営・分析・ユーザー管理
          </Typography>
        </Box>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} useFlexGap flexWrap="wrap">
        <Button
          component={Link}
          href="/dashboard"
          variant="outlined"
          startIcon={<DashboardOutlinedIcon />}
          sx={outlinedActionButtonSx}
        >
          ダッシュボードに戻る
        </Button>
        <Button
          component={Link}
          href="/"
          variant="outlined"
          startIcon={<HomeOutlinedIcon />}
          sx={outlinedActionButtonSx}
        >
          トップページ(LP)に戻る
        </Button>
      </Stack>
    </Stack>
  );
}
