import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DiagnosisHistoryList from "@/app/components/diagnosis/DiagnosisHistoryList";
import MemberNav from "@/app/components/member/MemberNav";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";
import { eyebrowSx } from "@/app/components/member/memberStyles";
import { fetchDiagnosisHistoryForUser } from "@/lib/diagnosis/server";

export const metadata = {
  title: "診断履歴 | AIキャリア診断",
};

export const dynamic = "force-dynamic";

export default async function DiagnosisHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/diagnosis/history");
  }

  const items = await fetchDiagnosisHistoryForUser(session.user.id);

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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Stack spacing={1}>
                <Typography sx={eyebrowSx}>DIAGNOSIS HISTORY</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  診断履歴
                </Typography>
              </Stack>
              <Button component={Link} href="/diagnosis" variant="contained" startIcon={<AddIcon />}>
                新しい診断
              </Button>
            </Stack>
            <DiagnosisHistoryList items={items} />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
