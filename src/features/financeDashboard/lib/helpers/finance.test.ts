import { describe, it, expect } from "vitest";
import { financeFixture } from "@/test/fixtures";
import {
  receiptsComplete,
  contributionEligible,
  transactionKey,
} from "@/features/financeDashboard/lib/helpers/finance";
import { receiptSeries } from "@/features/financeDashboard/lib/mappers/finance";
import {
  validateReference,
  validateSchedule,
  validFinanceReport,
} from "@/features/financeDashboard/lib/helpers/validation";

describe("Finance semantics", () => {
  it("rejects fractional minor units and invalid currencies", () => {
    const r = financeFixture();

    r.dashboard.summaries[0]!.salesMinor = 1.5;

    expect(validFinanceReport(r)).toBe(false);

    r.dashboard.summaries[0]!.salesMinor = 1;

    r.dashboard.summaries[0]!.currency = "invalid";

    expect(validFinanceReport(r)).toBe(false);
  });

  it("fills absent currency with zero only when both payment sources are complete", () => {
    const r = financeFixture();

    expect(receiptSeries(r, "JPY")[0]?.values).toEqual([0]);

    r.dashboard.coverage[0]!.status = "failed";

    expect(receiptsComplete(r)).toBe(false);

    expect(receiptSeries(r, "JPY")[0]?.values).toEqual([null]);
  });

  it("keeps null net receipts and negative fee reversals", () => {
    const r = financeFixture();

    r.dashboard.dailySeries[0]!.summaries = [
      { ...r.dashboard.summaries[0]!, feesMinor: -5, netReceiptsMinor: null },
    ];

    expect(
      receiptSeries(r, "JPY").find((s) => s.id === "feesMinor")?.values,
    ).toEqual([-5]);

    expect(
      receiptSeries(r, "JPY").find((s) => s.id === "netReceiptsMinor")?.values,
    ).toEqual([null]);
  });

  it("does not permit contribution without configuration and complete linkage", () => {
    const r = financeFixture();

    expect(contributionEligible(r)).toBe(true);

    r.costConfiguration.costBasis = null;

    expect(contributionEligible(r)).toBe(false);

    r.costConfiguration.costBasis = "line_total";

    r.dashboard.coverage.push({
      source: "invoice_links",
      status: "failed",
      recordCount: null,
      error: "private",
    });

    expect(contributionEligible(r)).toBe(false);
  });

  it("uses provider, ID, date and category for transaction identity", () => {
    const tx = {
      id: "1",
      provider: "stripe",
      date: "2026-10-01",
      category: "sale",
      status: "complete",
      currency: "USD",
      amountMinor: 1,
      feeMinor: null,
      netMinor: null,
      reference: null,
      paymentReference: null,
    };

    expect(transactionKey(tx)).not.toBe(
      transactionKey({ ...tx, provider: "paypal" }),
    );

    expect(transactionKey(tx)).not.toBe(
      transactionKey({ ...tx, category: "refund" }),
    );
  });

  it("allows explicit null metadata but rejects invalid IDs and references", () => {
    expect(() =>
      validateReference(1, {
        currency: null,
        provider_transaction_id: null,
        order_reference: null,
      }),
    ).not.toThrow();

    expect(() =>
      validateReference(0, {
        currency: null,
        provider_transaction_id: null,
        order_reference: null,
      }),
    ).toThrow();

    expect(() =>
      validateReference(1, {
        currency: "usd",
        provider_transaction_id: "x",
        order_reference: null,
      }),
    ).toThrow();
  });

  it("requires future UTC schedule and inclusive bounded cadence", () => {
    const body = {
      name: "Daily",
      enabled: false,
      cadence_days: 1,
      lookback_days: 31,
      include_ai: false,
      next_run_at: new Date(Date.now() + 86400000).toISOString(),
    };

    expect(() => validateSchedule(body)).not.toThrow();

    expect(() => validateSchedule({ ...body, cadence_days: 32 })).toThrow();

    expect(() =>
      validateSchedule({ ...body, next_run_at: "2020-01-01T00:00:00Z" }),
    ).toThrow();
  });
});
