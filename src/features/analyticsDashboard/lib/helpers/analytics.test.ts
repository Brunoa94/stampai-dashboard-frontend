import { describe, it, expect } from "vitest";
import {
  aggregateItems,
  breakdownRows,
  analyticsSeries,
} from "@/features/analyticsDashboard/lib/mappers/analytics";
import { stageNodes } from "@/features/analyticsDashboard/lib/helpers/stages";
import { validateAnalyticsResponse } from "@/features/analyticsDashboard/lib/helpers/validation";
import { analyticsFixture } from "@/test/fixtures";

describe("Analytics semantics", () => {
  it("rejects malformed numeric payloads", () => {
    const r = analyticsFixture();

    r.dashboard.summaryCards[0]!.value = Number.NaN;

    expect(validateAnalyticsResponse([r], ["generation"])).toBe(false);
  });

  it("matches batch reports by funnel and rejects duplicate or missing results", () => {
    const r = analyticsFixture();

    expect(validateAnalyticsResponse([r], ["generation"])).toBe(true);

    expect(validateAnalyticsResponse([r, r], ["generation", "ecommerce"])).toBe(
      false,
    );

    expect(validateAnalyticsResponse({ data: [r] }, ["generation"])).toBe(
      false,
    );
  });

  it("keeps unidentified products separate and aggregates identified items", () => {
    const item = {
      date: "20261001",
      itemId: "1",
      itemName: "Shirt",
      itemsSelected: 2,
      itemsAddedToCart: 1,
      itemsPurchased: 0,
      itemRevenue: 0,
    };

    const products = aggregateItems([
      item,
      { ...item, date: "20261002" },
      { ...item, itemId: null },
      { ...item, itemId: null },
    ]);

    expect(products).toHaveLength(3);

    expect(products[0]?.itemsSelected).toBe(4);

    expect(products[0]?.rows).toHaveLength(2);
  });

  it("retains stage ordering and later counts exceeding earlier counts", () => {
    const nodes = stageNodes([
      { id: "start", label: "Start", eventCount: 0, unit: "events" },
      { id: "complete", label: "Complete", eventCount: 200, unit: "events" },
    ]);

    expect(nodes.map((n) => n.id)).toEqual(["start", "complete"]);

    expect(nodes[0]?.radius).toBe(48);

    expect(nodes[1]?.radius).toBe(72);

    expect(nodes[1]?.eventCount).toBe(200);
  });

  it("keeps unknown dimensions and zero denominators visible", () => {
    const r = analyticsFixture();

    r.dashboard.breakdowns.pages = [
      { dimensions: { path: "" }, eventCount: 0, purchaseRevenue: null },
    ];

    expect(breakdownRows(r, "pages")[0]?.cells).toEqual({
      path: "Unknown",
      eventCount: 0,
      share: null,
      purchaseRevenue: null,
    });
  });

  it("preserves daily rows including zeros", () => {
    expect(analyticsSeries(analyticsFixture())[0]?.values).toEqual([0]);
  });
});
