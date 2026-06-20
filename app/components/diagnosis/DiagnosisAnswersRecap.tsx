import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { DIAGNOSIS_QUESTIONS } from "@/lib/diagnosis/questions";
import type { DiagnosisAnswers } from "@/lib/diagnosis/types";
import { eyebrowSx, glassCardSx } from "@/app/components/member/memberStyles";
import { jpTextSx } from "@/lib/typography";

interface DiagnosisAnswersRecapProps {
  answers: DiagnosisAnswers;
  createdAt?: string;
}

export default function DiagnosisAnswersRecap({ answers, createdAt }: DiagnosisAnswersRecapProps) {
  return (
    <Card
      sx={{
        ...glassCardSx,
        position: "relative",
        zIndex: 1,
        backgroundColor: "rgba(8,12,24,0.88)",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Stack spacing={0.5}>
              <Typography sx={eyebrowSx}>YOUR ANSWERS</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: "0.95rem", md: "1rem" } }}>
                あなたの回答
              </Typography>
            </Stack>
            {createdAt && (
              <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                診断日時: {createdAt}
              </Typography>
            )}
          </Stack>

          <Grid container spacing={1.5}>
            {DIAGNOSIS_QUESTIONS.map((question, index) => {
              const answer = answers[question.id];
              if (!answer) return null;

              return (
                <Grid key={question.id} size={{ xs: 12, md: index === 4 ? 12 : 6 }}>
                  <Box
                    sx={{
                      p: { xs: 1.5, md: 1.75 },
                      borderRadius: 2,
                      backgroundColor: "rgba(15,23,42,0.72)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      height: "100%",
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "rgba(147,197,253,0.9)",
                          backgroundColor: "rgba(56,123,255,0.12)",
                          border: "1px solid rgba(96,165,250,0.2)",
                        }}
                      >
                        Q{index + 1}
                      </Box>
                      <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            ...jpTextSx,
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.78rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {question.label}
                        </Typography>
                        <Stack direction="row" spacing={0.75} alignItems="flex-start">
                          <CheckCircleOutlineIcon
                            sx={{
                              fontSize: 16,
                              color: "rgba(34,211,238,0.75)",
                              mt: 0.2,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              ...jpTextSx,
                              color: "rgba(255,255,255,0.82)",
                              fontSize: { xs: "0.85rem", md: "0.88rem" },
                              lineHeight: 1.65,
                              fontWeight: 500,
                            }}
                          >
                            {answer}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
