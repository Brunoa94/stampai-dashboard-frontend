export type ReportIssueSourceType = "finance" | "analytics";

export type ReportIssueKindType = "alert" | "finding" | "limitation";

export type ReportIssueStatusType = "github_created" | "dismissed";

export type ReportIssueTargetType = {
  source: ReportIssueSourceType;
  scope?: string;
  kind: ReportIssueKindType;
  reference: string;
};

export type ReportIssueInputType = ReportIssueTargetType & {
  title: string;
  description: string;
  severity?: string;
  report_id?: string;
  evidence?: string[];
};

export type ReportIssueType = {
  id: number;
  source: ReportIssueSourceType;
  scope: string;
  kind: ReportIssueKindType;
  fingerprint: string;
  reference: string;
  title: string;
  status: ReportIssueStatusType;
  report_id: string | null;
  github_issue_number: number | null;
  github_issue_url: string | null;
  created_at: string;
  updated_at: string;
};
