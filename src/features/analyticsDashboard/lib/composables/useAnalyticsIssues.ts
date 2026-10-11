import { computed, type Ref } from "vue";
import { useReportIssues } from "@/shared/lib/composables/useReportIssues";
import {
  findingIssue,
  limitationIssue,
} from "@/features/analyticsDashboard/lib/mappers/analyticsIssues";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";

export function useAnalyticsIssues(report: Ref<AnalyticsReportType>) {
  const issues = useReportIssues("analytics");

  // The API already omits dismissed findings; this hides ones dismissed in this session.
  const findings = computed(() =>
    report.value.report.findings.filter(
      (finding) => !issues.isDismissed(findingIssue(report.value, finding)),
    ),
  );

  function visibleLimitations(notes: string[]): string[] {
    return notes.filter(
      (note) => !issues.isDismissed(limitationIssue(report.value, note)),
    );
  }

  const dataQualityLimitations = computed(() =>
    visibleLimitations(report.value.dashboard.dataQuality.limitations),
  );

  const reviewLimitations = computed(() =>
    visibleLimitations([
      ...report.value.dashboard.dataQuality.limitations,
      ...report.value.report.limitations,
    ]),
  );

  return { ...issues, findings, dataQualityLimitations, reviewLimitations };
}
