import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import JpBulletText from "@/app/components/common/JpBulletText";
import type { CareerRoadmapPhaseBrief } from "@/lib/diagnosis/types";
import { jpBodyTextSx } from "@/lib/typography";

interface RoadmapBriefBodyProps {
  phase: CareerRoadmapPhaseBrief;
}

export default function RoadmapBriefBody({ phase }: RoadmapBriefBodyProps) {
  return (
    <Stack spacing={1.25} sx={{ minWidth: 0 }}>
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
      {phase.highlights.length > 0 && (
        <Stack spacing={0.75} sx={{ pt: 0.25, minWidth: 0 }}>
          {phase.highlights.map((item) => (
            <JpBulletText
              key={item}
              fontSize="0.85rem"
              color="rgba(255,255,255,0.68)"
              lineHeight={1.65}
            >
              {item}
            </JpBulletText>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
