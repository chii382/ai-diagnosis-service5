"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import type { DiagnosisDocument } from "@/lib/diagnosis/types";
import { glassCardSx } from "@/app/components/member/memberStyles";

interface DiagnosisEditFormProps {
  diagnosis: DiagnosisDocument;
}

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(items: string[]): string {
  return items.join("\n");
}

export default function DiagnosisEditForm({ diagnosis }: DiagnosisEditFormProps) {
  const router = useRouter();
  const [summary, setSummary] = useState(diagnosis.result.summary);
  const [advice, setAdvice] = useState(diagnosis.result.advice);
  const [strengthsText, setStrengthsText] = useState(arrayToLines(diagnosis.result.strengths));
  const [directionsText, setDirectionsText] = useState(
    arrayToLines(diagnosis.result.recommendedDirections),
  );
  const [shortGoals, setShortGoals] = useState(
    arrayToLines(diagnosis.careerRoadmap.shortTerm.goals),
  );
  const [shortActions, setShortActions] = useState(
    arrayToLines(diagnosis.careerRoadmap.shortTerm.actions),
  );
  const [midGoals, setMidGoals] = useState(arrayToLines(diagnosis.careerRoadmap.midTerm.goals));
  const [midActions, setMidActions] = useState(
    arrayToLines(diagnosis.careerRoadmap.midTerm.actions),
  );
  const [longGoals, setLongGoals] = useState(
    arrayToLines(diagnosis.careerRoadmap.longTerm.goals),
  );
  const [longActions, setLongActions] = useState(
    arrayToLines(diagnosis.careerRoadmap.longTerm.actions),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      result: {
        summary: summary.trim(),
        advice: advice.trim(),
        strengths: linesToArray(strengthsText),
        recommendedDirections: linesToArray(directionsText),
      },
      careerRoadmap: {
        shortTerm: {
          period: diagnosis.careerRoadmap.shortTerm.period,
          goals: linesToArray(shortGoals),
          actions: linesToArray(shortActions),
        },
        midTerm: {
          period: diagnosis.careerRoadmap.midTerm.period,
          goals: linesToArray(midGoals),
          actions: linesToArray(midActions),
        },
        longTerm: {
          period: diagnosis.careerRoadmap.longTerm.period,
          goals: linesToArray(longGoals),
          actions: linesToArray(longActions),
        },
      },
    };

    try {
      const response = await fetch(`/api/diagnosis/${diagnosis._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const raw = await response.text();
      let data: { error?: string } = {};
      if (raw) data = JSON.parse(raw) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "保存に失敗しました");
      setMessage({ type: "success", text: "診断結果を更新しました。" });
      router.push(`/diagnosis/${diagnosis._id}`);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "保存に失敗しました",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card sx={glassCardSx} component="form" onSubmit={handleSubmit}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            診断結果の編集
          </Typography>

          {message && <Alert severity={message.type}>{message.text}</Alert>}

          <TextField label="総合サマリー" multiline minRows={3} fullWidth value={summary} onChange={(e) => setSummary(e.target.value)} />
          <TextField label="強み（1行1項目）" multiline minRows={3} fullWidth value={strengthsText} onChange={(e) => setStrengthsText(e.target.value)} />
          <TextField label="おすすめ方向性（1行1項目）" multiline minRows={3} fullWidth value={directionsText} onChange={(e) => setDirectionsText(e.target.value)} />
          <TextField label="AIからのアドバイス" multiline minRows={3} fullWidth value={advice} onChange={(e) => setAdvice(e.target.value)} />

          <Typography sx={{ fontWeight: 700 }}>短期ロードマップ</Typography>
          <TextField label="目標（1行1項目）" multiline minRows={2} fullWidth value={shortGoals} onChange={(e) => setShortGoals(e.target.value)} />
          <TextField label="アクション（1行1項目）" multiline minRows={2} fullWidth value={shortActions} onChange={(e) => setShortActions(e.target.value)} />

          <Typography sx={{ fontWeight: 700 }}>中期ロードマップ</Typography>
          <TextField label="目標（1行1項目）" multiline minRows={2} fullWidth value={midGoals} onChange={(e) => setMidGoals(e.target.value)} />
          <TextField label="アクション（1行1項目）" multiline minRows={2} fullWidth value={midActions} onChange={(e) => setMidActions(e.target.value)} />

          <Typography sx={{ fontWeight: 700 }}>長期ロードマップ</Typography>
          <TextField label="目標（1行1項目）" multiline minRows={2} fullWidth value={longGoals} onChange={(e) => setLongGoals(e.target.value)} />
          <TextField label="アクション（1行1項目）" multiline minRows={2} fullWidth value={longActions} onChange={(e) => setLongActions(e.target.value)} />

          <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving}>
            {saving ? "保存中..." : "変更を保存"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
