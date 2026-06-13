import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import PanelBackground from "@/app/components/common/PanelBackground";

interface Pain {
  title: string;
  description: string;
}

const pains: Pain[] = [
  {
    title: "将来のキャリアが、なんとなく不安",
    description:
      "この先も今の仕事を続けていいのか。先が見えないまま、ずっとモヤモヤしている。",
  },
  {
    title: "自分の強みが、うまく言葉にならない",
    description:
      "できることはある。でも「これが自分の武器」と、まだ言い切れない。",
  },
  {
    title: "今の仕事に、しっくりこない",
    description:
      "やるべきことはこなせている。それでも、充実感や成長実感が持てない。",
  },
  {
    title: "もっと伸ばせるはず、と感じている",
    description:
      "まだまだいける気がする。ただ、何から始めればいいかがわからない。",
  },
];

const cardSx = {
  height: "100%",
  p: { xs: 2, sm: 2.5, md: 2.75 },
  borderRadius: 3,
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  transition: "background-color .25s ease, border-color .25s ease",
  "@media (hover: hover)": {
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.09)",
      borderColor: "rgba(96,165,250,0.35)",
    },
  },
};

export default function PainSection() {
  return (
    <Box
      id="pain"
      component="section"
      sx={{
        position: "relative",
        backgroundColor: "#0a1020",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        py: { xs: 8, sm: 10, md: 12 },
        contentVisibility: "auto",
        containIntrinsicSize: "auto 720px",
      }}
    >
      <PanelBackground
        src="/images/pain-cosmos.png"
        position="center"
        overlay="linear-gradient(180deg, rgba(10,16,32,0.55) 0%, rgba(10,16,32,0.35) 50%, rgba(10,16,32,0.55) 100%)"
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 5 }}
          alignItems={{ xs: "flex-start", sm: "stretch" }}
        >
          {/* 左：挿絵（縦長・シャープ） */}
          <Grid
            size={{ xs: 12, sm: 4, md: 4 }}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "center" },
              alignItems: { xs: "center", sm: "flex-start", md: "center" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: 200, sm: 240, md: 300, lg: 340 },
                borderRadius: { xs: 2.5, sm: 3 },
                overflow: "hidden",
                boxShadow: "0 16px 48px rgba(56,123,255,0.16)",
                border: "1px solid rgba(255,255,255,0.12)",
                aspectRatio: "2 / 3",
                flexShrink: 0,
              }}
            >
              <Image
                src="/images/pain-hero.png"
                alt="悩みを抱えながら宇宙を見上げる人"
                width={900}
                height={1350}
                quality={92}
                sizes="(max-width: 600px) 200px, (max-width: 900px) 240px, 340px"
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 22%",
                  display: "block",
                }}
              />
            </Box>
          </Grid>

          {/* 右：見出し＋カード */}
          <Grid size={{ xs: 12, sm: 8, md: 8 }}>
            <Stack spacing={{ xs: 2, sm: 2.5, md: 3.5 }} sx={{ height: "100%" }}>
              <Stack spacing={1.25} textAlign="left">
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: { xs: "0.68rem", md: "0.8rem" },
                    fontWeight: 600,
                    letterSpacing: "0.35em",
                  }}
                >
                  YOUR CONCERNS
                </Typography>
                <Typography
                  component="h2"
                  variant="h2"
                  sx={{
                    color: "#fff",
                    fontSize: { xs: "1.15rem", sm: "1.85rem", md: "2.25rem" },
                    lineHeight: 1.35,
                    textWrap: "balance",
                  }}
                >
                  こんなお悩み、
                  <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
                    ありませんか？
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.78)",
                    fontSize: { xs: "0.8rem", sm: "0.95rem", md: "1.05rem" },
                    lineHeight: 1.8,
                    textWrap: "pretty",
                  }}
                >
                  どれかひとつでも当てはまるなら、
                  <Box component="span" sx={{ display: { xs: "block", lg: "inline" } }}>
                    答えは意外と近くにあります。
                  </Box>
                  <Box component="span" sx={{ display: { xs: "block", lg: "inline" } }}>
                    5問の診断から、始めてみてください。
                  </Box>
                </Typography>
              </Stack>

              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                {pains.map((p) => (
                  <Grid key={p.title} size={{ xs: 12, sm: 6 }}>
                    <Box sx={cardSx}>
                      <Stack spacing={0.875}>
                        <Typography
                          component="h3"
                          variant="h3"
                          sx={{
                            color: "#fff",
                            fontSize: { xs: "0.95rem", sm: "1.02rem", md: "1.1rem" },
                            lineHeight: 1.5,
                            textWrap: "balance",
                          }}
                        >
                          {p.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.72)",
                            fontSize: { xs: "0.82rem", sm: "0.88rem", md: "0.92rem" },
                            lineHeight: 1.75,
                            textWrap: "pretty",
                          }}
                        >
                          {p.description}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
