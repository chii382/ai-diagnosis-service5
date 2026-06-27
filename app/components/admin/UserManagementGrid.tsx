"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { adminDataGridSx, adminGlassCardSx } from "@/app/components/admin/adminStyles";
import AdminDiagnosisPreviewDialog from "@/app/components/admin/AdminDiagnosisPreviewDialog";
import AdminUserDetailDialog from "@/app/components/admin/AdminUserDetailDialog";
import type { AdminUserDetail, AdminUserListItem } from "@/lib/admin/server";
import { getPlanAdminLabel, isPaidPlan } from "@/lib/plan";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";
import type { UserRole } from "@/lib/user/types";

export default function UserManagementGrid() {
  const [rows, setRows] = useState<AdminUserListItem[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [previewDiagnosisId, setPreviewDiagnosisId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    startProcessingPending();
    try {
      const params = new URLSearchParams({
        page: String(paginationModel.page + 1),
        limit: String(paginationModel.pageSize),
      });
      if (search) params.set("search", search);
      if (roleFilter !== "all") params.set("role", roleFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
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
  }, [paginationModel.page, paginationModel.pageSize, roleFilter, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    startProcessingPending();
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "更新に失敗しました");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      stopProcessingPending();
    }
  };

  const openDetail = async (userId: string) => {
    startProcessingPending();
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "詳細取得に失敗しました");
      setDetail(data);
      setDetailOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "詳細取得に失敗しました");
    } finally {
      stopProcessingPending();
    }
  };

  function handleOpenDiagnosis(diagnosisId: string) {
    setPreviewDiagnosisId(diagnosisId);
    setPreviewOpen(true);
  }

  const columns: GridColDef<AdminUserListItem>[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "ユーザー",
        flex: 1.2,
        minWidth: 200,
        renderCell: (params: GridRenderCellParams<AdminUserListItem>) => (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
            <Avatar
              key={params.row.id}
              src={params.row.image || undefined}
              sx={{ width: 28, height: 28 }}
            >
              {params.row.name.charAt(0) || "?"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: "0.85rem" }}>
                {params.row.name || "未設定"}
              </Typography>
              <Typography noWrap sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>
                {params.row.email}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        field: "role",
        headerName: "ロール",
        width: 130,
        renderCell: (params) => (
          <Chip
            label={params.value === "admin" ? "admin" : "user"}
            size="small"
            color={params.value === "admin" ? "primary" : "default"}
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        field: "plan",
        headerName: "プラン",
        width: 160,
        renderCell: (params) => (
          <Chip
            label={getPlanAdminLabel(params.row.plan)}
            size="small"
            color={isPaidPlan(params.row.plan) ? "success" : "default"}
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      { field: "diagnosisCount", headerName: "診断数", width: 90 },
      {
        field: "lastLoginAt",
        headerName: "最終ログイン",
        flex: 1,
        minWidth: 160,
        valueFormatter: (value) =>
          value ? new Date(String(value)).toLocaleString("ja-JP") : "—",
      },
      {
        field: "actions",
        headerName: "操作",
        width: 220,
        sortable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%" }}>
            <Select
              size="small"
              value={params.row.role}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => void handleRoleChange(params.row.id, e.target.value as UserRole)}
              sx={{ minWidth: 90, color: "#fff", fontSize: "0.8rem" }}
            >
              <MenuItem value="user">user</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
            </Select>
            <Typography
              component="button"
              onClick={() => void openDetail(params.row.id)}
              sx={{
                border: "none",
                background: "none",
                color: "#60a5fa",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              詳細
            </Typography>
          </Stack>
        ),
      },
    ],
    [fetchUsers],
  );

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField
          size="small"
          label="検索（名前・メール）"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(searchInput);
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }
          }}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>ロール</InputLabel>
          <Select
            label="ロール"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as UserRole | "all");
              setPaginationModel((prev) => ({ ...prev, page: 0 }));
            }}
          >
            <MenuItem value="all">すべて</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="user">user</MenuItem>
          </Select>
        </FormControl>
      </Stack>

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

      <AdminUserDetailDialog
        detail={detail}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onOpenDiagnosis={handleOpenDiagnosis}
      />

      <AdminDiagnosisPreviewDialog
        diagnosisId={previewDiagnosisId}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </Stack>
  );
}
