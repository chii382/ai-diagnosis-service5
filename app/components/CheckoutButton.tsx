"use client";

// React の状態管理フック
import { useState } from "react";
// Next.js の Link コンポーネント
import Link from "next/link";
// MUI の UI コンポーネント
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ButtonProps } from "@mui/material/Button";

// コンポーネントの props 型定義
type CheckoutButtonProps = {
  /** ボタンに表示する文言 */
  label?: string;
  /** MUI Button の見た目（contained / outlined など） */
  variant?: ButtonProps["variant"];
  /** ボタン全体の幅を親に合わせる */
  fullWidth?: boolean;
};

// ユーザー向けの固定エラーメッセージ（技術用語を含めない）
const USER_ERROR_MESSAGE = "一時的な問題が発生しました";

export default function CheckoutButton({
  label = "購入する",
  variant = "contained",
  fullWidth = false,
}: CheckoutButtonProps) {
  // 決済画面への遷移中かどうか
  const [loading, setLoading] = useState(false);
  // エラー発生時に true になる
  const [hasError, setHasError] = useState(false);

  const handleCheckout = async () => {
    // 二重クリック防止
    if (loading) return;

    setLoading(true);
    setHasError(false);

    try {
      // サーバー API で Checkout Session を作成
      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (response.status === 401) {
        window.location.href = "/auth/signin?callbackUrl=/#pricing";
        return;
      }

      // レスポンスが失敗、または URL が無い場合はエラー扱い
      if (!response.ok || !data.url) {
        throw new Error("checkout failed");
      }

      // Stripe の決済画面へ遷移
      window.location.href = data.url;
    } catch {
      // 詳細はユーザーに見せず、共通メッセージと導線を表示
      setHasError(true);
      setLoading(false);
    }
  };

  return (
    <Stack spacing={1.5} sx={{ width: fullWidth ? "100%" : undefined }}>
      {/* エラー時：メッセージと3つの選択肢を表示 */}
      {hasError && (
        <Alert severity="error">
          <Typography sx={{ mb: 1.5 }}>{USER_ERROR_MESSAGE}</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap" useFlexGap>
            {/* もう一度試す */}
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => void handleCheckout()}
              disabled={loading}
            >
              もう一度試す
            </Button>
            {/* お問い合わせページへ */}
            <Button size="small" variant="outlined" color="inherit" component={Link} href="/contact">
              お問い合わせ
            </Button>
            {/* トップページへ */}
            <Button size="small" variant="outlined" color="inherit" component={Link} href="/">
              トップページへ戻る
            </Button>
          </Stack>
        </Alert>
      )}
      {/* 通常時の購入ボタン */}
      <Button
        variant={variant}
        onClick={() => void handleCheckout()}
        disabled={loading}
        fullWidth={fullWidth}
        sx={{ fontWeight: 700 }}
      >
        {loading ? "決済画面へ移動中..." : label}
      </Button>
    </Stack>
  );
}
