import { describe, expect, it } from "vitest";
import { validFinanceReport } from "@/features/financeDashboard/lib/helpers/validation";
import { financeFixture } from "@/test/fixtures";

describe("Saved finance report validation", () => {
  it("accepts namespaced evidence IDs ending in Minor", () => {
    const report = financeFixture();

    report.evidence = {
      "current:summary:JPY:salesMinor": {
        label: "Classified sales",
        value: 1200,
        unit: "JPY minor units",
      },
      "comparison:summary:JPY:netReceiptsMinor": {
        label: "Previous net receipts",
        value: null,
        unit: "JPY minor units",
      },
    };

    expect(validFinanceReport(report)).toBe(true);
  });

  it("continues rejecting fractional and unsafe monetary values", () => {
    const report = financeFixture();

    report.dashboard.summaries[0]!.salesMinor = 0.5;

    expect(validFinanceReport(report)).toBe(false);

    report.dashboard.summaries[0]!.salesMinor = Number.MAX_SAFE_INTEGER + 1;

    expect(validFinanceReport(report)).toBe(false);
  });

  it("rejects non-finite numbers in evidence entries", () => {
    const report = financeFixture();

    report.evidence = {
      "current:summary:JPY:salesMinor": {
        label: "Classified sales",
        value: Number.NaN,
        unit: "JPY minor units",
      },
    };

    expect(validFinanceReport(report)).toBe(false);
  });
});
