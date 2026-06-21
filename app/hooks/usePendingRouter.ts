"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { startNavigationPending } from "@/lib/navigation-pending";

export function usePendingRouter() {
  const router = useRouter();

  return useMemo(
    () => ({
      push: (href: string) => {
        startNavigationPending();
        router.push(href);
      },
      replace: (href: string) => {
        startNavigationPending();
        router.replace(href);
      },
      back: () => {
        startNavigationPending();
        router.back();
      },
      refresh: () => router.refresh(),
    }),
    [router],
  );
}
