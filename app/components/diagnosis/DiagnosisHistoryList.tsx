"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { DiagnosisListItem } from "@/lib/diagnosis/types";
import { glassCardSx } from "@/app/components/member/memberStyles";

interface DiagnosisHistoryListProps {
  items: DiagnosisListItem[];
}

export default function DiagnosisHistoryList({ items }: DiagnosisHistoryListProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("この診断結果を削除しますか？")) return;

    setDeletingId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/diagnosis/${id}`, { method: "DELETE" });
      const raw = await response.text();
      let data: { error?: string } = {};
      if (raw) data = JSON.parse(raw) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "削除に失敗しました");
      setMessage({ type: "success", text: "診断結果を削除しました。" });
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "削除に失敗しました",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <Card sx={glassCardSx}>
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: "center" }}>
          <Stack spacing={2} alignItems="center">
            <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
              まだ診断履歴がありません。
            </Typography>
            <Button component={Link} href="/diagnosis" variant="contained">
              診断を始める
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {message && <Alert severity={message.type}>{message.text}</Alert>}
      {items.map((item) => (
        <Card key={item.id} sx={glassCardSx}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <BoxInfo item={item} />
              <Stack direction="row" spacing={1}>
                <Button
                  component={Link}
                  href={`/diagnosis/${item.id}`}
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityOutlinedIcon />}
                  sx={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}
                >
                  詳細
                </Button>
                <IconButton
                  aria-label="削除"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function BoxInfo({ item }: { item: DiagnosisListItem }) {
  return (
    <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>
        {new Date(item.createdAt).toLocaleString("ja-JP")}
      </Typography>
      <Typography sx={{ fontWeight: 600, lineHeight: 1.6 }} noWrap>
        {item.summary}
      </Typography>
    </Stack>
  );
}
