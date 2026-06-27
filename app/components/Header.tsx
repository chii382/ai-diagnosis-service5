import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import ExploreIcon from "@mui/icons-material/Explore";
import HeaderAuthActions from "@/app/components/HeaderAuthActions";

const navItems = [
  { label: "WHY CHOOSE US", href: "#features" },
  { label: "HOW IT WORKS", href: "#steps" },
  { label: "PRICING", href: "#pricing" },
  { label: "START NOW", href: "#start" },
];

const concernsNav = { label: "YOUR CONCERNS", href: "#pain" };

const navLinkSx = {
  color: "rgba(255,255,255,0.8)",
  fontSize: { md: "0.64rem", lg: "0.7rem" },
  fontWeight: 600,
  letterSpacing: "0.12em",
  whiteSpace: "nowrap",
  flexShrink: 0,
  wordBreak: "normal",
  lineBreak: "auto",
  transition: "color 0.2s ease",
  cursor: "pointer",
  "&:hover": { color: "#fff" },
} as const;

export default function Header() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)",
        backdropFilter: "blur(2px)",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 72 }, gap: 1 }}>
          <Link
            href="#top"
            underline="none"
            aria-label="ページ先頭へ戻る"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "inherit",
              transition: "opacity 0.2s ease",
              "&:hover": { opacity: 0.85 },
            }}
          >
            <ExploreIcon sx={{ color: "#fff", fontSize: 24 }} />
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                letterSpacing: "0.06em",
                color: "#fff",
              }}
            >
              AIキャリア診断
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={{ md: 1.75, lg: 2.75 }}
            alignItems="center"
            sx={{
              mr: { xs: 0.5, md: 0.5 },
              flexShrink: 0,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Link
              href={concernsNav.href}
              underline="none"
              sx={navLinkSx}
            >
              {concernsNav.label}
            </Link>

            {navItems.map((item) => (
              <Link key={item.href} href={item.href} underline="none" sx={navLinkSx}>
                {item.label}
              </Link>
            ))}
          </Stack>

          <HeaderAuthActions />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
