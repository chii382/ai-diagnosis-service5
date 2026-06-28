import Box from "@mui/material/Box";

interface PanelBackgroundProps {
  src: string;
  overlay: string;
  position?: string;
  mobilePosition?: string;
  backgroundSize?: string;
  mobileBackgroundSize?: string;
  /** false のときズームアニメーションを止め、img でシャープに表示 */
  animated?: boolean;
}

export default function PanelBackground({
  src,
  overlay,
  position = "center",
  mobilePosition,
  backgroundSize = "cover",
  mobileBackgroundSize = "auto 100%",
  animated = true,
}: PanelBackgroundProps) {
  if (!animated) {
    return (
      <>
        <Box
          component="img"
          src={src}
          alt=""
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: {
              xs: mobilePosition ?? position,
              md: position,
            },
            display: "block",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background: overlay,
          }}
        />
      </>
    );
  }

  return (
    <>
      <Box
        aria-hidden
        className="bg-zoom"
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: { xs: mobileBackgroundSize, md: backgroundSize },
          backgroundPosition: {
            xs: mobilePosition ?? position,
            md: position,
          },
          backgroundRepeat: "no-repeat",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: overlay,
        }}
      />
    </>
  );
}
