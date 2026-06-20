"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";

const CELL_SIZE = 10;
const DRIFT_SPEED = 1.6;
const FRAME_INTERVAL_MS = 48;

/** 有料ロック領域の砂嵐（TVノイズ風モザイク）オーバーレイ */
export default function PremiumSandstormOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId = 0;
    let running = true;
    let driftX = 0;
    let lastFrameAt = 0;
    let width = 0;
    let height = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const drawFrame = () => {
      if (width <= 0 || height <= 0) return;

      driftX = (driftX + DRIFT_SPEED) % CELL_SIZE;
      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / CELL_SIZE) + 2;
      const rows = Math.ceil(height / CELL_SIZE);

      for (let row = 0; row < rows; row += 1) {
        for (let col = -1; col < cols; col += 1) {
          const tone = Math.floor(Math.random() * 256);
          const alpha = 0.55 + Math.random() * 0.35;
          ctx.fillStyle = `rgba(${tone}, ${tone}, ${tone}, ${alpha})`;
          ctx.fillRect(col * CELL_SIZE - driftX, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }

      ctx.fillStyle = "rgba(90, 90, 90, 0.12)";
      ctx.fillRect(0, 0, width, height);
    };

    const loop = (timestamp: number) => {
      if (!running) return;

      if (reduceMotion) {
        if (lastFrameAt === 0) drawFrame();
        lastFrameAt = timestamp;
      } else if (timestamp - lastFrameAt >= FRAME_INTERVAL_MS) {
        drawFrame();
        lastFrameAt = timestamp;
      }

      rafId = window.requestAnimationFrame(loop);
    };

    resize();
    drawFrame();

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    rafId = window.requestAnimationFrame(loop);

    return () => {
      running = false;
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      aria-hidden
      className="premium-sandstorm-layer"
      sx={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "rgba(80, 80, 80, 0.18)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
