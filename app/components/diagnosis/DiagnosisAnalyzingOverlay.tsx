"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CosmicStarCanvas from "@/app/components/common/CosmicStarCanvas";

const BACKGROUND_IMAGE = "/images/diagnosis-analyzing-bg.png";

const STATUS_MESSAGES = [
  "あなたの回答を一つひとつ読み解いています…",
  "隠れた強みを見つけ出しています…",
  "あなたに合うキャリアの方向を特定中…",
  "あなた専用のロードマップを作成しています…",
] as const;

/** 診断中の全画面待機 UI（背景画像 + 軽量アニメーション） */
export default function DiagnosisAnalyzingOverlay() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    document.body.classList.add("diagnosis-analyzing-active");
    return () => {
      document.body.classList.remove("diagnosis-analyzing-active");
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label="AI診断を実行中"
      aria-busy="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#000",
        cursor: "wait",
        animation: "diagnosis-overlay-in 0.35s ease-out",
      }}
    >
      <Box
        aria-hidden
        className="diagnosis-analyzing-bg-kenburns"
        sx={{
          position: "absolute",
          inset: "-4%",
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
          backgroundSize: { xs: "auto 108%", sm: "auto 112%", md: "cover" },
          backgroundRepeat: "no-repeat",
          backgroundPosition: {
            xs: "center 42%",
            sm: "center center",
            md: "center center",
          },
        }}
      />

      <Box
        aria-hidden
        className="diagnosis-analyzing-glow"
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.5) 100%),
            radial-gradient(ellipse 55% 45% at 50% 48%, rgba(56,123,255,0.28), transparent 68%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(34,211,238,0.14), transparent 55%)
          `,
          pointerEvents: "none",
        }}
      />

      <Box
        aria-hidden
        sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <CosmicStarCanvas
          density={1.55}
          twinkleIntensity={1.35}
          twinkleSpeed={2.1}
          driftSpeed={1.35}
          shootingStarFrequency={1.75}
        />
      </Box>

      <Stack
        spacing={3}
        alignItems="center"
        className="diagnosis-analyzing-content-float"
        sx={{
          position: "relative",
          zIndex: 1,
          px: 3,
          py: 4,
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: { xs: 128, sm: 144 },
            height: { xs: 128, sm: 144 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            aria-hidden
            className="diagnosis-orbit-outer"
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "1px solid rgba(34,211,238,0.45)",
              boxShadow: "0 0 28px rgba(56,123,255,0.3)",
            }}
          />
          <Box
            aria-hidden
            className="diagnosis-orbit-inner"
            sx={{
              position: "absolute",
              inset: "16%",
              borderRadius: "50%",
              border: "1px dashed rgba(147,197,253,0.5)",
            }}
          />
          <Box
            aria-hidden
            className="diagnosis-core-pulse"
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #387bff, #22d3ee)",
              boxShadow: "0 0 22px rgba(34,211,238,0.8)",
            }}
          />
        </Box>

        <Stack spacing={1}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.68rem",
              fontWeight: 600,
              letterSpacing: "0.42em",
            }}
          >
            AI ANALYSIS
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "clamp(0.8rem, 2.6vw + 0.55rem, 1.05rem)",
                sm: "1.25rem",
                md: "1.35rem",
              },
              textShadow: "0 0 28px rgba(56,123,255,0.5)",
              minHeight: "1.6em",
            }}
          >
            {STATUS_MESSAGES[messageIndex]}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>
            Claude Haiku 4.5 があなた専用の診断結果を構築しています
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="center" aria-hidden>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              className="diagnosis-dot-pulse"
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#22d3ee",
                animationDelay: `${i * 0.22}s`,
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
