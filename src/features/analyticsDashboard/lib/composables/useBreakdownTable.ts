import type { ExportContextType } from "@/shared/lib/types/table";
import { computed, ref } from "vue";
import { breakdownRows } from "@/features/analyticsDashboard/lib/mappers/analytics";
import type { BreakdownTableInputType } from "@/features/analyticsDashboard/lib/types/componentInputs";

export function useBreakdownTable(props: Readonly<BreakdownTableInputType>) {
  const filters = ref<Record<string, string>>({});

  const dimensions = computed(() => [
    ...new Set(
      (props.report.dashboard.breakdowns[props.name] ?? []).flatMap((row) =>
        Object.keys(row.dimensions),
      ),
    ),
  ]);

  const options = computed(() =>
    Object.fromEntries(
      dimensions.value.map((key) => [
        key,
        [
          { value: "", label: "All values" },
          ...[
            ...new Set(
              (props.report.dashboard.breakdowns[props.name] ?? []).map(
                (row) => row.dimensions[key] || "Unknown",
              ),
            ),
          ].map((value) => ({ value, label: value })),
        ],
      ]),
    ),
  );

  const columns = computed(() =>
    dimensions.value
      .map((key) => ({ key, label: key }))
      .concat([
        { key: "eventCount", label: "Event count" },
        { key: "share", label: "Share of returned breakdown events" },
        {
          key: "purchaseRevenue",
          label: `Purchase revenue (${props.report.dashboard.dataQuality.currency ?? "currency unknown"})`,
        },
      ]),
  );

  const rows = computed(() =>
    breakdownRows(props.report, props.name).filter((row) =>
      dimensions.value.every(
        (key) => !filters.value[key] || row.cells[key] === filters.value[key],
      ),
    ),
  );

  const exportContext = computed<ExportContextType>(() => ({
    scope: "Returned breakdown with local dimension filters",
    funnel: props.report.gaEvent,
    period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
    comparison: `${props.report.dashboard.comparisonPeriod.startDate} — ${props.report.dashboard.comparisonPeriod.endDate}`,
    units: "Counts are events; revenue is in reported major currency units.",
  }));

  return { filters, dimensions, options, columns, rows, exportContext };
}
