import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import ExploreIcon from "@mui/icons-material/Explore";

const navItems = [
  { label: "FEATURES", href: "#features" },
  { label: "HOW IT WORKS", href: "#steps" },
];

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
        <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 72 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            spacing={4}
            alignItems="center"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                underline="none"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#fff" },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
