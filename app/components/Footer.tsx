import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

const links = ["PRIVACY", "TERMS", "CONTACT"];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        py: { xs: 4, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.06em",
            }}
          >
            AIキャリア診断
          </Typography>

          <Stack direction="row" spacing={3}>
            {links.map((l) => (
              <Link
                key={l}
                href="#"
                underline="none"
                sx={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  "&:hover": { color: "rgba(255,255,255,0.85)" },
                }}
              >
                {l}
              </Link>
            ))}
          </Stack>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
            }}
          >
            © 2026 AIキャリア診断. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
