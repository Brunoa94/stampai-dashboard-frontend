import type {
  ReportIssueKindType,
  ReportIssueTargetType,
  ReportIssueType,
} from "@/shared/lib/types/reportIssues";

const REFERENCE_MAX_LENGTH = 300;

const TITLE_MAX_LENGTH = 250;

// Mirrors the API fingerprint: alert ids stay exact, finding titles and limitations are normalized.
export function issueFingerprint(
  kind: ReportIssueKindType,
  reference: string,
): string {
  const trimmed = reference.trim();

  const normalized =
    kind === "alert" ? trimmed : trimmed.replace(/\s+/g, " ").toLowerCase();

  return normalized.slice(0, REFERENCE_MAX_LENGTH);
}

export function issueKey(target: ReportIssueTargetType): string {
  return [
    target.source,
    target.scope ?? "",
    target.kind,
    issueFingerprint(target.kind, target.reference),
  ].join("|");
}

export function storedIssueKey(issue: ReportIssueType): string {
  return [issue.source, issue.scope, issue.kind, issue.fingerprint].join("|");
}

export function issueReference(value: string): string {
  return value.trim().slice(0, REFERENCE_MAX_LENGTH);
}

export function issueTitle(value: string): string {
  const title = value.trim().replace(/\s+/g, " ");

  return title.length > TITLE_MAX_LENGTH
    ? `${title.slice(0, TITLE_MAX_LENGTH - 1)}…`
    : title;
}

export function validReportIssue(value: unknown): value is ReportIssueType {
  if (!value || typeof value !== "object") return false;

  const issue = value as Record<string, unknown>;

  return (
    typeof issue.id === "number" &&
    (issue.source === "finance" || issue.source === "analytics") &&
    typeof issue.scope === "string" &&
    (issue.kind === "alert" ||
      issue.kind === "finding" ||
      issue.kind === "limitation") &&
    typeof issue.fingerprint === "string" &&
    (issue.status === "github_created" || issue.status === "dismissed") &&
    (issue.github_issue_url === null ||
      (typeof issue.github_issue_url === "string" &&
        issue.github_issue_url.startsWith("https://")))
  );
}
