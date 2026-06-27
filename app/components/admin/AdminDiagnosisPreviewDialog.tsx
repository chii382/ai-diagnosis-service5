"use client";

import { useEffect, useState, type ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { DIAGNOSIS_QUESTIONS } from "@/lib/diagnosis/questions";
import { getCareerPathDisplayLabel } from "@/lib/diagnosis/career-path-display";
import { resolveResultBrief, resolveRoadmapBrief } from "@/lib/diagnosis/plan-content";
import type { DiagnosisDocument } from "@/lib/diagnosis/types";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";

interface AdminDiagnosisPreviewDialogProps {
  diagnosisId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function AdminDiagnosisPreviewDialog({
  diagnosisId,
  open,
  onClose,
}: AdminDiagnosisPreviewDialogProps) {
  const [diagnosis, setDiagnosis] = useState<DiagnosisDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !diagnosisId) {
      setDiagnosis(null);
      setError(null);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      startProcessingPending();
      try {
        const response = await fetch(`/api/admin/diagnosis/${diagnosisId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "取得に失敗しました");
        if (!cancelled) setDiagnosis(data as DiagnosisDocument);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "取得に失敗しました");
          setDiagnosis(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
        stopProcessingPending();
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [open, diagnosisId]);

  const resultBrief = diagnosis ? resolveResultBrief(diagnosis) : null;
  const roadmapBrief = diagnosis ? resolveRoadmapBrief(diagnosis) : null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        診断結果詳細
        <IconButton onClick={onClose} aria-label="閉じる">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>読み込み中...</Typography>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {diagnosis && resultBrief && roadmapBrief && (
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              診断日時: {new Date(diagnosis.createdAt).toLocaleString("ja-JP")}
            </Typography>

            <Section title="回答内容">
              <Stack spacing={1}>
                {DIAGNOSIS_QUESTIONS.map((q) => (
                  <Box key={q.id}>
                    <Typography variant="caption" color="text.secondary">
                      {q.label}
                    </Typography>
                    <Typography variant="body2">{diagnosis.answers[q.id] || "—"}</Typography>
                  </Box>
                ))}
              </Stack>
            </Section>

            <Section title="診断サマリー">
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                {resultBrief.summary}
              </Typography>
            </Section>

            <Section title="強み">
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {diagnosis.result.strengths.map((item) => (
                  <Chip key={item} label={item} size="small" />
                ))}
              </Stack>
            </Section>

            <Section title="おすすめの方向性">
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                {diagnosis.result.recommendedDirections.map((item) => (
                  <Chip key={item} label={item} size="small" color="primary" variant="outlined" />
                ))}
              </Stack>
            </Section>

            <Section title="ずばりあなたのキャリアパスは？">
              <Typography variant="body2" sx={{ lineHeight: 1.8, fontWeight: 600 }}>
                {getCareerPathDisplayLabel(diagnosis.result)}
              </Typography>
            </Section>

            <Section title="アドバイス">
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                {resultBrief.advice}
              </Typography>
            </Section>

            <Divider />

            <Typography variant="subtitle2">キャリアロードマップ（概要）</Typography>
            {(["shortTerm", "midTerm", "longTerm"] as const).map((key) => {
              const phase = roadmapBrief[key];
              const title =
                key === "shortTerm" ? "短期" : key === "midTerm" ? "中期" : "長期";
              return (
                <Section key={key} title={`${title}（${phase.period}）`}>
                  <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                    {phase.overview}
                  </Typography>
                </Section>
              );
            })}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
