"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  tw: number;
}

interface Shooting {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  len: number;
}

interface CosmicStarCanvasProps {
  /** 星の密度（1 = LP標準） */
  density?: number;
  /** きらめきの明るさ */
  twinkleIntensity?: number;
  /** きらめき速度 */
  twinkleSpeed?: number;
}

/** LP と同様の Canvas 星空（きらめき・流れ星） */
export default function CosmicStarCanvas({
  density = 1,
  twinkleIntensity = 1,
  twinkleSpeed = 1,
}: CosmicStarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let shooting: Shooting | null = null;
    let raf = 0;
    let last = 0;
    let nextShoot = 2600;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(60, Math.round(((w * h) / 7000) * density));
      stars = Array.from({ length: count }, (_, i) => {
        const isSparkle = i % 5 === 0;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random(),
          r: isSparkle ? Math.random() * 1.6 + 0.8 : Math.random() * 1.2 + 0.3,
          tw: Math.random() * Math.PI * 2,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = 0.5 + 0.4 * s.z;
        ctx.fillStyle = "#dbe7ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return () => window.removeEventListener("resize", resize);
    }

    const frame = (t: number) => {
      const dt = last ? Math.min(t - last, 50) : 16;
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const speed = 0.004 + s.z * 0.013;
        s.x += speed * dt;
        s.y -= speed * 0.22 * dt;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;

        s.tw += dt * 0.0022 * twinkleSpeed;
        const twinkle = 0.5 + 0.5 * Math.sin(s.tw);
        const baseAlpha = (0.28 + 0.58 * twinkle) * (0.4 + 0.6 * s.z);
        ctx.globalAlpha = Math.min(1, baseAlpha * twinkleIntensity);
        ctx.fillStyle = s.r > 1.2 ? "#eef4ff" : "#dbe7ff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.2 && twinkle > 0.88) {
          ctx.globalAlpha = 0.18 * twinkleIntensity;
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.lineWidth = 0.6;
          const arm = s.r * (1.4 + s.z);
          ctx.beginPath();
          ctx.moveTo(s.x - arm, s.y);
          ctx.lineTo(s.x + arm, s.y);
          ctx.moveTo(s.x, s.y - arm);
          ctx.lineTo(s.x, s.y + arm);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      nextShoot -= dt;
      if (!shooting && nextShoot <= 0) {
        shooting = {
          x: Math.random() * w * 0.6,
          y: Math.random() * h * 0.4,
          vx: 0.5 + Math.random() * 0.3,
          vy: 0.16 + Math.random() * 0.12,
          life: 0,
          len: 130,
        };
        nextShoot = (density > 1 ? 3800 : 5000) + Math.random() * (density > 1 ? 4500 : 6000);
      }
      if (shooting) {
        shooting.life += dt;
        shooting.x += shooting.vx * dt;
        shooting.y += shooting.vy * dt;
        const tailX = shooting.x - shooting.len * shooting.vx;
        const tailY = shooting.y - shooting.len * shooting.vy;
        const grad = ctx.createLinearGradient(
          shooting.x,
          shooting.y,
          tailX,
          tailY,
        );
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shooting.x, shooting.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        if (shooting.x > w + 60 || shooting.y > h + 60 || shooting.life > 1600) {
          shooting = null;
        }
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density, twinkleIntensity, twinkleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
