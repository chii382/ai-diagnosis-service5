import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import StarIcon from "@mui/icons-material/Star";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PanelBackground from "@/app/components/common/PanelBackground";
import LoggedOutCTA from "@/app/components/common/LoggedOutCTA";
import PricingPlanFeatures from "@/app/components/PricingPlanFeatures";
import CheckoutButton from "@/app/components/CheckoutButton";

type PlanTier = {
  id: "free" | "standard" | "premium";
  name: string;
  priceLabel: string;
  priceNote: string;
  description: string;
  accent: string;
  glow: string;
  icon: typeof AutoAwesomeIcon;
  badge?: string;
  highlight?: boolean;
  features: string[];
  footnote?: string;
};

const descriptionTextSx = {
  mt: 1,
  color: "rgba(255,255,255,0.72)",
  fontSize: "0.88rem",
  lineHeight: 1.7,
  wordBreak: "keep-all",
  overflowWrap: "break-word",
  lineBreak: "strict",
  textWrap: "pretty",
} as const;

const plans: PlanTier[] = [
  {
    id: "free",
    name: "無料プラン",
    priceLabel: "¥0",
    priceNote: "まずはここから",
    description: "5問の診断と、キャリアの方向性をつかむ基本レポート。",
    accent: "#22d3ee",
    glow: "rgba(34,211,238,0.22)",
    icon: AutoAwesomeIcon,
    features: [
      "AI診断結果\n（強み・方向性・キャリアパス）",
      "AIからのアドバイス",
      "キャリアロードマップ\n（各期間の方針概要）",
      "診断履歴の保存\n（会員登録後）",
    ],
  },
  {
    id: "standard",
    name: "有料（スタンダード）",
    priceLabel: "¥980/月",
    priceNote: "",
    description: "分析を深め、次の一手まで具体化したい方向け。",
    accent: "#818cf8",
    glow: "rgba(129,140,248,0.28)",
    icon: WorkspacePremiumIcon,
    badge: "おすすめ",
    highlight: true,
    features: [
      "無料プランのすべて",
      "詳細キャリアロードマップ\n（目標と具体アクション）",
      "適性バランス分析：強みの可視化",
      "診断結果の編集・再保存",
    ],
  },
  {
    id: "premium",
    name: "有料（宇宙級）",
    priceLabel: "準備中",
    priceNote: "順次公開予定",
    description: "キャリアの未来を、体験として「感じる」最上位プラン。",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.28)",
    icon: RocketLaunchIcon,
    badge: "宇宙級",
    features: [
      "スタンダードプランのすべて",
      "AI未来像シネマ\n（未来キャリアを動画風に体験）",
      "3年後の自分からのレター\n（AI未来メッセージ）",
      "Galaxy Career Map\n（キャリア分岐の宇宙マップ可視化）",
      "音声ナレーション付き診断サマリー",
      "SNSシェア用ビジュアルカード",
    ],
    footnote: "※ 宇宙級限定コンテンツは順次リリース予定です",
  },
];

export default function PricingSection() {
  return (
    <Box
      id="pricing"
      component="section"
      sx={{
        position: "relative",
        backgroundColor: "#000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        py: { xs: 10, md: 12 },
      }}
    >
      <PanelBackground
        src="/images/pricing-section-bg.png"
        position="center center"
        backgroundSize="cover"
        mobileBackgroundSize="cover"
        animated={false}
        overlay="linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.38) 100%)"
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: { xs: "0.7rem", md: "0.8rem" },
              fontWeight: 600,
              letterSpacing: "0.35em",
            }}
          >
            PRICING
          </Typography>
          <Typography
            variant="h2"
            sx={{ color: "#fff", fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.25 }}
          >
            料金プラン
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.72)",
              maxWidth: 640,
              lineHeight: 1.85,
              fontSize: { xs: "0.92rem", md: "1rem" },
            }}
          >
            まずは無料で診断体験。より深い分析と未来体験は、有料プランで順次提供します。
          </Typography>
        </Stack>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(8,12,24,0.45)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <Grid container spacing={{ xs: 2.5, md: 2 }} alignItems="stretch">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Grid key={plan.id} size={{ xs: 12, md: 4 }}>
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      p: { xs: 3, md: 3.25 },
                      borderRadius: 3,
                      border: `1px solid ${plan.accent}${plan.highlight ? "" : "66"}`,
                      background: `linear-gradient(180deg, ${plan.accent}14 0%, rgba(0,0,0,0.32) 100%)`,
                      boxShadow: plan.highlight
                        ? `0 0 0 1px ${plan.accent}, 0 20px 60px ${plan.glow}`
                        : `0 12px 40px ${plan.glow}`,
                      transform: { md: plan.highlight ? "translateY(-10px)" : "none" },
                    }}
                  >
                    {plan.badge && (
                      <Chip
                        icon={plan.id === "premium" ? <StarIcon /> : undefined}
                        label={plan.badge}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          backgroundColor: plan.accent,
                          color: "#0a0a0a",
                          fontWeight: 700,
                          "& .MuiChip-icon": { color: "#0a0a0a" },
                        }}
                      />
                    )}

                    <Stack spacing={2} sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `1px solid ${plan.accent}80`,
                            background: `radial-gradient(circle, ${plan.accent}33 0%, transparent 70%)`,
                          }}
                        >
                          <Icon sx={{ fontSize: 24, color: plan.accent }} />
                        </Box>
                        <Box sx={{ minWidth: 0, pr: plan.badge ? 5 : 0 }}>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "1.05rem",
                              wordBreak: "keep-all",
                              lineBreak: "strict",
                            }}
                          >
                            {plan.name}
                          </Typography>
                          {plan.priceNote ? (
                            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>
                              {plan.priceNote}
                            </Typography>
                          ) : null}
                        </Box>
                      </Stack>

                      <Box>
                        <Typography
                          sx={{
                            color: plan.accent,
                            fontWeight: 800,
                            fontSize: plan.id === "free" ? "2rem" : "1.35rem",
                            lineHeight: 1.2,
                          }}
                        >
                          {plan.priceLabel}
                        </Typography>
                        <Typography sx={descriptionTextSx}>
                          {plan.description}
                        </Typography>
                      </Box>

                      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                      <PricingPlanFeatures
                        planId={plan.id}
                        accent={plan.accent}
                        features={plan.features}
                        footnote={plan.footnote}
                      />

                      {plan.id === "standard" && (
                        <CheckoutButton
                          label="スタンダードプランを購入する（¥980）"
                          variant="contained"
                          fullWidth
                        />
                      )}
                    </Stack>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          <Stack spacing={2} alignItems="center" sx={{ mt: { xs: 3, md: 4 }, textAlign: "center" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", lineHeight: 1.7 }}>
              有料（スタンダード）・有料（宇宙級）プランは順次公開予定です。公開時期はお知らせでご案内します。
            </Typography>
            <LoggedOutCTA appearance="outline" />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
