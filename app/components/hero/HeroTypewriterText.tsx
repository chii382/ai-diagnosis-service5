"use client";

import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

const FULL_TEXT = `眠った可能性に気づく。
知らなかった選択肢が見える。
それだけで、キャリアは広がる。

あなたの宇宙は無限大、
まずは無料で試してみませんか。`;

const CHAR_INTERVAL_MS = 55;
const START_DELAY_MS = 1300;

export default function HeroTypewriterText() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setDisplayed(FULL_TEXT);
      setDone(true);
      return;
    }

    let index = 0;
    let intervalId: number | undefined;

    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayed(FULL_TEXT.slice(0, index));
        if (index >= FULL_TEXT.length) {
          if (intervalId !== undefined) window.clearInterval(intervalId);
          setDone(true);
        }
      }, CHAR_INTERVAL_MS);
    }, START_DELAY_MS);

    return () => {
      window.clearTimeout(startId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Typography
      component="p"
      className="hero-typewriter"
      sx={{
        color: "rgba(255,255,255,0.75)",
        fontSize: { xs: "1rem", md: "1.2rem" },
        maxWidth: 640,
        lineHeight: 1.8,
        whiteSpace: "pre-line",
        minHeight: { xs: "7.2em", md: "8.6em" },
      }}
    >
      {displayed}
      {!done && <span className="hero-typewriter-cursor" aria-hidden />}
    </Typography>
  );
}
