"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePendingRouter } from "@/app/hooks/usePendingRouter";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import { getResolvedCareerPath } from "@/lib/diagnosis/career-path-headline";
import {
  CAREER_PATH_CATEGORIES,
  CAREER_PATH_PATTERNS,
  getCareerPathPatternLabel,
} from "@/lib/diagnosis/career-path-patterns";
import { resolveRoadmapBrief } from "@/lib/diagnosis/plan-content";
import type { DiagnosisDocument } from "@/lib/diagnosis/types";
import { glassCardSx } from "@/app/components/member/memberStyles";
import { canViewPremiumContent, type UserPlan } from "@/lib/plan";

interface DiagnosisEditFormProps {
  diagnosis: DiagnosisDocument;
  plan: UserPlan;
  returnTo: string;
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

export default function DiagnosisEditForm({ diagnosis, plan, returnTo }: DiagnosisEditFormProps) {
  const router = usePendingRouter();
  const isPremium = canViewPremiumContent(plan);
  const initialRoadmapBrief = resolveRoadmapBrief(diagnosis);

  const initialCareerPathPatternId = getResolvedCareerPath(diagnosis.result, {
    answers: diagnosis.answers,
  }).patternId;

  const [summary, setSummary] = useState(diagnosis.result.summary);
  const [advice, setAdvice] = useState(diagnosis.result.advice);
  const [strengthsText, setStrengthsText] = useState(arrayToLines(diagnosis.result.strengths));
  const [directionsText, setDirectionsText] = useState(
    arrayToLines(diagnosis.result.recommendedDirections),
  );
  const [careerPathPatternId, setCareerPathPatternId] = useState(initialCareerPathPatternId);
  const [shortOverview, setShortOverview] = useState(initialRoadmapBrief.shortTerm.overview);
  const [midOverview, setMidOverview] = useState(initialRoadmapBrief.midTerm.overview);
  const [longOverview, setLongOverview] = useState(initialRoadmapBrief.longTerm.overview);
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
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const isDirty = useMemo(() => {
    const { result } = diagnosis;
    const resultDirty =
      summary !== result.summary ||
      advice !== result.advice ||
      strengthsText !== arrayToLines(result.strengths) ||
      directionsText !== arrayToLines(result.recommendedDirections) ||
      careerPathPatternId !==
        getResolvedCareerPath(result, { answers: diagnosis.answers }).patternId;

    if (isPremium) {
      const { careerRoadmap } = diagnosis;
      return (
        resultDirty ||
        shortGoals !== arrayToLines(careerRoadmap.shortTerm.goals) ||
        shortActions !== arrayToLines(careerRoadmap.shortTerm.actions) ||
        midGoals !== arrayToLines(careerRoadmap.midTerm.goals) ||
        midActions !== arrayToLines(careerRoadmap.midTerm.actions) ||
        longGoals !== arrayToLines(careerRoadmap.longTerm.goals) ||
        longActions !== arrayToLines(careerRoadmap.longTerm.actions)
      );
    }

    return (
      resultDirty ||
      shortOverview !== initialRoadmapBrief.shortTerm.overview ||
      midOverview !== initialRoadmapBrief.midTerm.overview ||
      longOverview !== initialRoadmapBrief.longTerm.overview
    );
  }, [
    diagnosis,
    isPremium,
    initialRoadmapBrief,
    summary,
    advice,
    strengthsText,
    directionsText,
    careerPathPatternId,
    shortOverview,
    midOverview,
    longOverview,
    shortGoals,
    shortActions,
    midGoals,
    midActions,
    longGoals,
    longActions,
  ]);

  function navigateBack() {
    router.replace(returnTo);
    router.refresh();
  }

  function handleCancelClick() {
    if (saving) return;
    if (isDirty) {
      setDiscardConfirmOpen(true);
      return;
    }
    navigateBack();
  }

  function handleDiscardStay() {
    setDiscardConfirmOpen(false);
  }

  function handleDiscardConfirm() {
    setDiscardConfirmOpen(false);
    navigateBack();
  }

  function openSaveConfirm() {
    if (saving || !isDirty) return;
    setSaveConfirmOpen(true);
  }

  function handleSaveClick(event: FormEvent) {
    event.preventDefault();
    openSaveConfirm();
  }

  function handleSaveCancel() {
    setSaveConfirmOpen(false);
  }

  async function performSave() {
    setSaveConfirmOpen(false);
    setSaving(true);
    setMessage(null);
    startProcessingPending();

    const payload: Record<string, unknown> = {
      result: {
        summary: summary.trim(),
        advice: advice.trim(),
        strengths: linesToArray(strengthsText),
        recommendedDirections: linesToArray(directionsText),
        careerPathPatternId,
      },
      careerRoadmap: {
        shortTerm: {
          period: diagnosis.careerRoadmap.shortTerm.period,
          goals: isPremium ? linesToArray(shortGoals) : diagnosis.careerRoadmap.shortTerm.goals,
          actions: isPremium
            ? linesToArray(shortActions)
            : diagnosis.careerRoadmap.shortTerm.actions,
        },
        midTerm: {
          period: diagnosis.careerRoadmap.midTerm.period,
          goals: isPremium ? linesToArray(midGoals) : diagnosis.careerRoadmap.midTerm.goals,
          actions: isPremium ? linesToArray(midActions) : diagnosis.careerRoadmap.midTerm.actions,
        },
        longTerm: {
          period: diagnosis.careerRoadmap.longTerm.period,
          goals: isPremium ? linesToArray(longGoals) : diagnosis.careerRoadmap.longTerm.goals,
          actions: isPremium
            ? linesToArray(longActions)
            : diagnosis.careerRoadmap.longTerm.actions,
        },
      },
    };

    if (!isPremium) {
      payload.careerRoadmapBrief = {
        shortTerm: {
          period: initialRoadmapBrief.shortTerm.period,
          overview: shortOverview.trim(),
          highlights: initialRoadmapBrief.shortTerm.highlights,
        },
        midTerm: {
          period: initialRoadmapBrief.midTerm.period,
          overview: midOverview.trim(),
          highlights: initialRoadmapBrief.midTerm.highlights,
        },
        longTerm: {
          period: initialRoadmapBrief.longTerm.period,
          overview: longOverview.trim(),
          highlights: initialRoadmapBrief.longTerm.highlights,
        },
      };
    }

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
      router.replace(returnTo);
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "保存に失敗しました",
      });
    } finally {
      setSaving(false);
      stopProcessingPending();
    }
  }

  return (
    <>
      <Card sx={glassCardSx} component="form" onSubmit={handleSaveClick}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              診断結果の編集
            </Typography>

            {message && <Alert severity={message.type}>{message.text}</Alert>}

            <TextField
              label="総合サマリー"
              multiline
              minRows={3}
              fullWidth
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <TextField
              label="強み（1行1項目）"
              multiline
              minRows={3}
              fullWidth
              value={strengthsText}
              onChange={(e) => setStrengthsText(e.target.value)}
            />
            <TextField
              label="おすすめ方向性（1行1項目）"
              multiline
              minRows={3}
              fullWidth
              value={directionsText}
              onChange={(e) => setDirectionsText(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="career-path-pattern-label">ずばりあなたのキャリアパスは？</InputLabel>
              <Select
                labelId="career-path-pattern-label"
                label="ずばりあなたのキャリアパスは？"
                value={careerPathPatternId}
                onChange={(e) => setCareerPathPatternId(e.target.value)}
              >
                {CAREER_PATH_CATEGORIES.map((category) => [
                  <ListSubheader key={`cat-${category.id}`}>{category.label}</ListSubheader>,
                  ...CAREER_PATH_PATTERNS.filter((pattern) => pattern.categoryId === category.id).map(
                    (pattern) => (
                      <MenuItem key={pattern.id} value={pattern.id}>
                        {pattern.label}
                      </MenuItem>
                    ),
                  ),
                ])}
              </Select>
              <Typography sx={{ mt: 1, color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>
                選択中: {getCareerPathPatternLabel(careerPathPatternId)}
              </Typography>
            </FormControl>
            <TextField
              label="AIからのアドバイス"
              multiline
              minRows={3}
              fullWidth
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />

            {isPremium ? (
              <>
                <Typography sx={{ fontWeight: 700 }}>短期ロードマップ</Typography>
                <TextField
                  label="目標（1行1項目）"
                  multiline
                  minRows={2}
                  fullWidth
                  value={shortGoals}
                  onChange={(e) => setShortGoals(e.target.value)}
                />
                <TextField
                  label="アクション（1行1項目）"
                  multiline
                  minRows={2}
                  fullWidth
                  value={shortActions}
                  onChange={(e) => setShortActions(e.target.value)}
                />

                <Typography sx={{ fontWeight: 700 }}>中期ロードマップ</Typography>
                <TextField
                  label="目標（1行1項目）"
                  multiline
                  minRows={2}
                  fullWidth
                  value={midGoals}
                  onChange={(e) => setMidGoals(e.target.value)}
                />
                <TextField
                  label="アクション（1行1項目）"
                  multiline
                  minRows={2}
                  fullWidth
                  value={midActions}
                  onChange={(e) => setMidActions(e.target.value)}
                />

                <Typography sx={{ fontWeight: 700 }}>長期ロードマップ</Typography>
                <TextField
                  label="目標（1行1項目）"
                  multiline
                  minRows={2}
                  fullWidth
                  value={longGoals}
                  onChange={(e) => setLongGoals(e.target.value)}
                />
                <TextField
                  label="アクション（1行1項目）"
                  multiline
                  minRows={2}
                  fullWidth
                  value={longActions}
                  onChange={(e) => setLongActions(e.target.value)}
                />
              </>
            ) : (
              <>
                <Typography sx={{ fontWeight: 700 }}>キャリアロードマップ（無料版）</Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>
                  結果画面に表示される各期間の方針概要を編集できます。
                </Typography>

                <TextField
                  label={`短期（${initialRoadmapBrief.shortTerm.period}）方針概要`}
                  multiline
                  minRows={3}
                  fullWidth
                  value={shortOverview}
                  onChange={(e) => setShortOverview(e.target.value)}
                />
                <TextField
                  label={`中期（${initialRoadmapBrief.midTerm.period}）方針概要`}
                  multiline
                  minRows={3}
                  fullWidth
                  value={midOverview}
                  onChange={(e) => setMidOverview(e.target.value)}
                />
                <TextField
                  label={`長期（${initialRoadmapBrief.longTerm.period}）方針概要`}
                  multiline
                  minRows={3}
                  fullWidth
                  value={longOverview}
                  onChange={(e) => setLongOverview(e.target.value)}
                />
              </>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                type="button"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={!isDirty || saving}
                onClick={openSaveConfirm}
              >
                {saving ? "保存中..." : "変更を保存"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancelClick}
                disabled={saving}
                sx={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
              >
                キャンセル
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={discardConfirmOpen} onClose={handleDiscardStay} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>編集内容の破棄</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            編集内容が破棄されます。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDiscardStay}>キャンセル</Button>
          <Button onClick={handleDiscardConfirm} variant="contained" color="error">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={saveConfirmOpen} onClose={handleSaveCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>変更の保存</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            編集内容を保存します。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleSaveCancel} disabled={saving}>
            キャンセル
          </Button>
          <Button onClick={performSave} variant="contained" disabled={saving}>
            {saving ? "保存中..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
