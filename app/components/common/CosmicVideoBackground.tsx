"use client";

import Box from "@mui/material/Box";
import CosmicStarCanvas from "@/app/components/common/CosmicStarCanvas";

interface CosmicVideoBackgroundProps {
  /** ベースとなる宇宙画像 */
  image: string;
  /** 画像位置 */
  position?: string;
  /** スマホ時の画像位置（未指定時は position を使用） */
  mobilePosition?: string;
  /** テキスト可読性確保のためのオーバーレイ */
  overlay: string;
  /** ゆっくり上昇するパン演出(打ち上げの上昇感)にするか */
  rise?: boolean;
  /** rise 時の演出強度。hero はロケットを大きく見せる、starship は SpaceX 公式風 */
  riseVariant?: "default" | "hero" | "starship";
  /** 背景画像のサイズ（hero 時は cover より大きく指定） */
  backgroundSize?: string;
  /** スマホ時の背景サイズ（未指定時は auto 100% で縦画面に合わせる） */
  mobileBackgroundSize?: string;
  /** Canvas の星アニメーション */
  showStars?: boolean;
}

export default function CosmicVideoBackground({
  image,
  position = "center",
  mobilePosition,
  overlay,
  rise = false,
  riseVariant = "default",
  backgroundSize = "cover",
  mobileBackgroundSize = "auto 100%",
  showStars = true,
}: CosmicVideoBackgroundProps) {
  const riseClass =
    riseVariant === "hero"
      ? "bg-rise-hero"
      : riseVariant === "starship"
        ? "bg-rise-starship"
        : "bg-rise";

  return (
    <>
      <Box
        aria-hidden
        className={rise ? riseClass : "bg-zoom"}
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: { xs: mobileBackgroundSize, md: backgroundSize },
          backgroundPosition: {
            xs: mobilePosition ?? position,
            md: position,
          },
          backgroundRepeat: "no-repeat",
        }}
      />
      {showStars && <CosmicStarCanvas />}
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
