import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import JpBulletText from "@/app/components/common/JpBulletText";
import type { CareerRoadmapPhase } from "@/lib/diagnosis/types";

interface RoadmapPhaseBodyProps {
  phase: CareerRoadmapPhase;
}

export default function RoadmapPhaseBody({ phase }: RoadmapPhaseBodyProps) {
  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mb: 0.5 }}>
          目標
        </Typography>
        <Stack spacing={0.5}>
          {phase.goals.map((goal) => (
            <JpBulletText key={goal}>{goal}</JpBulletText>
          ))}
        </Stack>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mb: 0.5 }}>
          アクション
        </Typography>
        <Stack spacing={0.5}>
          {phase.actions.map((action) => (
            <JpBulletText key={action}>{action}</JpBulletText>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
