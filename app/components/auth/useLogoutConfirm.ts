"use client";

import { useCallback, useState } from "react";
import { startNavigationPending } from "@/lib/navigation-pending";
import { signOut } from "next-auth/react";

export function useLogoutConfirm(callbackUrl = "/") {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const requestLogout = useCallback(() => {
    if (submitting) return;
    setOpen(true);
  }, [submitting]);

  const cancelLogout = useCallback(() => {
    if (submitting) return;
    setOpen(false);
  }, [submitting]);

  const confirmLogout = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    startNavigationPending();
    try {
      await signOut({ callbackUrl, redirect: true });
    } catch {
      window.location.assign(callbackUrl);
    } finally {
      setSubmitting(false);
      setOpen(false);
    }
  }, [callbackUrl, submitting]);

  return { open, submitting, requestLogout, cancelLogout, confirmLogout };
}
