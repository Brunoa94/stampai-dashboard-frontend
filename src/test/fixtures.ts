import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import type {
  DashboardType,
  FinanceReportType,
} from "@/features/financeDashboard/lib/types/finance";

export function analyticsFixture(): AnalyticsReportType {
  return {
    gaEvent: "generation",
    analysisId: 1,
    period: { startDate: "2026-10-01", endDate: "2026-10-01" },
    dashboard: {
      summaryCards: [
        {
          id: "generation_start",
          label: "Generation start",
          value: 0,
          unit: "events",
          previousValue: 0,
          absoluteChange: 0,
          percentChange: null,
        },
      ],
      dailySeries: [
        {
          date: "2026-10-01",
          eventCounts: { generation_start: 0 },
          purchaseRevenue: null,
        },
      ],
      stages: [],
      breakdowns: {},
      comparisonPeriod: { startDate: "2026-09-30", endDate: "2026-09-30" },
      dataQuality: {
        hasData: false,
        hasComparisonData: false,
        currency: null,
        measurement: "aggregated_events",
        limitations: [],
      },
    },
    metrics: {
      eventCounts: {},
      totalPageViews: 0,
      purchaseRevenue: 0,
      revenueCurrency: null,
      itemActivity: [],
    },
    report: {
      overview: "No reported activity",
      findings: [],
      recommendations: [],
      limitations: [],
    },
    model: "fixture",
    tokensUsed: 0,
  };
}

export function dashboardFixture(): DashboardType {
  return {
    summaries: [
      {
        currency: "JPY",
        fractionDigits: 0,
        salesMinor: 100,
        refundsMinor: 0,
        feesMinor: 0,
        netReceiptsMinor: 100,
        unclassifiedCount: 0,
      },
    ],
    dailySeries: [{ date: "2026-10-01", summaries: [] }],
    transactions: [],
    invoices: [],
    orders: [],
    orderMetrics: {
      totalOrders: 0,
      fulfilledOrders: 0,
      pendingOrders: 0,
      matchedOrders: 0,
      contributionEligibleOrders: 0,
      averageFulfillmentDays: null,
    },
    products: [],
    contributionSummaries: [],
    trends: [],
    balances: [],
    balanceAsOf: null,
    coverage: ["stripe", "paypal", "invoices", "printify"].map((source) => ({
      source,
      status: "complete",
      recordCount: 0,
      error: null,
    })),
    limitations: [],
    alerts: [],
  };
}

export function financeFixture(): FinanceReportType {
  return {
    id: "finance_fixture",
    generatedAt: "2026-10-02T12:00:00Z",
    calculationVersion: "finance-v2",
    period: { startDate: "2026-10-01", endDate: "2026-10-01", timezone: "UTC" },
    comparisonPeriod: { startDate: "2026-09-30", endDate: "2026-09-30" },
    costConfiguration: { currency: "JPY", costBasis: "line_total" },
    dashboard: dashboardFixture(),
    comparison: dashboardFixture(),
    insights: null,
    insightsStatus: "not_requested",
    evidence: {},
  };
}
