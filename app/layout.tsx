import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import ThemeRegistry from "@/app/providers/ThemeRegistry";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "5問でわかる、あなたのキャリア | AIキャリア診断",
  description:
    "5問の質問に答えるだけで、AIがあなたに最適なキャリアロードマップを提案します。たった3分、完全無料。",
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
    <html lang="ja" className={geistSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
