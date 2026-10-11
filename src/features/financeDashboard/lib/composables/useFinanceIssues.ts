import { computed, type Ref } from "vue";
import { useReportIssues } from "@/shared/lib/composables/useReportIssues";
import {
  alertIssue,
  findingIssue,
  limitationIssue,
} from "@/features/financeDashboard/lib/mappers/financeIssues";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";

export function useFinanceIssues(report: Ref<FinanceReportType>) {
  const issues = useReportIssues("finance");

  // The API already omits dismissed issues; this hides ones dismissed in this session.
  const alerts = computed(() =>
    report.value.dashboard.alerts.filter(
      (alert) => !issues.isDismissed(alertIssue(report.value, alert)),
    ),
  );

  const findings = computed(() =>
    (report.value.insights?.findings ?? []).filter(
      (finding) => !issues.isDismissed(findingIssue(report.value, finding)),
    ),
  );

  function visibleLimitations(notes: string[]): string[] {
    return notes.filter(
      (note) => !issues.isDismissed(limitationIssue(report.value, note)),
    );
  }

  const limitations = computed(() =>
    visibleLimitations(report.value.dashboard.limitations),
  );

  const reviewLimitations = computed(() =>
    visibleLimitations([
      ...report.value.dashboard.limitations,
      ...(report.value.insights?.limitations ?? []),
    ]),
  );

  return { ...issues, alerts, findings, limitations, reviewLimitations };
}
