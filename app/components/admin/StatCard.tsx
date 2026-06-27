import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { adminGlassCardSx } from "@/app/components/admin/adminStyles";

interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
}

export default function StatCard({ label, value, helper, accent = "#60a5fa" }: StatCardProps) {
  return (
    <Card sx={{ ...adminGlassCardSx, height: "100%" }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, color: accent, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {helper && (
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", mt: 1 }}>
            {helper}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
