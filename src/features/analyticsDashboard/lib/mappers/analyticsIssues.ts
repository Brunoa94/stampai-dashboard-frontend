import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import type { InsightEntryType } from "@/shared/lib/types/insights";
import type { ReportIssueInputType } from "@/shared/lib/types/reportIssues";
import { issueReference, issueTitle } from "@/shared/lib/helpers/reportIssues";

export function limitationIssue(
  report: AnalyticsReportType,
  note: string,
): ReportIssueInputType {
  return {
    source: "analytics",
    scope: report.gaEvent,
    kind: "limitation",
    reference: issueReference(note),
    title: issueTitle(note),
    description: note,
    report_id: String(report.analysisId),
    evidence: [
      `Funnel: ${report.gaEvent}`,
      `Report period: ${report.period.startDate} — ${report.period.endDate}`,
    ],
  };
}

export function findingIssue(
  report: AnalyticsReportType,
  finding: InsightEntryType,
): ReportIssueInputType {
  return {
    source: "analytics",
    scope: report.gaEvent,
    kind: "finding",
    reference: issueReference(finding.title),
    title: issueTitle(finding.title),
    description: finding.description,
    severity: finding.severity,
    report_id: String(report.analysisId),
    evidence: [
      ...finding.evidence,
      `Funnel: ${report.gaEvent}`,
      `Report period: ${report.period.startDate} — ${report.period.endDate}`,
    ],
  };
}
