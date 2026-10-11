import { apiRequest } from "@/shared/lib/services/api";
import type {
  FinanceRequestType,
  FinanceReportType,
  ReportListType,
  ReportDetailType,
  ReferenceRequestType,
  InvoiceRecordType,
  NotificationType,
} from "@/features/financeDashboard/lib/types/finance";
import { AppError } from "@/shared/lib/constants/errors";
import { validFinanceReport } from "@/features/financeDashboard/lib/helpers/validation";

export async function generateFinance(
  body: FinanceRequestType,
  signal?: AbortSignal,
): Promise<FinanceReportType> {
  const data = await apiRequest<unknown>("/api/finance-agent/reports", {
    method: "POST",
    body,
    signal,
  });

  if (!validFinanceReport(data)) throw new AppError("RESPONSE");

  return normalizeInsights(data);
}

export function listReports(
  offset: number,
  signal?: AbortSignal,
): Promise<ReportListType[]> {
  return apiRequest(`/api/finance-agent/reports?limit=20&offset=${offset}`, {
    signal,
  });
}

export async function getReport(
  id: string,
  signal?: AbortSignal,
): Promise<ReportDetailType> {
  const data = await apiRequest<ReportDetailType>(
    `/api/finance-agent/reports/${encodeURIComponent(id)}`,
    { signal },
  );

  if (!validFinanceReport(data.report) || !Array.isArray(data.alertReviews))
    throw new AppError("RESPONSE");

  return { ...data, report: normalizeInsights(data.report) };
}

export function acknowledgeAlert(
  report: string,
  alert: string,
  acknowledged: boolean,
): Promise<{ acknowledged: boolean }> {
  return apiRequest(
    `/api/finance-agent/reports/${encodeURIComponent(report)}/alerts/${encodeURIComponent(alert)}`,
    { method: "PATCH", body: { acknowledged } },
  );
}

export function editInvoice(
  id: number,
  body: ReferenceRequestType,
): Promise<InvoiceRecordType> {
  return apiRequest(`/api/invoices/${id}/references`, {
    method: "PATCH",
    body,
  });
}

export function listNotifications(
  offset: number,
  unread: boolean,
  signal?: AbortSignal,
): Promise<NotificationType[]> {
  return apiRequest(
    `/api/finance-agent/notifications?limit=20&offset=${offset}${unread ? "&unread=true" : ""}`,
    { signal },
  );
}

export function readNotification(
  id: string | number,
  read: boolean,
): Promise<NotificationType> {
  return apiRequest(
    `/api/finance-agent/notifications/${encodeURIComponent(id)}`,
    { method: "PATCH", body: { read } },
  );
}

function normalizeInsights(report: FinanceReportType): FinanceReportType {
  if (report.insightsStatus !== "complete") return report;

  const insight = report.insights;

  if (
    !insight ||
    !Array.isArray(insight.findings) ||
    !Array.isArray(insight.recommendations) ||
    !Array.isArray(insight.limitations) ||
    typeof insight.overview !== "string" ||
    [...insight.findings, ...insight.recommendations].some(
      (item) =>
        !Array.isArray(item.evidence) ||
        item.evidence.some((id) => !Object.hasOwn(report.evidence, id)),
    )
  )
    return { ...report, insights: null, insightsStatus: "failed" };

  return report;
}
