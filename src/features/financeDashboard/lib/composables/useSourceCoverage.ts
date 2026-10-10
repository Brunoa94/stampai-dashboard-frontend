import { computed } from "vue";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";

export function useSourceCoverage(
  props: Readonly<{ report: FinanceReportType }>,
) {
  const completed = computed(
    () =>
      props.report.dashboard.coverage.filter(
        (source) => source.status === "complete",
      ).length,
  );

  const failed = computed(
    () =>
      props.report.dashboard.coverage.filter(
        (source) => source.status === "failed",
      ).length,
  );

  const configured = computed(() =>
    Boolean(
      props.report.costConfiguration.currency &&
      props.report.costConfiguration.costBasis,
    ),
  );

  return { completed, failed, configured };
}
