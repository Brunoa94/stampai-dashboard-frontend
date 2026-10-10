import { downloadCsv } from "@/shared/lib/helpers/csv";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";

export function exportAnalyticsSummary(report: AnalyticsReportType): void {
  downloadCsv(
    "Summary cards",
    [
      { key: "label", label: "Metric" },
      { key: "value", label: "Value" },
      { key: "unit", label: "Unit" },
      { key: "previousValue", label: "Previous value" },
      { key: "absoluteChange", label: "Absolute change" },
      { key: "percentChange", label: "Percent change" },
    ],
    report.dashboard.summaryCards.map((card) => ({
      key: card.id,
      cells: { ...card },
    })),
    {
      scope: "Visible summary cards",
      period: `${report.period.startDate} — ${report.period.endDate}`,
      comparison: `${report.dashboard.comparisonPeriod.startDate} — ${report.dashboard.comparisonPeriod.endDate}`,
      funnel: report.gaEvent,
      units: report.dashboard.dataQuality.currency ?? "currency unknown",
    },
  );
}
