"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface DiagnosisEditActionButtonProps {
  editHref: string;
  unlocked: boolean;
}

export default function DiagnosisEditActionButton({
  editHref,
  unlocked,
}: DiagnosisEditActionButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (unlocked) {
    return (
      <Button
        component={Link}
        href={editHref}
        variant="outlined"
        startIcon={<EditOutlinedIcon />}
        sx={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
      >
        結果を編集
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        onClick={() => setDialogOpen(true)}
        className="premium-locked-action-btn"
        sx={{
          px: { xs: 1.75, sm: 2 },
          py: 1,
          borderRadius: 2,
          border: "1px solid rgba(96,165,250,0.5)",
          color: "rgba(226,232,240,0.95)",
          background:
            "linear-gradient(135deg, rgba(56,123,255,0.16) 0%, rgba(34,211,238,0.08) 100%)",
          boxShadow: "0 0 20px rgba(56,123,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          "&:hover": {
            borderColor: "rgba(147,197,253,0.7)",
            background:
              "linear-gradient(135deg, rgba(56,123,255,0.24) 0%, rgba(34,211,238,0.12) 100%)",
            boxShadow: "0 0 28px rgba(56,123,255,0.28)",
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <LockOutlinedIcon sx={{ fontSize: 18, color: "#93c5fd" }} />
            <EditOutlinedIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.75)" }} />
            <Box component="span">結果を編集</Box>
          </Stack>
          <Chip
            label="有料プラン限定"
            size="small"
            className="premium-upgrade-badge"
            sx={{
              height: 22,
              fontSize: "0.68rem",
              fontWeight: 700,
              backgroundColor: "rgba(56,123,255,0.22)",
              color: "#bfdbfe",
              border: "1px solid rgba(96,165,250,0.45)",
            }}
          />
        </Stack>
      </Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>有料プラン限定機能</DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ pt: 0.5, pb: 0.5 }}>
            <Box
              className="premium-lock-icon"
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, rgba(56,123,255,0.35) 0%, rgba(34,211,238,0.2) 100%)",
                border: "1px solid rgba(147,197,253,0.45)",
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 26, color: "#93c5fd" }} />
            </Box>
            <DialogContentText sx={{ color: "text.secondary", textAlign: "center", lineHeight: 1.8 }}>
              診断結果の編集は、有料プランの会員のみ利用できます。
              <Box component="span" sx={{ display: "block", mt: 0.75 }}>
                アップグレードすると、AIの提案内容を自由に調整できます。
              </Box>
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} fullWidth sx={{ m: "0 !important" }}>
            閉じる
          </Button>
          <Button
            component={Link}
            href="/#pricing"
            variant="contained"
            fullWidth
            className="premium-upgrade-btn"
            sx={{
              m: "0 !important",
              fontWeight: 700,
              background: "linear-gradient(90deg, #387bff 0%, #22d3ee 100%)",
            }}
          >
            有料プランにアップグレード
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
