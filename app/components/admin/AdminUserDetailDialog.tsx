"use client";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { AdminUserDetail } from "@/lib/admin/server";
import { getPlanAdminLabel, isPaidPlan } from "@/lib/plan";
import {
  getAgeRangeLabel,
  getGenderLabel,
  getOccupationLabel,
} from "@/lib/profile-options";

interface AdminUserDetailDialogProps {
  detail: AdminUserDetail | null;
  open: boolean;
  onClose: () => void;
  onOpenDiagnosis: (diagnosisId: string) => void;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("ja-JP");
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function AdminUserDetailDialog({
  detail,
  open,
  onClose,
  onOpenDiagnosis,
}: AdminUserDetailDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        ユーザー詳細
        <IconButton onClick={onClose} aria-label="閉じる">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {detail && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar key={detail.id} src={detail.image || undefined} sx={{ width: 56, height: 56 }}>
                {detail.name.charAt(0) || "?"}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{detail.name || "未設定"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {detail.email}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography variant="body2" component="span">
                    ロール:
                  </Typography>
                  <Chip label={detail.role} size="small" />
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    プラン:
                  </Typography>
                  <Chip
                    label={getPlanAdminLabel(detail.plan)}
                    size="small"
                    color={isPaidPlan(detail.plan) ? "success" : "default"}
                  />
                </Stack>
              </Box>
            </Stack>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                プロフィール
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField label="性別" value={getGenderLabel(detail.gender)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField label="年代" value={getAgeRangeLabel(detail.ageRange)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField label="職種" value={getOccupationLabel(detail.occupation)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField
                    label="メール認証"
                    value={detail.emailVerified ? "認証済み" : "未認証"}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ProfileField label="自己紹介" value={detail.bio || "未設定"} />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                アカウント情報
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField label="プラン" value={getPlanAdminLabel(detail.plan)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField label="アカウント作成日" value={formatDateTime(detail.createdAt)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ProfileField label="最終更新日" value={formatDateTime(detail.updatedAt)} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ProfileField
                    label="最終ログイン"
                    value={
                      detail.lastLoginAt
                        ? `${formatDateTime(detail.lastLoginAt)}${
                            detail.lastLoginAtRecorded
                              ? ""
                              : "（ログイン記録なし・最終更新日時を表示）"
                          }`
                        : "—"
                    }
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                診断履歴（{detail.diagnosisCount}件）
              </Typography>
              {detail.diagnoses.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  診断履歴はありません
                </Typography>
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>診断日時</TableCell>
                        <TableCell>概要</TableCell>
                        <TableCell align="right" sx={{ width: 100 }}>
                          操作
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detail.diagnoses.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {formatDateTime(item.createdAt)}
                          </TableCell>
                          <TableCell sx={{ maxWidth: 360 }}>
                            <Typography variant="body2" noWrap title={item.summary}>
                              {item.summary}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityOutlinedIcon />}
                              onClick={() => onOpenDiagnosis(item.id)}
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              詳細
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
