export const ERROR_MESSAGES = {
  REQUEST_FAILED: "Unable to complete request",
  CONNECTION: "API connection required",
  AUTH_CONFIG:
    "Configure a bearer token or local admin credentials to load protected data.",
  REQUIRED: "Complete all required fields.",
  DATE: "Choose real calendar dates in the correct order.",
  RANGE: "The selected period exceeds the supported date range.",
  FUNNELS: "Select at least one funnel.",
  NETWORK: "We could not reach the API. Check your connection and try again.",
  AUTH: "Your session has expired. Configure a valid access token to continue.",
  INVALID: "Check the entered values and try again.",
  NOT_FOUND: "This record could not be found. Refresh the list and try again.",
  CONFLICT:
    "This request conflicts with existing work. Wait for it to finish before retrying.",
  SERVER:
    "The report could not be completed. Your previous results are still available.",
  UNKNOWN: "Something went wrong. Please try again.",
  CONFIG: "Configure the API origin to connect your dashboard.",
  TIMEZONE: "Configure the GA4 property timezone to use date presets.",
  SCHEDULE:
    "Use a name, cadence and lookback of 1–31 days, and a future UTC execution time.",
  REFERENCE:
    "Choose verified references or clear them. Invoice IDs must be positive integers.",
  RESPONSE:
    "The API returned an unsupported response. Your previous results are still available.",
  AI: "AI review is unavailable. Numeric report data remains available.",
  SOURCE: "This source is unavailable. Related totals may be partial.",
  STORAGE: "Local preferences could not be saved in this browser.",
} as const;

export type ErrorIdType = keyof typeof ERROR_MESSAGES;

export class AppError extends Error {
  constructor(public readonly id: ErrorIdType) {
    super(ERROR_MESSAGES[id]);

    this.name = "AppError";
  }
}

export function errorMessage(error: unknown): string {
  return ERROR_MESSAGES[error instanceof AppError ? error.id : "UNKNOWN"];
}

export function statusError(status: number): AppError {
  return new AppError(
    status === 400
      ? "INVALID"
      : status === 401 || status === 403
        ? "AUTH"
        : status === 404
          ? "NOT_FOUND"
          : status === 409
            ? "CONFLICT"
            : status >= 500
              ? "SERVER"
              : "UNKNOWN",
  );
}
