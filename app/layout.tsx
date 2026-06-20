import type { Metadata, Viewport } from "next";
import ThemeRegistry from "@/app/providers/ThemeRegistry";
import AuthSessionProvider from "@/app/providers/AuthSessionProvider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "5問で見える、あなたの強み | AIキャリア診断",
  description:
    "経験と志向から、あなたらしい強みと活かし方を提案するAIキャリア診断。約3分、無料プランから利用できます。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
