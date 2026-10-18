type LogContext = Record<string, string | number | boolean | undefined>;

function redact(context: LogContext): LogContext {
  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [
      key,
      /secret|token|password|authorization|cookie|key/i.test(key) ? "[REDACTED]" : value,
    ]),
  );
}

export const logger = {
  info(event: string, context: LogContext = {}) {
    console.info(JSON.stringify({ level: "info", event, ...redact(context) }));
  },
  error(event: string, context: LogContext = {}) {
    console.error(JSON.stringify({ level: "error", event, ...redact(context) }));
  },
};
