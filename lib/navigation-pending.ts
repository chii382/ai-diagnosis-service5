type PendingListener = (pending: boolean) => void;

const listeners = new Set<PendingListener>();

export function startNavigationPending() {
  listeners.forEach((listener) => listener(true));
}

export function stopNavigationPending() {
  listeners.forEach((listener) => listener(false));
}

export function subscribeNavigationPending(listener: PendingListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isInternalNavigationHref(href: string): boolean {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;

    const current = `${window.location.pathname}${window.location.search}`;
    const next = `${url.pathname}${url.search}`;
    return current !== next;
  } catch {
    return false;
  }
}

export function shouldStartNavigationPending(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href) return false;
  return isInternalNavigationHref(href);
}
