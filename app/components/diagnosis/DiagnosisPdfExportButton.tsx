"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  buildDiagnosisPdfFilename,
  exportDiagnosisResultToPdf,
} from "@/lib/diagnosis/export-diagnosis-pdf";
import { canViewPremiumContent, type UserPlan } from "@/lib/plan";

const EXPORT_ROOT_ID = "diagnosis-result-export";

type DiagnosisPdfExportButtonProps = {
  plan: UserPlan;
  diagnosisId: string;
  createdAt: string;
};

export default function DiagnosisPdfExportButton({
  plan,
  diagnosisId,
  createdAt,
}: DiagnosisPdfExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canViewPremiumContent(plan)) {
    return null;
  }

  const handleExport = async () => {
    const element = document.getElementById(EXPORT_ROOT_ID);
    if (!element) {
      setError("PDFの生成に失敗しました。ページを再読み込みして再度お試しください。");
      return;
    }

    setExporting(true);
    setError(null);

    try {
      await exportDiagnosisResultToPdf(element, {
        filename: buildDiagnosisPdfFilename(diagnosisId, createdAt),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "PDFの生成に失敗しました。ページを再読み込みして再度お試しください。",
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ width: "100%" }} data-html2canvas-ignore="true">
          {error}
        </Alert>
      )}
      <Button
        variant="outlined"
        startIcon={<PictureAsPdfIcon />}
        onClick={() => void handleExport()}
        disabled={exporting}
        data-html2canvas-ignore="true"
        sx={{
          borderColor: "rgba(251,146,60,0.55)",
          color: "rgba(255,255,255,0.92)",
          backgroundColor: "rgba(251,146,60,0.12)",
          fontWeight: 700,
          "&:hover": {
            borderColor: "rgba(251,191,36,0.85)",
            backgroundColor: "rgba(251,146,60,0.2)",
          },
        }}
      >
        {exporting ? "PDF生成中..." : "PDF出力"}
      </Button>
    </>
  );
}

export { EXPORT_ROOT_ID as DIAGNOSIS_RESULT_EXPORT_ROOT_ID };
