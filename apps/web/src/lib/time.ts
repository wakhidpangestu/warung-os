export const BUSINESS_TIME_ZONE = "Asia/Jakarta";

export function formatBusinessDateTime(value: Date): string {
  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("day")} ${part("month")} ${part("year")}, ${part("hour")}.${part("minute")}`;
}

export function toUtcIso(value: Date): string {
  return value.toISOString();
}
