import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DiagnosisResultView from "@/app/components/diagnosis/DiagnosisResultView";
import MemberPageShell from "@/app/components/member/MemberPageShell";
import { eyebrowSx } from "@/app/components/member/memberStyles";
import { fetchDiagnosisForUser } from "@/lib/diagnosis/server";
import { fetchUserPlanForUser } from "@/lib/user/server";

export const metadata = {
  title: "診断結果 | AIキャリア診断",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function DiagnosisResultPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/diagnosis/result");
  }

  const { id } = await searchParams;
  if (!id) {
    redirect("/diagnosis/history");
  }

  const diagnosis = await fetchDiagnosisForUser(id, session.user.id);
  if (!diagnosis) {
    redirect("/diagnosis/history");
  }

  const plan = await fetchUserPlanForUser(session.user.id);

  return (
    <MemberPageShell
      userName={session.user.name}
      userImage={session.user.image}
      background="diagnosis-result"
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography sx={eyebrowSx}>DIAGNOSIS RESULT</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              あなたの診断結果
            </Typography>
          </Stack>
          <DiagnosisResultView diagnosis={diagnosis} plan={plan} returnTo={`/diagnosis/result?id=${id}`} />
        </Stack>
      </Container>
    </MemberPageShell>
  );
}
