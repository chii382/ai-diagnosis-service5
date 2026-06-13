"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";

interface MemberVideoBackgroundProps {
  src: string;
}

/** 会員ページ用。全画面ループ動画背景 */
export default function MemberVideoBackground({ src }: MemberVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const play = () => {
      void video.play().catch(() => {
        /* 自動再生がブロックされた場合は静止表示 */
      });
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [src]);

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.38) 22%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 115% 85% at 50% 50%, transparent 44%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </Box>
  );
}
