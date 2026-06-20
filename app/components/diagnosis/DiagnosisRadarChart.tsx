"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { RadarChartData } from "@/lib/diagnosis/chart-data";

interface DiagnosisRadarChartProps {
  data: RadarChartData;
}

const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_RADIUS = 98;
const LEVELS = [25, 50, 75, 100];

function polarPoint(angleIndex: number, count: number, radius: number) {
  const angle = (Math.PI * 2 * angleIndex) / count - Math.PI / 2;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

function polygonPoints(scores: number[], count: number, maxScore = 100) {
  return scores
    .map((score, index) => {
      const radius = (score / maxScore) * MAX_RADIUS;
      const point = polarPoint(index, count, radius);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

export default function DiagnosisRadarChart({ data }: DiagnosisRadarChartProps) {
  const count = data.axes.length;

  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontWeight: 700, mb: 2 }}>レーダーチャート</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", overflow: "visible" }}>
        <Box
          component="svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          sx={{ width: "100%", maxWidth: 360, height: "auto", overflow: "visible" }}
          aria-label="キャリア特性レーダーチャート"
        >
          {LEVELS.map((level) => (
            <polygon
              key={level}
              points={polygonPoints(Array(count).fill(level), count)}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          ))}

          {data.axes.map((_, index) => {
            const outer = polarPoint(index, count, MAX_RADIUS);
            return (
              <line
                key={index}
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}

          <polygon
            points={polygonPoints(data.scores, count)}
            fill="rgba(56,123,255,0.28)"
            stroke="rgba(96,165,250,0.95)"
            strokeWidth="2"
          />

          {data.scores.map((score, index) => {
            const point = polarPoint(index, count, (score / 100) * MAX_RADIUS);
            return (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#60a5fa"
                stroke="#fff"
                strokeWidth="1.5"
              />
            );
          })}

          {data.axes.map((label, index) => {
            const labelPoint = polarPoint(index, count, MAX_RADIUS + 28);
            return (
              <text
                key={label}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.78)"
                fontSize="11"
              >
                {label}
              </text>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
