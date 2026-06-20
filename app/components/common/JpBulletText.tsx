import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  jpBodyTextSx,
  jpBulletMarkerSx,
  jpBulletRowSx,
} from "@/lib/typography";

interface JpBulletTextProps {
  children: string;
  fontSize?: string;
  color?: string;
  lineHeight?: number;
}

export default function JpBulletText({
  children,
  fontSize = "0.92rem",
  color = "rgba(255,255,255,0.85)",
  lineHeight = 1.65,
}: JpBulletTextProps) {
  return (
    <Box sx={jpBulletRowSx}>
      <Typography
        component="span"
        aria-hidden
        sx={{ ...jpBulletMarkerSx, fontSize, color, lineHeight }}
      >
        •
      </Typography>
      <Typography
        component="span"
        sx={{ ...jpBodyTextSx, fontSize, color, lineHeight }}
      >
        {children}
      </Typography>
    </Box>
  );
}
