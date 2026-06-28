// Next.js の Link コンポーネント（クライアント遷移用）
import Link from "next/link";
// MUI のレイアウト・UI コンポーネント
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// ブラウザタブに表示するページタイトル
export const metadata = {
  title: "お支払いキャンセル | AIキャリア診断",
};

// ページコンポーネント（Server Component のため 'use client' 不要）
export default function CheckoutCancelPage() {
  return (
    // 画面全体を覆う背景（ダークテーマ）
    <Box sx={{ minHeight: "100svh", backgroundColor: "#050810", py: 8 }}>
      {/* 中央寄せのコンテンツ幅を sm に制限 */}
      <Container maxWidth="sm">
        {/* 縦方向に要素を並べる */}
        <Stack spacing={3} alignItems="flex-start">
          {/* メイン見出し：穏やかなキャンセル通知 */}
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
            お支払いはキャンセルされました
          </Typography>
          {/* 感謝のトーンで、再検討を促す（責めない表現） */}
          <Typography sx={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
            ご検討いただきありがとうございます。プランは変更されていません。ご都合のよいタイミングで、いつでも再度ご確認ください。
          </Typography>
          {/* LP の PRICING セクション・トップページへの導線 */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button component={Link} href="/#pricing" variant="contained">
              料金ページへ
            </Button>
            <Button component={Link} href="/" variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              トップページへ
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
