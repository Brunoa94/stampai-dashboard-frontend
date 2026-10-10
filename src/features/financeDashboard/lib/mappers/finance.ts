import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import type { SeriesType } from "@/shared/lib/types/table";
import { receiptsComplete } from "@/features/financeDashboard/lib/helpers/finance";

export function receiptSeries(
  report: FinanceReportType,
  currency: string,
): SeriesType[] {
  const complete = receiptsComplete(report);

  const digits =
    report.dashboard.summaries.find((s) => s.currency === currency)
      ?.fractionDigits ?? 2;

  return ["salesMinor", "refundsMinor", "feesMinor", "netReceiptsMinor"].map(
    (metric) => ({
      id: metric,
      label:
        {
          salesMinor: "Sales",
          refundsMinor: "Refunds",
          feesMinor: "Processing fees",
          netReceiptsMinor: "Net receipts",
        }[metric] ?? metric,
      unit: `${currency} major units`,
      values: report.dashboard.dailySeries.map((day) => {
        const row = day.summaries.find((s) => s.currency === currency);

        const value = row
          ? row[
              metric as
                "salesMinor" | "refundsMinor" | "feesMinor" | "netReceiptsMinor"
            ]
          : complete
            ? 0
            : null;

        return value === null ? null : value / 10 ** digits;
      }),
    }),
  );
}

import { money } from "@/shared/lib/helpers/format";

export function receiptOverview(report: FinanceReportType) {
  return report.dashboard.summaries.map((summary) => ({
    summary,
    series: receiptSeries(report, summary.currency),
    cards: [
      {
        metric: "salesMinor",
        label: "Classified sales",
        value: summary.salesMinor,
      },
      {
        metric: "refundsMinor",
        label: "Outgoing refunds",
        value: summary.refundsMinor,
      },
      {
        metric: "feesMinor",
        label: "Known processing fees",
        value: summary.feesMinor,
      },
      {
        metric: "netReceiptsMinor",
        label: "Net receipts",
        value: summary.netReceiptsMinor,
      },
    ].map((card) => {
      const trend = report.dashboard.trends.find(
        (t) => t.currency === summary.currency && t.metric === card.metric,
      );

      return {
        ...card,
        formatted: money(card.value, summary.currency, summary.fractionDigits),
        change: trend?.comparable
          ? trend.percentChange === null
            ? "No percentage baseline"
            : `${trend.percentChange! > 0 ? "+" : ""}${trend.percentChange?.toFixed(1)}%`
          : "Not comparable",
        note: `Previous: ${money(trend?.previousValue, summary.currency, summary.fractionDigits)} · change: ${money(trend?.absoluteChange, summary.currency, summary.fractionDigits)}`,
      };
    }),
  }));
}
