import { Suspense } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { isAuthConfigured } from "@/auth.config";
import SignInForm from "./SignInForm";

export const metadata = {
  title: "ログイン | AIキャリア診断",
};

export default function SignInPage() {
  const configured = isAuthConfigured();

  return (
    <Suspense>
      {!configured && (
        <Box sx={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 10 }}>
          <Alert severity="warning">
            認証の環境変数（GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / MONGODB_URI /
            AUTH_SECRET）が未設定です。.env.local を設定してください。
          </Alert>
        </Box>
      )}
      <SignInForm authConfigured={configured} />
    </Suspense>
  );
}
