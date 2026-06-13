import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { isAuthConfigured } from "@/auth.config";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "ログイン | AIキャリア診断",
};

export const dynamic = "force-dynamic";

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const configured = isAuthConfigured();
  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" && params.callbackUrl.startsWith("/")
      ? params.callbackUrl
      : "/dashboard";

  return (
    <>
      {!configured && (
        <Box sx={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 10 }}>
          <Alert severity="warning">
            認証の環境変数（GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / MONGODB_URI /
            AUTH_SECRET）が未設定です。.env.local を設定してください。
          </Alert>
        </Box>
      )}
      <SignInForm authConfigured={configured} callbackUrl={callbackUrl} />
    </>
  );
}
