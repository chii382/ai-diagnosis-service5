import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  debug: false,
  ignoreErrors: [
    // リソース読み込み失敗など DOM Event が Error として渡されるケースを無視
    /^(\[object Event\]|Event)$/,
  ],
  beforeSend(event, hint) {
    const original = hint.originalException;
    if (original instanceof Event) {
      return null;
    }
    return event;
  },
});
