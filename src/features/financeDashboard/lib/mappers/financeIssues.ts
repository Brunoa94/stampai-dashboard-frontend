import type {
  AlertType,
  FinanceReportType,
} from "@/features/financeDashboard/lib/types/finance";
import type { InsightEntryType } from "@/shared/lib/types/insights";
import type { ReportIssueInputType } from "@/shared/lib/types/reportIssues";
import { issueReference, issueTitle } from "@/shared/lib/helpers/reportIssues";

function periodLabel(report: FinanceReportType): string {
  return `Report period: ${report.period.startDate} — ${report.period.endDate} UTC`;
}

export function alertIssue(
  report: FinanceReportType,
  alert: AlertType,
): ReportIssueInputType {
  return {
    source: "finance",
    kind: "alert",
    reference: issueReference(alert.id),
    title: issueTitle(alert.message),
    description: alert.message,
    severity: alert.severity,
    report_id: report.id,
    evidence: [`Alert id: ${alert.id}`, periodLabel(report)],
  };
}

export function limitationIssue(
  report: FinanceReportType,
  note: string,
): ReportIssueInputType {
  return {
    source: "finance",
    kind: "limitation",
    reference: issueReference(note),
    title: issueTitle(note),
    description: note,
    report_id: report.id,
    evidence: [periodLabel(report)],
  };
}

export function findingIssue(
  report: FinanceReportType,
  finding: InsightEntryType,
): ReportIssueInputType {
  const evidence = finding.evidence
    .filter((id) => report.evidence[id])
    .map((id) => {
      const item = report.evidence[id];

      return `${item.label}: ${item.value ?? "Unavailable"} ${item.unit}`.trim();
    });

  return {
    source: "finance",
    kind: "finding",
    reference: issueReference(finding.title),
    title: issueTitle(finding.title),
    description: finding.description,
    report_id: report.id,
    evidence: [...evidence, periodLabel(report)],
  };
}
