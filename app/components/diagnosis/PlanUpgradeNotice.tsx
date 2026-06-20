import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { jpTextSx } from "@/lib/typography";

interface PlanUpgradeNoticeProps {
  intro: string;
  highlight: string;
}

export default function PlanUpgradeNotice({ intro, highlight }: PlanUpgradeNoticeProps) {
  return (
    <Box
      className="plan-upgrade-notice"
      sx={{
        p: { xs: 2, md: 2.25 },
        borderRadius: 2.5,
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.72) 0%, rgba(30,58,138,0.28) 100%)",
        border: "1px solid rgba(96,165,250,0.35)",
        boxShadow: "0 8px 32px rgba(15,23,42,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          sx={{
            ...jpTextSx,
            color: "rgba(255,255,255,0.78)",
            fontSize: { xs: "0.88rem", md: "0.92rem" },
            lineHeight: 1.75,
          }}
        >
          {intro}
        </Typography>

        <Box
          className="plan-upgrade-notice-highlight"
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "flex-start",
            p: { xs: 1.5, md: 1.75 },
            borderRadius: 2,
            background:
              "linear-gradient(135deg, rgba(56,123,255,0.28) 0%, rgba(34,211,238,0.14) 52%, rgba(56,123,255,0.22) 100%)",
            backgroundSize: "220% 100%",
            border: "1px solid rgba(147,197,253,0.55)",
            boxShadow: "0 0 24px rgba(56,123,255,0.22), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <Box
            className="plan-upgrade-notice-icon"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "50%",
              flexShrink: 0,
              background:
                "linear-gradient(135deg, rgba(56,123,255,0.55) 0%, rgba(34,211,238,0.35) 100%)",
              border: "1px solid rgba(191,219,254,0.55)",
              boxShadow: "0 0 18px rgba(56,123,255,0.4)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>

          <Stack spacing={0.75} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "#93c5fd",
              }}
            >
              PREMIUM PLAN
            </Typography>
            <Typography
              sx={{
                ...jpTextSx,
                fontWeight: 700,
                fontSize: { xs: "0.92rem", md: "1rem" },
                lineHeight: 1.75,
                color: "#fff",
              }}
            >
              {highlight}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
