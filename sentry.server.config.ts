import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,
  debug: false,
  beforeSend(event) {
    void import("@/lib/sentry/error-log").then(({ persistErrorLog }) =>
      persistErrorLog({
        message: event.message ?? event.exception?.values?.[0]?.value ?? "Unknown error",
        stack: event.exception?.values?.[0]?.stacktrace
          ? JSON.stringify(event.exception.values[0].stacktrace)
          : undefined,
        url: event.request?.url,
        userId: event.user?.id != null ? String(event.user.id) : undefined,
        level: event.level === "warning" ? "warning" : "error",
        sentryEventId: event.event_id,
      }),
    );
    return event;
  },
});
