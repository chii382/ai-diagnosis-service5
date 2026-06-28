import Link from "next/link";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { auth } from "@/auth";
import { getPlanLabel } from "@/lib/plan";
import { fulfillCheckoutSessionById } from "@/lib/stripe/fulfill-checkout";

export const metadata = {
  title: "お支払い受付 | AIキャリア診断",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { session_id: checkoutSessionId } = await searchParams;
  const session = await auth();

  if (!session?.user?.id) {
    const callbackUrl = checkoutSessionId
      ? `/checkout/success?session_id=${encodeURIComponent(checkoutSessionId)}`
      : "/checkout/success";
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let planApplied = false;
  let planLabel: string | null = null;

  if (checkoutSessionId) {
    const result = await fulfillCheckoutSessionById(checkoutSessionId, session.user.id);
    planApplied = result.ok;
    if (result.plan) {
      planLabel = getPlanLabel(result.plan);
    }
  }

  return (
    <Box sx={{ minHeight: "100svh", backgroundColor: "#050810", py: 8 }}>
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="flex-start">
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
            お支払いを受け付けました
          </Typography>
          {planApplied && planLabel ? (
            <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
              お手続きありがとうございます。{planLabel}が有効になりました。マイページや診断結果で有料機能をご利用いただけます。
            </Typography>
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
              お手続きありがとうございます。有料プランの反映に少々時間がかかる場合があります。マイページを再読み込みしてご確認ください。
            </Typography>
          )}
          <Button component={Link} href="/dashboard" variant="contained">
            マイページへ
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
