import { validDate } from "@/shared/lib/helpers/dates";
import {
  validNumericValues,
  stringArray,
  isRecord,
} from "@/shared/lib/helpers/validation";
import type {
  AnalyticsReportType,
  FunnelType,
} from "@/features/analyticsDashboard/lib/types/analytics";

export function validateAnalyticsResponse(
  value: unknown,
  funnels: FunnelType[],
): value is AnalyticsReportType[] {
  if (!Array.isArray(value) || value.length !== funnels.length) return false;

  const seen = new Set<string>();

  return value.every((report) => {
    if (!report || typeof report !== "object") return false;

    const r = report as AnalyticsReportType;

    if (
      !funnels.includes(r.gaEvent) ||
      seen.has(r.gaEvent) ||
      typeof r.analysisId !== "number" ||
      !r.period ||
      !r.dashboard ||
      !r.metrics ||
      !r.report ||
      !validNumericValues(r) ||
      !validDate(r.period.startDate) ||
      !validDate(r.period.endDate)
    )
      return false;

    seen.add(r.gaEvent);

    return (
      Array.isArray(r.dashboard.summaryCards) &&
      r.dashboard.summaryCards.every(
        (card) =>
          typeof card.id === "string" &&
          typeof card.label === "string" &&
          [
            card.value,
            card.previousValue,
            card.absoluteChange,
            card.percentChange,
          ].every((v) => v === null || typeof v === "number"),
      ) &&
      Array.isArray(r.dashboard.dailySeries) &&
      r.dashboard.dailySeries.every(
        (day) =>
          validDate(day.date) &&
          isRecord(day.eventCounts) &&
          Object.values(day.eventCounts).every(
            (count) => Number.isInteger(count) && count >= 0,
          ),
      ) &&
      Array.isArray(r.dashboard.stages) &&
      isRecord(r.dashboard.breakdowns) &&
      Object.values(r.dashboard.breakdowns).every(
        (rows) =>
          Array.isArray(rows) &&
          rows.every(
            (row) =>
              isRecord(row.dimensions) && typeof row.eventCount === "number",
          ),
      ) &&
      !!r.dashboard.dataQuality &&
      typeof r.dashboard.dataQuality.hasData === "boolean" &&
      typeof r.dashboard.dataQuality.hasComparisonData === "boolean" &&
      stringArray(r.dashboard.dataQuality.limitations) &&
      !!r.dashboard.comparisonPeriod &&
      Array.isArray(r.metrics.itemActivity) &&
      Array.isArray(r.report.findings) &&
      Array.isArray(r.report.recommendations) &&
      typeof r.report.overview === "string" &&
      [...r.report.findings, ...r.report.recommendations].every(
        (item) =>
          typeof item.title === "string" &&
          typeof item.description === "string" &&
          stringArray(item.evidence),
      ) &&
      stringArray(r.report.limitations)
    );
  });
}
