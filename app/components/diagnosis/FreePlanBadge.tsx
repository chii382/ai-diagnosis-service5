import Chip from "@mui/material/Chip";

interface FreePlanBadgeProps {
  /** カード内などコンパクト表示 */
  compact?: boolean;
}

export default function FreePlanBadge({ compact = false }: FreePlanBadgeProps) {
  return (
    <Chip
      label="無料版"
      size="small"
      className="free-plan-badge"
      sx={{
        height: compact ? 22 : 26,
        fontWeight: 800,
        fontSize: compact ? "0.68rem" : "0.75rem",
        letterSpacing: "0.1em",
        color: "#1a1206",
        border: "1px solid rgba(253, 224, 71, 0.75)",
        background:
          "linear-gradient(135deg, #f59e0b 0%, #fde047 42%, #fbbf24 68%, #f59e0b 100%)",
        backgroundSize: "220% 100%",
        boxShadow: "0 0 18px rgba(245, 158, 11, 0.45)",
        "& .MuiChip-label": {
          px: compact ? 1 : 1.25,
        },
      }}
    />
  );
}
