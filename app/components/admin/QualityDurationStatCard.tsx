import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { adminGlassCardSx } from "@/app/components/admin/adminStyles";

interface QualityDurationStatCardProps {
  value: number;
  unit: string;
}

export default function QualityDurationStatCard({ value, unit }: QualityDurationStatCardProps) {
  return (
    <Card sx={{ ...adminGlassCardSx, height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mb: 1.5 }}>
          診断平均時間
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="baseline">
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "#60a5fa", lineHeight: 1, fontSize: "2.5rem" }}
          >
            {value.toLocaleString("ja-JP")}
          </Typography>
          <Typography
            sx={{ fontWeight: 700, color: "rgba(147,197,253,0.95)", fontSize: "1.1rem" }}
          >
            {unit}
          </Typography>
        </Stack>
        <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", mt: 1.5 }}>
          1件あたり（選択中の期間内）
        </Typography>
      </CardContent>
    </Card>
  );
}
