import Box from "@mui/material/Box";

interface PanelBackgroundProps {
  src: string;
  overlay: string;
  position?: string;
  mobilePosition?: string;
  backgroundSize?: string;
  mobileBackgroundSize?: string;
}

export default function PanelBackground({
  src,
  overlay,
  position = "center",
  mobilePosition,
  backgroundSize = "cover",
  mobileBackgroundSize = "auto 100%",
}: PanelBackgroundProps) {
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
