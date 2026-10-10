import { describe, expect, it } from "vitest";
import { useChartPlot } from "@/shared/lib/composables/useChartPlot";

describe("chart value mapping", () => {
  it("preserves zero and breaks lines for unavailable values", () => {
    const { series } = useChartPlot({
      data: [],
      lines: [
        {
          id: "sales",
          label: "Sales",
          unit: "EUR",
          color: "gold",
          values: [0, null],
        },
      ],
    });

    const y = series.value[0]!.y;

    expect(y({ index: 0, date: "2026-10-01", values: { sales: 0 } })).toBe(0);

    expect(
      y({ index: 1, date: "2026-10-02", values: { sales: null } }),
    ).toBeNaN();
  });
});
