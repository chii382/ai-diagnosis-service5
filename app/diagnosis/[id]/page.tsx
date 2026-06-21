import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DiagnosisResultView from "@/app/components/diagnosis/DiagnosisResultView";
import MemberPageShell from "@/app/components/member/MemberPageShell";
import { eyebrowSx } from "@/app/components/member/memberStyles";
import { fetchDiagnosisForUser } from "@/lib/diagnosis/server";

export const metadata = {
  title: "診断結果詳細 | AIキャリア診断",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiagnosisDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const diagnosis = await fetchDiagnosisForUser(id, session.user.id);
  if (!diagnosis) {
    redirect("/diagnosis/history");
  }

  return (
    <MemberPageShell
      userName={session.user.name}
      userImage={session.user.image}
      background="diagnosis-result"
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography sx={eyebrowSx}>DIAGNOSIS DETAIL</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              診断結果詳細
            </Typography>
          </Stack>
          <DiagnosisResultView diagnosis={diagnosis} returnTo={`/diagnosis/${id}`} />
        </Stack>
      </Container>
    </MemberPageShell>
  );
}
