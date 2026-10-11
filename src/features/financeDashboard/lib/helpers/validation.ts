import {
  validNumericValues,
  stringArray,
} from "@/shared/lib/helpers/validation";
import { validDate } from "@/shared/lib/helpers/dates";
import { AppError } from "@/shared/lib/constants/errors";
import type {
  FinanceReportType,
  ReferenceRequestType,
} from "@/features/financeDashboard/lib/types/finance";

export function validFinanceReport(value: unknown): value is FinanceReportType {
  if (!value || typeof value !== "object") return false;

  const r = value as FinanceReportType;

  return (
    validNumericValues(r) &&
    typeof r.id === "string" &&
    typeof r.generatedAt === "string" &&
    Number.isFinite(Date.parse(r.generatedAt)) &&
    !!r.period &&
    validDate(r.period.startDate) &&
    validDate(r.period.endDate) &&
    !!r.comparisonPeriod &&
    !!r.costConfiguration &&
    !!r.evidence &&
    !!r.dashboard &&
    !!r.comparison &&
    [
      "summaries",
      "dailySeries",
      "transactions",
      "invoices",
      "orders",
      "products",
      "contributionSummaries",
      "trends",
      "balances",
      "coverage",
      "limitations",
      "alerts",
    ].every((key) =>
      Array.isArray(r.dashboard[key as keyof typeof r.dashboard]),
    ) &&
    stringArray(r.dashboard.limitations) &&
    r.dashboard.dailySeries.every(
      (day) => validDate(day.date) && Array.isArray(day.summaries),
    ) &&
    r.dashboard.summaries.every(
      (summary) =>
        typeof summary.currency === "string" &&
        Number.isInteger(summary.fractionDigits) &&
        summary.fractionDigits >= 0 &&
        summary.fractionDigits <= 20,
    ) &&
    !!r.dashboard.orderMetrics
  );
}

export function validateReference(
  id: number,
  body: ReferenceRequestType,
): void {
  if (
    !Number.isInteger(id) ||
    id < 1 ||
    (body.currency !== null && !/^[A-Z]{3}$/.test(body.currency)) ||
    [body.provider_transaction_id, body.order_reference].some(
      (value) => value !== null && (!value.trim() || value.length > 150),
    )
  )
    throw new AppError("REFERENCE");
}
