import type {
  FinanceReportType,
  TransactionType,
  OrderType,
} from "@/features/financeDashboard/lib/types/finance";

export function transactionKey(row: TransactionType): string {
  return JSON.stringify([row.provider, row.id, row.date, row.category]);
}

export function receiptsComplete(report: FinanceReportType): boolean {
  return ["stripe", "paypal"].every((source) =>
    report.dashboard.coverage.some(
      (c) => c.source === source && c.status === "complete",
    ),
  );
}

export function contributionEligible(
  report: FinanceReportType,
  order?: OrderType,
): boolean {
  const config = report.costConfiguration;

  const required = ["stripe", "paypal", "invoices", "printify"];

  const optional = ["refund_references", "invoice_links"];

  const covered =
    required.every((source) =>
      report.dashboard.coverage.some(
        (c) => c.source === source && c.status === "complete",
      ),
    ) &&
    report.dashboard.coverage
      .filter((c) => optional.includes(c.source))
      .every((c) => c.status === "complete");

  return (
    !!config.currency &&
    !!config.costBasis &&
    covered &&
    (!order ||
      (order.paymentMatchStatus === "matched" &&
        order.currency === config.currency &&
        order.invoiceId !== null &&
        order.revenueMinor !== null &&
        order.refundsMinor !== null &&
        order.feesMinor !== null &&
        order.productionCostMinor !== null &&
        order.shippingCostMinor !== null &&
        order.taxCostMinor !== null &&
        order.profitMinor !== null))
  );
}

export function evidenceTarget(id: string): string | null {
  if (id.includes(":coverage:")) return "finance-coverage";

  if (id.includes(":contribution:")) return "finance-contribution";

  if (id.includes(":summary:")) return "finance-summaries";

  return null;
}
