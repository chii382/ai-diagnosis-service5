"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { usePendingRouter } from "@/app/hooks/usePendingRouter";
import { useSession } from "next-auth/react";
import { startProcessingPending, stopProcessingPending } from "@/lib/processing-pending";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import {
  AGE_RANGE_OPTIONS,
  BIO_MAX_LENGTH,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
} from "@/lib/profile-options";

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  gender: string | null;
  ageRange: string | null;
  occupation: string | null;
  bio: string;
}

interface ProfileFormProps {
  initialProfile: ProfileData;
  returnTo: string;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ja-JP");
}

const profileCardSx = {
  backgroundColor: "rgba(8,14,28,0.58)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.2)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.42)",
} as const;

const profileFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(8,14,28,0.72)",
    backdropFilter: "blur(8px)",
    borderRadius: 2,
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(147,197,253,0.55)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(96,165,250,0.85)",
      borderWidth: "1px",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(8,14,28,0.62)",
    },
  },
  "& .MuiInputBase-input": {
    color: "rgba(255,255,255,0.96)",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.45)",
    opacity: 1,
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "rgba(255,255,255,0.78)",
    WebkitTextFillColor: "rgba(255,255,255,0.78)",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.78)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgba(147,197,253,0.95)",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(255,255,255,0.68)",
  },
  "& .MuiSelect-icon": {
    color: "rgba(255,255,255,0.72)",
  },
} as const;

