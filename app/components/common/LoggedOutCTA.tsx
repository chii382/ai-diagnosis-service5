"use client";

import Box from "@mui/material/Box";
import { useSession } from "next-auth/react";
import CTAButton from "@/app/components/common/CTAButton";

interface LoggedOutCTAProps {
  appearance?: "solid" | "outline";
}

export default function LoggedOutCTA({ appearance = "solid" }: LoggedOutCTAProps) {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.user) {
    return null;
  }

  if (status === "loading") {
    return null;
  }

  return (
    <Box sx={{ pt: 1 }}>
      <CTAButton appearance={appearance} />
    </Box>
  );
}
