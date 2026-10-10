export function logError(context: string, error: unknown): void {
  console.error(`[Dashboard: ${context}]`, {
    kind: error instanceof Error ? error.name : "UnknownError",
  });
}

export function logWarning(context: string): void {
  console.warn(`[Dashboard: ${context}]`);
}

export function logInfo(context: string): void {
  if (import.meta.env.DEV) console.info(`[Dashboard: ${context}]`);
}
