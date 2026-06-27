import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AdminNav from "@/app/components/admin/AdminNav";
import UserManagementGrid from "@/app/components/admin/UserManagementGrid";
import MemberCinematicBackground from "@/app/components/member/MemberCinematicBackground";
import MemberNav from "@/app/components/member/MemberNav";
import { adminAccessDeniedPath } from "@/lib/admin/require-admin";
import { isAdminRole } from "@/lib/user/types";

export const metadata = {
  title: "ユーザー管理 | 管理者",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/admin/users");
  if (!isAdminRole(session.user.role)) redirect(adminAccessDeniedPath());

  return (
    <Box sx={{ position: "relative", minHeight: "100svh", overflow: "hidden" }}>
      <MemberCinematicBackground />
      <MemberNav />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 3, md: 5 } }}>
        <AdminNav />
        <UserManagementGrid />
      </Container>
    </Box>
  );
}
