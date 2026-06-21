"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  shouldStartNavigationPending,
  startNavigationPending,
  stopNavigationPending,
  subscribeNavigationPending,
} from "@/lib/navigation-pending";
import { subscribeProcessingPending } from "@/lib/processing-pending";

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const [processingPending, setProcessingPending] = useState(false);

  useEffect(() => subscribeNavigationPending(setPending), []);
  useEffect(() => subscribeProcessingPending(setProcessingPending), []);

  useEffect(() => {
    stopNavigationPending();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || !shouldStartNavigationPending(anchor)) return;

      startNavigationPending();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("navigation-pending", pending);
    document.body.classList.toggle("processing-pending", processingPending);
    return () => {
      document.body.classList.remove("navigation-pending");
      document.body.classList.remove("processing-pending");
    };
  }, [pending, processingPending]);

  return null;
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
