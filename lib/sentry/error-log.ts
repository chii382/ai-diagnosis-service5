export type ErrorLogInput = {
  message: string;
  stack?: string;
  url?: string;
  userId?: string;
  level?: "error" | "warning";
  sentryEventId?: string;
};

export async function notifyErrorWebhooks(input: ErrorLogInput): Promise<void> {
  const text = `[${input.level ?? "error"}] ${input.message}${input.url ? `\nURL: ${input.url}` : ""}`;

  const tasks: Promise<Response>[] = [];
  const slackUrl = process.env.SLACK_WEBHOOK_URL?.trim();
  const discordUrl = process.env.DISCORD_WEBHOOK_URL?.trim();

  if (slackUrl) {
    tasks.push(
      fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }),
    );
  }

  if (discordUrl) {
    tasks.push(
      fetch(discordUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.slice(0, 1900) }),
      }),
    );
  }

  if (tasks.length === 0) return;

  await Promise.allSettled(tasks);
}

export async function persistErrorLog(input: ErrorLogInput): Promise<void> {
  if (!process.env.MONGODB_URI) return;

  try {
    const { getErrorLogsCollection } = await import("@/lib/mongodb");
    const errorLogs = await getErrorLogsCollection();
    await errorLogs.insertOne({
      message: input.message,
      stack: input.stack,
      url: input.url,
      userId: input.userId,
      level: input.level ?? "error",
      sentryEventId: input.sentryEventId,
      createdAt: new Date(),
    });
    await notifyErrorWebhooks(input);
  } catch {
    // エラーログ保存自体の失敗でアプリを止めない
  }
}
