import Box from "@mui/material/Box";

interface PanelBackgroundProps {
  src: string;
  overlay: string;
  position?: string;
}

export default function PanelBackground({
  src,
  overlay,
  position = "center",
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
          backgroundSize: "cover",
          backgroundPosition: position,
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
