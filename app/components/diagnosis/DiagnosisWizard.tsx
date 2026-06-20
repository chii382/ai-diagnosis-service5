"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DiagnosisAnalyzingOverlay from "@/app/components/diagnosis/DiagnosisAnalyzingOverlay";
import { createEmptyAnswers, DIAGNOSIS_QUESTIONS } from "@/lib/diagnosis/questions";
import type { DiagnosisAnswers } from "@/lib/diagnosis/types";
import { glassCardSx } from "@/app/components/member/memberStyles";

const questionCardSx = (expanded: boolean, answered: boolean) =>
  ({
    border: expanded
      ? "1px solid rgba(96,165,250,0.45)"
      : "1px solid rgba(255,255,255,0.12)",
    borderRadius: 2,
    backgroundColor: expanded
      ? "rgba(56,123,255,0.08)"
      : answered
        ? "rgba(255,255,255,0.03)"
        : "rgba(255,255,255,0.04)",
    overflow: "hidden",
  }) as const;

export default function DiagnosisWizard() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(createEmptyAnswers());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const answeredCount = DIAGNOSIS_QUESTIONS.filter((q) => answers[q.id]).length;
  const progress = (answeredCount / DIAGNOSIS_QUESTIONS.length) * 100;
  const allAnswered = answeredCount === DIAGNOSIS_QUESTIONS.length;
  const hasAnsweredAny = answeredCount > 0;

  function navigateBack() {
    router.back();
  }

  function handleCancelClick() {
    if (submitting) return;
    if (hasAnsweredAny) {
      setCancelConfirmOpen(true);
      return;
    }
    navigateBack();
  }

  function handleCancelConfirmStay() {
    setCancelConfirmOpen(false);
  }

  function handleCancelConfirmOk() {
    setCancelConfirmOpen(false);
    navigateBack();
  }

  async function submitDiagnosis(finalAnswers: DiagnosisAnswers) {
    setSubmitting(true);
    setError(null);
    setExpandedIndex(-1);
    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const raw = await response.text();
      let data: { error?: string; _id?: string } = {};
      if (raw) {
        data = JSON.parse(raw) as { error?: string; _id?: string };
      }

      if (!response.ok || !data._id) {
        throw new Error(data.error ?? "診断の実行に失敗しました");
      }

      router.push(`/diagnosis/result?id=${data._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "診断の実行に失敗しました");
      setSubmitting(false);
    }
  }

  function handleSelect(questionIndex: number, questionId: keyof DiagnosisAnswers, value: string) {
    if (submitting) return;

    setError(null);
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    const isLast = questionIndex === DIAGNOSIS_QUESTIONS.length - 1;
    window.setTimeout(() => {
      setExpandedIndex(isLast ? -1 : questionIndex + 1);
    }, 300);
  }

  function handleQuestionToggle(index: number) {
    if (submitting) return;
    setExpandedIndex((prev) => (prev === index ? -1 : index));
  }

  function handleStartDiagnosis() {
    if (!allAnswered || submitting) return;
    void submitDiagnosis(answers);
  }

  return (
    <>
      {submitting && <DiagnosisAnalyzingOverlay />}

      <Card
        sx={{
          ...glassCardSx,
          position: "relative",
          zIndex: 1,
          pointerEvents: "auto",
          backdropFilter: "none",
          backgroundColor: "rgba(8, 12, 24, 0.82)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "flex-start" }}
            >
              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>
                  {`回答済み ${answeredCount} / ${DIAGNOSIS_QUESTIONS.length}`}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #387bff, #22d3ee)",
                    },
                  }}
                />
              </Stack>
              <Button
                type="button"
                variant="outlined"
                disabled={submitting}
                onClick={handleCancelClick}
                sx={{
                  alignSelf: { xs: "flex-end", sm: "center" },
                  flexShrink: 0,
                  borderColor: "rgba(255,255,255,0.22)",
                  color: "rgba(255,255,255,0.78)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.35)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                キャンセル
              </Button>
            </Stack>

            <Stack spacing={1.25}>
              {DIAGNOSIS_QUESTIONS.map((question, questionIndex) => {
                const selectedAnswer = answers[question.id];
                const isAnswered = Boolean(selectedAnswer);
                const isExpanded = expandedIndex === questionIndex;

                return (
                  <Box key={question.id} sx={questionCardSx(isExpanded, isAnswered)}>
                    <Box
                      component="button"
                      type="button"
                      disabled={submitting}
                      onClick={() => handleQuestionToggle(questionIndex)}
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 2,
                        border: "none",
                        background: "transparent",
                        color: "inherit",
                        cursor: submitting ? "not-allowed" : "pointer",
                        textAlign: "left",
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontWeight: 600,
                          fontSize: { xs: "0.92rem", md: "1rem" },
                          lineHeight: 1.5,
                          color: "rgba(255,255,255,0.92)",
                        }}
                      >
                        {question.label}
                      </Typography>
                      {isAnswered && (
                        <Stack
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                          sx={{
                            display: { xs: "none", sm: "flex" },
                            maxWidth: "45%",
                          }}
                        >
                          <CheckCircleOutlineIcon
                            sx={{ fontSize: 18, color: "#22d3ee", flexShrink: 0 }}
                          />
                          <Typography
                            noWrap
                            sx={{
                              fontSize: "0.85rem",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            {selectedAnswer}
                          </Typography>
                        </Stack>
                      )}
                      <ExpandMoreIcon
                        sx={{
                          color: "rgba(255,255,255,0.55)",
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </Box>

                    <Collapse in={isExpanded} timeout={240}>
                      <Box sx={{ px: 2, pt: 0, pb: 2 }}>
                        <Stack spacing={1.5}>
                          {isAnswered && (
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="flex-start"
                              sx={{ display: { xs: "flex", sm: "none" } }}
                            >
                              <CheckCircleOutlineIcon
                                sx={{ fontSize: 18, color: "#22d3ee", mt: 0.25, flexShrink: 0 }}
                              />
                              <Typography
                                sx={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}
                              >
                                {selectedAnswer}
                              </Typography>
                            </Stack>
                          )}

                          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>
                            {question.helperText}
                          </Typography>

                          <Stack spacing={1.25}>
                            {question.options.map((option, optionIndex) => {
                              const selected = selectedAnswer === option;
                              return (
                                <Button
                                  key={option}
                                  type="button"
                                  fullWidth
                                  disabled={submitting}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleSelect(questionIndex, question.id, option);
                                  }}
                                  sx={{
                                    justifyContent: "flex-start",
                                    textAlign: "left",
                                    py: 1.5,
                                    px: 2,
                                    borderRadius: 2,
                                    border: selected
                                      ? "1px solid rgba(96,165,250,0.65)"
                                      : "1px solid rgba(255,255,255,0.12)",
                                    backgroundColor: selected
                                      ? "rgba(56,123,255,0.22)"
                                      : "rgba(255,255,255,0.04)",
                                    color: "rgba(255,255,255,0.92)",
                                    whiteSpace: "normal",
                                    lineHeight: 1.6,
                                    "&:hover": {
                                      backgroundColor: selected
                                        ? "rgba(56,123,255,0.28)"
                                        : "rgba(255,255,255,0.08)",
                                      borderColor: "rgba(96,165,250,0.45)",
                                    },
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="flex-start"
                                    sx={{ width: "100%" }}
                                  >
                                    <Box
                                      sx={{
                                        minWidth: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        backgroundColor: selected
                                          ? "rgba(56,123,255,0.35)"
                                          : "rgba(255,255,255,0.08)",
                                        color: selected ? "#fff" : "rgba(255,255,255,0.7)",
                                      }}
                                    >
                                      {selected ? (
                                        <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                                      ) : (
                                        optionIndex + 1
                                      )}
                                    </Box>
                                    <Typography
                                      sx={{ flex: 1, fontSize: "0.95rem", lineHeight: 1.65 }}
                                    >
                                      {option}
                                    </Typography>
                                  </Stack>
                                </Button>
                              );
                            })}
                          </Stack>
                        </Stack>
                      </Box>
                    </Collapse>
                  </Box>
                );
              })}
            </Stack>

            {!allAnswered && (
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>
                ※ すべての質問（5問）に回答すると診断を開始できます
              </Typography>
            )}

            {allAnswered && !submitting && (
              <Stack spacing={1.5} className="diagnosis-start-cta">
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<AutoAwesomeIcon />}
                  onClick={handleStartDiagnosis}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderRadius: 2.5,
                    background: "linear-gradient(90deg, #387bff 0%, #22d3ee 100%)",
                    boxShadow: "0 8px 32px rgba(56,123,255,0.4)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #4d8bff 0%, #3dd9f0 100%)",
                      boxShadow: "0 12px 40px rgba(56,123,255,0.5)",
                    },
                  }}
                >
                  診断を始める
                </Button>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", textAlign: "center" }}
                >
                  回答内容を確認してから、診断を開始してください
                </Typography>
              </Stack>
            )}

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={cancelConfirmOpen}
        onClose={handleCancelConfirmStay}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>診断のキャンセル</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            診断内容は破棄されます。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelConfirmStay}>キャンセル</Button>
          <Button onClick={handleCancelConfirmOk} variant="contained" color="error">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
