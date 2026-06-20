import Box from "@mui/material/Box";

const BACKGROUND_IMAGE = "/images/diagnosis-result-bg.png";

/** 原寸 604×841 — これ以上拡大しない */
const IMAGE_WIDTH = 604;
const IMAGE_HEIGHT = 841;

/** 診断結果画面用 — デジタル人体ワイヤーフレーム背景 */
export default function DiagnosisResultBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundColor: "#020617",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "center",
          pt: { xs: "8svh", sm: 0 },
        }}
      >
        <Box
          component="img"
          src={BACKGROUND_IMAGE}
          alt=""
          decoding="async"
          sx={{
            display: "block",
            width: "auto",
            height: "auto",
            maxWidth: `${IMAGE_WIDTH}px`,
            maxHeight: {
              xs: `min(${IMAGE_HEIGHT}px, 72svh)`,
              sm: `min(${IMAGE_HEIGHT}px, 84svh)`,
              md: `min(${IMAGE_HEIGHT}px, 92svh)`,
            },
            objectFit: "contain",
            objectPosition: "center center",
          }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(180deg, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.22) 24%, rgba(2,6,23,0.38) 55%, rgba(2,6,23,0.86) 100%),
            linear-gradient(90deg, rgba(2,6,23,0.72) 0%, transparent 18%, transparent 82%, rgba(2,6,23,0.72) 100%),
            radial-gradient(ellipse 65% 50% at 50% 40%, rgba(56,123,255,0.14), transparent 70%)
          `,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 115% 85% at 50% 50%, transparent 38%, rgba(0,0,0,0.42) 100%)",
        }}
      />
    </Box>
  );
}
