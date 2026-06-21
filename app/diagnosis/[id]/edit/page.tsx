import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DiagnosisEditForm from "@/app/components/diagnosis/DiagnosisEditForm";
import MemberNav from "@/app/components/member/MemberNav";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";
import { eyebrowSx } from "@/app/components/member/memberStyles";
import { canEditDiagnosisResult, getDefaultUserPlan } from "@/lib/plan";
import { fetchDiagnosisForUser } from "@/lib/diagnosis/server";
import { resolveDiagnosisReturnTo } from "@/lib/diagnosis/navigation";

export const metadata = {
  title: "診断結果編集 | AIキャリア診断",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function DiagnosisEditPage({ params, searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const { returnTo: returnToParam } = await searchParams;
  const diagnosis = await fetchDiagnosisForUser(id, session.user.id);
  if (!diagnosis) {
    redirect("/diagnosis/history");
  }

  const plan = getDefaultUserPlan();
  if (!canEditDiagnosisResult(plan)) {
    redirect(`/diagnosis/result?id=${id}`);
  }

  const returnTo = resolveDiagnosisReturnTo(id, returnToParam);

  return (
    <Box sx={{ position: "relative", minHeight: "100svh", overflowX: "hidden" }}>
      <MemberCinematicBackground />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <MemberNav
          userName={session.user.name}
          userImage={session.user.image}
          transparent
        />
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography sx={eyebrowSx}>EDIT DIAGNOSIS</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                診断結果の編集
              </Typography>
            </Stack>
            <DiagnosisEditForm diagnosis={diagnosis} returnTo={returnTo} />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
