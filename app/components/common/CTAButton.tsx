"use client";

import Link from "next/link";
import Button, { ButtonProps } from "@mui/material/Button";

type Appearance = "solid" | "outline";

interface CTAButtonProps extends Omit<ButtonProps, "variant"> {
  label?: string;
  appearance?: Appearance;
  href?: string;
}

export default function CTAButton({
  label = "無料で診断する",
  appearance = "solid",
  href = "/diagnosis",
  sx,
  ...rest
}: CTAButtonProps) {
  const appearanceSx =
    appearance === "solid"
      ? {
          backgroundColor: "#ffffff",
          color: "#000000",
          border: "1px solid #ffffff",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.85)",
          },
        }
      : {
          backgroundColor: "transparent",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.6)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
            borderColor: "#ffffff",
          },
        };

  return (
    <Button
      component={Link}
      href={href}
      disableElevation
      sx={{
        px: { xs: 3.5, md: 4.5 },
        py: { xs: 1.1, md: 1.35 },
        fontSize: { xs: "0.8rem", md: "0.875rem" },
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        borderRadius: "3px",
        ...appearanceSx,
        ...sx,
      }}
      {...rest}
    >
      {label}
    </Button>
  );
}
