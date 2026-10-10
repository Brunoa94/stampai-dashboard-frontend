import { computed } from "vue";
import {
  analyticsSeries,
  analyticsCards,
} from "@/features/analyticsDashboard/lib/mappers/analytics";
import type { AnalyticsOverviewInputType } from "@/features/analyticsDashboard/lib/types/componentInputs";

export function useAnalyticsOverview(
  props: Readonly<AnalyticsOverviewInputType>,
) {
  const cards = computed(() => analyticsCards(props.report));

  const series = computed(() => analyticsSeries(props.report));

  const dates = computed(() =>
    props.report.dashboard.dailySeries.map((day) => day.date),
  );

  const revenue = computed(() => [
    {
      id: "purchaseRevenue",
      label: "Purchase revenue",
      unit: props.report.dashboard.dataQuality.currency ?? "currency unknown",
      values: props.report.dashboard.dailySeries.map(
        (day) => day.purchaseRevenue,
      ),
    },
  ]);

  const context = computed(() => ({
    scope: "Returned daily data",
    period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
    comparison: `${props.report.dashboard.comparisonPeriod.startDate} — ${props.report.dashboard.comparisonPeriod.endDate}`,
    funnel: props.report.gaEvent,
  }));

  return { cards, series, dates, revenue, context };
}