export default function ProfileForm({ initialProfile, returnTo }: ProfileFormProps) {
  const router = usePendingRouter();
  const { update: updateSession } = useSession();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [name, setName] = useState(initialProfile.name);
  const [gender, setGender] = useState(initialProfile.gender ?? "");
  const [ageRange, setAgeRange] = useState(initialProfile.ageRange ?? "");
  const [occupation, setOccupation] = useState(initialProfile.occupation ?? "");
  const [bio, setBio] = useState(initialProfile.bio);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const isDirty = useMemo(
    () =>
      name !== profile.name ||
      gender !== (profile.gender ?? "") ||
      ageRange !== (profile.ageRange ?? "") ||
      occupation !== (profile.occupation ?? "") ||
      bio !== (profile.bio ?? ""),
    [name, gender, ageRange, occupation, bio, profile],
  );

  function navigateBack() {
    router.replace(returnTo);
    router.refresh();
  }

  function handleCancelClick() {
    if (saving) return;
    if (isDirty) {
      setDiscardConfirmOpen(true);
      return;
    }
    navigateBack();
  }

  function handleDiscardStay() {
    setDiscardConfirmOpen(false);
  }

  function handleDiscardConfirm() {
    setDiscardConfirmOpen(false);
    navigateBack();
  }

  function openSaveConfirm() {
    if (saving || !isDirty || !name.trim()) return;
    setSaveConfirmOpen(true);
  }

  function handleSaveClick(event: FormEvent) {
    event.preventDefault();
    openSaveConfirm();
  }

  function handleSaveCancel() {
    setSaveConfirmOpen(false);
  }

  async function performSave() {
    setSaveConfirmOpen(false);
    setSaving(true);
    setMessage(null);
    startProcessingPending();

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          gender: gender || null,
          ageRange: ageRange || null,
          occupation: occupation || null,
          bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "保存に失敗しました");
      }

      setProfile(data);
      setName(data.name);
      setGender(data.gender ?? "");
      setAgeRange(data.ageRange ?? "");
      setOccupation(data.occupation ?? "");
      setBio(data.bio ?? "");
      await updateSession({ name: data.name });
      navigateBack();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "保存に失敗しました",
      });
    } finally {
      setSaving(false);
      stopProcessingPending();
    }
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadingAvatar(true);
    setMessage(null);
    startProcessingPending();

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/user/profile/avatar", {
        method: "POST",
        body: formData,
      });
      const raw = await response.text();
      let data: { error?: string; image?: string } = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as { error?: string; image?: string };
        } catch {
          throw new Error("サーバーからの応答を読み取れませんでした");
        }
      }

      if (!response.ok) {
        throw new Error(data.error ?? "アイコンの更新に失敗しました");
      }

      if (!data.image) {
        throw new Error("アイコンの更新に失敗しました");
      }

      setProfile((current) => ({ ...current, image: data.image! }));
      await updateSession({ image: data.image });
      router.refresh();
      setMessage({ type: "success", text: "アイコンを更新しました。" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "アイコンの更新に失敗しました",
      });
    } finally {
      setUploadingAvatar(false);
      stopProcessingPending();
    }
  }

  return (
    <Stack spacing={3}>
      {message && <Alert severity={message.type}>{message.text}</Alert>}

      <Card sx={profileCardSx}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "center", sm: "center" }}
              justifyContent={{ sm: "space-between" }}
              sx={{ width: "100%" }}
            >
              <Box sx={{ textAlign: { xs: "center", sm: "left" }, flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#fff", textShadow: "0 1px 14px rgba(0,0,0,0.4)" }}
                >
                  {profile.name || "未設定"}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.78)" }}>{profile.email}</Typography>
              </Box>

              <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ flexShrink: 0 }}>
                <Box sx={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                  <Avatar
                    src={profile.image || undefined}
                    alt={profile.name}
                    sx={{
                      width: 80,
                      height: 80,
                      border: "2px solid rgba(96,165,250,0.55)",
                      opacity: uploadingAvatar ? 0.65 : 1,
                    }}
                  >
                    {profile.name?.charAt(0) ?? "?"}
                  </Avatar>
                  {uploadingAvatar && (
                    <CircularProgress
                      size={28}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        mt: "-14px",
                        ml: "-14px",
                      }}
                    />
                  )}
                  <Box
                    component="input"
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    hidden
                    onChange={handleAvatarChange}
                  />
                </Box>
                <Stack spacing={0.75} alignItems={{ xs: "center", sm: "flex-start" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    sx={{
                      minWidth: 96,
                      px: 1.75,
                      py: 0.75,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      borderColor: "rgba(147,197,253,0.55)",
                      color: "rgba(255,255,255,0.92)",
                      backgroundColor: "rgba(8,14,28,0.55)",
                      "&:hover": {
                        borderColor: "rgba(96,165,250,0.85)",
                        backgroundColor: "rgba(56,123,255,0.16)",
                      },
                    }}
                  >
                    {uploadingAvatar ? "変更中..." : "画像変更"}
                  </Button>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      lineHeight: 1.45,
                      color: "rgba(255,255,255,0.58)",
                      textAlign: { xs: "center", sm: "left" },
                    }}
                  >
                    JPEG / PNG / WebP / GIF（2MB以下）
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.68)" }}>
                登録日: {formatDate(profile.createdAt)}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.68)" }}>
                最終更新: {formatDate(profile.updatedAt)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card
        component="form"
        onSubmit={handleSaveClick}
        sx={profileCardSx}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#fff",
                textShadow: "0 1px 14px rgba(0,0,0,0.4)",
              }}
            >
              プロフィール編集
            </Typography>

            <TextField
              label="表示名"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
              sx={profileFieldSx}
            />

            <TextField
              label="メールアドレス"
              value={profile.email}
              fullWidth
              disabled
              helperText="Google アカウント連携のため変更できません"
              sx={profileFieldSx}
            />

            <FormControl fullWidth sx={profileFieldSx}>
              <InputLabel id="gender-label">性別</InputLabel>
              <Select
                labelId="gender-label"
                label="性別"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {GENDER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={profileFieldSx}>
              <InputLabel id="age-range-label">年齢（年代）</InputLabel>
              <Select
                labelId="age-range-label"
                label="年齢（年代）"
                value={ageRange}
                onChange={(event) => setAgeRange(event.target.value)}
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {AGE_RANGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={profileFieldSx}>
              <InputLabel id="occupation-label">職業</InputLabel>
              <Select
                labelId="occupation-label"
                label="職業"
                value={occupation}
                onChange={(event) => setOccupation(event.target.value)}
              >
                <MenuItem value="">
                  <em>未選択</em>
                </MenuItem>
                {OCCUPATION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="自由記入"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              fullWidth
              multiline
              minRows={4}
              placeholder="スキル、性格、得意なこと、趣味など"
              inputProps={{ maxLength: BIO_MAX_LENGTH }}
              helperText={`${bio.length}/${BIO_MAX_LENGTH}文字`}
              sx={profileFieldSx}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                type="button"
                variant="contained"
                disabled={!isDirty || saving || !name.trim()}
                onClick={openSaveConfirm}
              >
                {saving ? "保存中..." : "変更を保存"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={saving}
                onClick={handleCancelClick}
                sx={{
                  borderColor: "rgba(255,255,255,0.28)",
                  color: "rgba(255,255,255,0.9)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.45)",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                キャンセル
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={discardConfirmOpen} onClose={handleDiscardStay} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>編集内容の破棄</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            編集内容が破棄されます。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleDiscardStay}>キャンセル</Button>
          <Button onClick={handleDiscardConfirm} variant="contained" color="error">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={saveConfirmOpen} onClose={handleSaveCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>変更の保存</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "text.secondary" }}>
            変更を保存します。よろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleSaveCancel} disabled={saving}>
            キャンセル
          </Button>
          <Button onClick={performSave} variant="contained" disabled={saving}>
            {saving ? "保存中..." : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
