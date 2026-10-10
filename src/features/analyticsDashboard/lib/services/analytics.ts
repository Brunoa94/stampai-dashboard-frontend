import { apiRequest } from "@/shared/lib/services/api";
import { AppError } from "@/shared/lib/constants/errors";
import type {
  AnalyticsRequestType,
  AnalyticsReportType,
} from "@/features/analyticsDashboard/lib/types/analytics";
import { validateAnalyticsResponse } from "@/features/analyticsDashboard/lib/helpers/validation";

export async function generateAnalytics(
  body: AnalyticsRequestType,
  signal?: AbortSignal,
): Promise<AnalyticsReportType[]> {
  const data = await apiRequest<unknown>(
    "/api/analytics-agent/analytics-agent-review",
    { method: "POST", body, signal },
  );

  if (!validateAnalyticsResponse(data, body.funnels))
    throw new AppError("RESPONSE");

  return data;
}
