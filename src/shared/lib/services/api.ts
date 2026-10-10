import { getAdminToken } from "@/shared/lib/services/adminToken";
import { canUseLocalAdminAuth } from "@/shared/lib/constants/localAuth";
import { AppError, statusError } from "@/shared/lib/constants/errors";
import { useConnectionStore } from "@/shared/lib/stores/connection";

export async function apiRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    body?: unknown;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const connection = useConnectionStore();

  if (!connection.origin) throw new AppError("CONFIG");

  if (!connection.token && canUseLocalAdminAuth(connection.origin)) {
    const revision = connection.revision;

    const origin = connection.origin;

    const token = await getAdminToken();

    if (
      options.signal?.aborted ||
      connection.origin !== origin ||
      (connection.revision !== revision && connection.token !== token)
    )
      throw new AppError("AUTH");

    connection.token = token;
  }

  const controller = new AbortController();

  const abort = () => controller.abort();

  options.signal?.addEventListener("abort", abort, { once: true });

  if (options.signal?.aborted) controller.abort();

  const timer = setTimeout(abort, 180_000);

  try {
    const response = await fetch(
      `${connection.origin.replace(/\/$/, "")}${path}`,
      {
        method: options.method ?? "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          ...(options.body !== undefined
            ? { "Content-Type": "application/json" }
            : {}),
          ...(connection.token
            ? { Authorization: `Bearer ${connection.token}` }
            : {}),
        },
        ...(options.body !== undefined
          ? { body: JSON.stringify(options.body) }
          : {}),
      },
    );

    if (!response.ok) {
      await response.text();

      throw statusError(response.status);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new AppError("RESPONSE");
    }
  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError("NETWORK");
  } finally {
    clearTimeout(timer);

    options.signal?.removeEventListener("abort", abort);
  }
}
