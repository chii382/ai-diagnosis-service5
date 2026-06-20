import { auth } from "@/auth";
import { buildDiagnosisProfileContext } from "@/lib/diagnosis/profile-context";
import { getUsersCollection } from "@/lib/mongodb";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DiagnosisWizard from "@/app/components/diagnosis/DiagnosisWizard";
import MemberPageShell from "@/app/components/member/MemberPageShell";
import { eyebrowSx } from "@/app/components/member/memberStyles";
import { ObjectId } from "mongodb";

export const metadata = {
  title: "キャリア診断 | AIキャリア診断",
};

export default async function DiagnosisPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/diagnosis");
  }

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(session.user.id) });
  const usesProfileContext = Boolean(
    user &&
      buildDiagnosisProfileContext({
        name: user.name,
        gender: user.gender,
        ageRange: user.ageRange,
        occupation: user.occupation,
        bio: user.bio,
      }),
  );

  return (
    <MemberPageShell userName={session.user.name} userImage={session.user.image}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography sx={eyebrowSx}>CAREER DIAGNOSIS</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              5問キャリア診断
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>
              5つの質問に答えるだけで、AIがあなたの強みとキャリアロードマップを提案します。各問4択から選んでください。
            </Typography>
            {usesProfileContext && (
              <Typography sx={{ color: "rgba(96,165,250,0.9)", fontSize: "0.85rem", lineHeight: 1.7 }}>
                プロフィールに入力された情報（性別・年代・職業・自己紹介など）も診断結果に反映されます。
              </Typography>
            )}
          </Stack>
          <DiagnosisWizard />
        </Stack>
      </Container>
    </MemberPageShell>
  );
}
