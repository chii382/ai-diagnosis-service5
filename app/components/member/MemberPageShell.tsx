import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import MemberNav from "@/app/components/member/MemberNav";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";
import DiagnosisResultBackground from "@/app/components/diagnosis/DiagnosisResultBackground";

interface MemberPageShellProps {
  children: ReactNode;
  userName?: string | null;
  userImage?: string | null;
  /** 背景テーマ（省略時は会員ダッシュボード用） */
  background?: "member" | "diagnosis-result";
}

/** 会員エリア共通レイアウト（背景はクリック不可、コンテンツは前面で操作可能） */
export default function MemberPageShell({
  children,
  userName,
  userImage,
  background = "member",
}: MemberPageShellProps) {
  return (
    <Box sx={{ position: "relative", isolation: "isolate", minHeight: "100svh", overflowX: "hidden" }}>
      <Box
        aria-hidden
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {background === "diagnosis-result" ? (
          <DiagnosisResultBackground />
        ) : (
          <MemberCinematicBackground />
        )}
      </Box>

      <Box
        component="main"
        sx={{
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
          minHeight: "100svh",
        }}
      >
        <MemberNav userName={userName} userImage={userImage} transparent />
        {children}
      </Box>
    </Box>
  );
}
