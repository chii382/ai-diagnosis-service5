"use client";

import { useState } from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type Appearance = "solid" | "outline";

interface CTAButtonProps extends Omit<ButtonProps, "variant"> {
  label?: string;
  appearance?: Appearance;
}

export default function CTAButton({
  label = "無料で診断を始める",
  appearance = "solid",
  sx,
  ...rest
}: CTAButtonProps) {
  const [open, setOpen] = useState(false);

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
    <>
      <Button
        onClick={() => setOpen(true)}
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
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Coming Soon（近日公開予定です）
        </Alert>
      </Snackbar>
    </>
  );
}
