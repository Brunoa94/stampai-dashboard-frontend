import {
  AppError,
  type ErrorIdType,
  ERROR_MESSAGES,
} from "@/shared/lib/constants/errors";

let pending: Promise<string> | null = null;

export function getAdminToken(): Promise<string> {
  if (pending) return pending;

  pending = exchange().finally(() => {
    pending = null;
  });

  return pending;
}

async function exchange(): Promise<string> {
  try {
    const response = await fetch("/__dashboard/admin-token", {
      method: "POST",
      headers: { "X-Dashboard-Auth": "1" },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    const data: unknown = await response.json();

    if (!data || typeof data !== "object") throw new AppError("RESPONSE");

    const record = data as Record<string, unknown>;

    if (!response.ok) {
      const id =
        typeof record.error === "string" &&
        Object.hasOwn(ERROR_MESSAGES, record.error)
          ? (record.error as ErrorIdType)
          : "AUTH";

      throw new AppError(id);
    }

    if (
      typeof record.token !== "string" ||
      !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(record.token)
    )
      throw new AppError("RESPONSE");

    return record.token;
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("NETWORK");
  }
}
