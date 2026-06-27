"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PremiumSandstormOverlay from "@/app/components/diagnosis/PremiumSandstormOverlay";

const featureTextSx = {
  color: "rgba(255,255,255,0.82)",
  fontSize: "0.86rem",
  lineHeight: 1.65,
  whiteSpace: "pre-line",
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  lineBreak: "strict",
  textWrap: "pretty",
} as const;

function FeatureRow({ feature, accent }: { feature: string; accent: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <CheckCircleOutlineIcon
        sx={{ fontSize: 18, color: accent, mt: 0.25, flexShrink: 0 }}
      />
      <Typography sx={{ ...featureTextSx, flex: 1, minWidth: 0 }}>{feature}</Typography>
    </Stack>
  );
}

interface PricingPlanFeaturesProps {
  planId: "free" | "standard" | "premium";
  accent: string;
  features: string[];
  footnote?: string;
}

export default function PricingPlanFeatures({
  planId,
  accent,
  features,
  footnote,
}: PricingPlanFeaturesProps) {
  if (planId !== "premium") {
    return (
      <>
        <Stack spacing={1.25} component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
          {features.map((feature) => (
            <Box key={feature} component="li">
              <FeatureRow feature={feature} accent={accent} />
            </Box>
          ))}
        </Stack>
        {footnote && (
          <Typography
            sx={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.72rem",
              lineHeight: 1.6,
              wordBreak: "keep-all",
              lineBreak: "strict",
              textWrap: "pretty",
            }}
          >
            {footnote}
          </Typography>
        )}
      </>
    );
  }

  const [visibleFeature, ...hiddenFeatures] = features;

  return (
    <>
      <Stack spacing={1.25} component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
        <Box component="li">
          <FeatureRow feature={visibleFeature} accent={accent} />
        </Box>

        <Box
          component="li"
          sx={{
            position: "relative",
            listStyle: "none",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Stack spacing={1.25} aria-hidden sx={{ visibility: "hidden", p: 0.25 }}>
            {hiddenFeatures.map((feature) => (
              <FeatureRow key={feature} feature={feature} accent={accent} />
            ))}
            {footnote && (
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.72rem",
                  lineHeight: 1.6,
                  pl: 3.25,
                }}
              >
                {footnote}
              </Typography>
            )}
          </Stack>

          <Box sx={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <PremiumSandstormOverlay />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                pointerEvents: "none",
              }}
            >
            <Stack spacing={0.75} alignItems="center" textAlign="center">
              <LockOutlinedIcon sx={{ fontSize: 22, color: "rgba(251,191,36,0.9)" }} />
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.88)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                宇宙級限定コンテンツ
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}>
                順次公開予定
              </Typography>
            </Stack>
            </Box>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
