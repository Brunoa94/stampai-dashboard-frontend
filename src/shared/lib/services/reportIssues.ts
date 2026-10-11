import { apiRequest } from "@/shared/lib/services/api";
import { AppError } from "@/shared/lib/constants/errors";
import { validReportIssue } from "@/shared/lib/helpers/reportIssues";
import type {
  ReportIssueInputType,
  ReportIssueSourceType,
  ReportIssueType,
} from "@/shared/lib/types/reportIssues";

export async function listReportIssues(
  source: ReportIssueSourceType,
  signal?: AbortSignal,
): Promise<ReportIssueType[]> {
  const data = await apiRequest<unknown>(
    `/api/report-issues?source=${encodeURIComponent(source)}`,
    { signal },
  );

  if (!Array.isArray(data) || !data.every(validReportIssue))
    throw new AppError("RESPONSE");

  return data;
}

export async function createGithubIssue(
  body: ReportIssueInputType,
): Promise<ReportIssueType> {
  const data = await apiRequest<unknown>("/api/report-issues/github", {
    method: "POST",
    body,
  });

  if (!validReportIssue(data)) throw new AppError("RESPONSE");

  return data;
}

export async function dismissReportIssue(
  body: ReportIssueInputType,
): Promise<ReportIssueType> {
  const { source, scope, kind, reference, title, report_id } = body;

  const data = await apiRequest<unknown>("/api/report-issues/dismiss", {
    method: "POST",
    body: { source, scope, kind, reference, title, report_id },
  });

  if (!validReportIssue(data)) throw new AppError("RESPONSE");

  return data;
}
