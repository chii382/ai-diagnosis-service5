import Box from "@mui/material/Box";
import CosmicStarCanvas from "@/app/components/common/CosmicStarCanvas";

/** 会員ダッシュボード用。宇宙飛行士ヒーロー・シネマティック背景 */
export default function MemberCinematicBackground() {
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
      <Box className="dashboard-bg-float">
        <Box
          className="bg-dashboard-cinematic"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/dashboard-hero.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
          }}
        />
      </Box>

      <Box className="dashboard-stars-drift">
        <CosmicStarCanvas
          density={1.9}
          twinkleIntensity={1.35}
          twinkleSpeed={1.5}
        />
        <Box className="stars stars-dashboard" sx={{ position: "absolute", inset: 0 }} />
        <Box
          className="stars stars-dashboard stars-dashboard-layer-2"
          sx={{ position: "absolute", inset: 0 }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 16%, rgba(0,0,0,0.24) 34%, rgba(0,0,0,0.12) 54%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      <Box
        className="dashboard-steam-glow dashboard-glow-float"
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 38% 32% at 72% 30%, rgba(255,200,110,0.2), transparent 55%),
            radial-gradient(ellipse 75% 38% at 50% 88%, rgba(100,160,255,0.18), transparent 58%)
          `,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 115% 85% at 50% 50%, transparent 42%, rgba(0,0,0,0.36) 100%)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.06)",
        }}
      />
    </Box>
  );
}
