import { auth } from "@/auth";
import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MemberNav from "@/app/components/member/MemberNav";
import MemberVideoBackground from "@/app/components/member/MemberVideoBackground";
import ProfileForm, { ProfileData } from "@/app/profile/ProfileForm";
import PlanStatusBadge from "@/app/components/member/PlanStatusBadge";
import { normalizeUserPlan } from "@/lib/plan";
import { resolveInternalReturnTo } from "@/lib/navigation";

export const metadata = {
  title: "プロフィール | AIキャリア診断",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function ProfilePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { returnTo: returnToParam } = await searchParams;
  const returnTo = resolveInternalReturnTo("/dashboard", returnToParam);

  const users = await getUsersCollection();
  const user = await users.findOne({ _id: new ObjectId(session.user.id) });

  if (!user) {
    redirect("/auth/signin");
  }

  const plan = normalizeUserPlan(user.plan);

  const initialProfile: ProfileData = {
    id: user._id.toString(),
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? "",
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    gender: user.gender ?? null,
    ageRange: user.ageRange ?? null,
    occupation: user.occupation ?? null,
    bio: user.bio ?? "",
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100svh", overflowX: "hidden" }}>
      <MemberVideoBackground src="/videos/profile-bg.mp4" />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <MemberNav
          userName={session.user.name}
          userImage={session.user.image}
          transparent
        />

        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.3em",
              }}
            >
              PROFILE
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: "#fff", textShadow: "0 0 32px rgba(56,123,255,0.2)" }}>
              プロフィール
            </Typography>
            <PlanStatusBadge plan={plan} />
            <Typography sx={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.85 }}>
              <Box component="span" sx={{ display: "block" }}>
                表示名の変更やアカウント情報の確認ができます。
              </Box>
              <Box component="span" sx={{ display: "block" }}>
                プロフィールが詳しくなるほど、診断結果の精度も高まります。
              </Box>
            </Typography>
          </Stack>

          <ProfileForm initialProfile={initialProfile} returnTo={returnTo} />
        </Stack>
      </Container>
      </Box>
    </Box>
  );
}
