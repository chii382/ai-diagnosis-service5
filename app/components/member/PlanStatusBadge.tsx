import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getPlanIndicatorStyle, getPlanLabel, type UserPlan } from "@/lib/plan";
import { jpTextSx } from "@/lib/typography";

type PlanStatusBadgeProps = {
  plan: UserPlan;
};

export default function PlanStatusBadge({ plan }: PlanStatusBadgeProps) {
  const planLabel = getPlanLabel(plan);
  const indicator = getPlanIndicatorStyle(plan);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.1,
        py: 0.45,
        borderRadius: 999,
        border: "1px solid rgba(147,197,253,0.42)",
        background: "linear-gradient(135deg, rgba(56,123,255,0.22) 0%, rgba(34,211,238,0.1) 100%)",
        boxShadow: "0 0 14px rgba(56,123,255,0.12)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: indicator.color,
          boxShadow: `0 0 8px ${indicator.glow}`,
        }}
      />
      <Typography
        sx={{
          ...jpTextSx,
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "rgba(255,255,255,0.92)",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {`ご利用中 ${planLabel}`}
      </Typography>
    </Box>
  );
}
