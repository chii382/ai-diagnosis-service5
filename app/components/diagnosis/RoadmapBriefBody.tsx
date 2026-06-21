import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CareerRoadmapPhaseBrief } from "@/lib/diagnosis/types";
import { jpBodyTextSx } from "@/lib/typography";

interface RoadmapBriefBodyProps {
  phase: CareerRoadmapPhaseBrief;
}

export default function RoadmapBriefBody({ phase }: RoadmapBriefBodyProps) {
  return (
    <Stack spacing={0.75} sx={{ minWidth: 0 }}>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "0.78rem",
          letterSpacing: "0.06em",
          color: "rgba(147,197,253,0.85)",
        }}
      >
        方針概要
      </Typography>
      <Typography
        sx={{
          ...jpBodyTextSx,
          flex: "unset",
          color: "rgba(255,255,255,0.85)",
          fontSize: "0.92rem",
          lineHeight: 1.85,
        }}
      >
        {phase.overview}
      </Typography>
    </Stack>
  );
}
