import { AppError } from "@/shared/lib/constants/errors";

export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00Z`);

  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function validateDates(start: string, end: string, max: number): void {
  if (!validDate(start) || !validDate(end) || end < start)
    throw new AppError("DATE");

  if ((Date.parse(end) - Date.parse(start)) / 86400000 + 1 > max)
    throw new AppError("RANGE");
}

export function completeDays(
  days: number,
  timezone: string,
): { start: string; end: string } {
  if (!timezone) throw new AppError("TIMEZONE");

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const get = (type: string) =>
      parts.find((part) => part.type === type)?.value;

    const today = Date.parse(
      `${get("year")}-${get("month")}-${get("day")}T00:00:00Z`,
    );

    return {
      start: new Date(today - days * 86400000).toISOString().slice(0, 10),
      end: new Date(today - 86400000).toISOString().slice(0, 10),
    };
  } catch {
    throw new AppError("TIMEZONE");
  }
}

export function calendarLabel(value: string): string {
  const normalized = /^\d{8}$/.test(value)
    ? `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
    : value;

  return normalized;
}

export function utcLabel(value: string | null): string {
  return value
    ? `${new Date(value).toISOString().replace("T", " ").slice(0, 19)} UTC`
    : "Unavailable";
}
