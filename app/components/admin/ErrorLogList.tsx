"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { adminDataGridSx, adminGlassCardSx } from "@/app/components/admin/adminStyles";
import type { AdminErrorLogItem } from "@/lib/admin/server";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";

export default function ErrorLogList() {
  const [rows, setRows] = useState<AdminErrorLogItem[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    startProcessingPending();
    try {
      const params = new URLSearchParams({
        page: String(paginationModel.page + 1),
        limit: String(paginationModel.pageSize),
      });
      const response = await fetch(`/api/admin/errors?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "取得に失敗しました");
      setRows(data.items);
      setRowCount(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "取得に失敗しました");
    } finally {
      setLoading(false);
      stopProcessingPending();
    }
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const columns: GridColDef<AdminErrorLogItem>[] = useMemo(
    () => [
      {
        field: "level",
        headerName: "レベル",
        width: 100,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={params.value === "warning" ? "warning" : "error"}
          />
        ),
      },
      { field: "message", headerName: "メッセージ", flex: 1.5, minWidth: 240 },
      { field: "url", headerName: "URL", flex: 1, minWidth: 180 },
      {
        field: "createdAt",
        headerName: "発生日時",
        width: 170,
        valueFormatter: (value) => new Date(String(value)).toLocaleString("ja-JP"),
      },
      { field: "sentryEventId", headerName: "Sentry ID", width: 140 },
    ],
    [],
  );

  const sentryConfigured = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Alert severity="info" sx={{ bgcolor: "rgba(56,123,255,0.12)", color: "rgba(255,255,255,0.85)" }}>
        Sentry連携: {sentryConfigured ? "有効（DSN設定済み）" : "未設定（SENTRY_DSN を .env.local に追加）"}
        。エラー発生時は MongoDB `error_logs` にも保存されます。
      </Alert>

      <Box sx={{ ...adminGlassCardSx, height: 560, p: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={adminDataGridSx}
        />
      </Box>
    </Stack>
  );
}
