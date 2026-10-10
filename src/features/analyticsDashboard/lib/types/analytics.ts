export type FunnelType =
  | "acquisition"
  | "engagement"
  | "product_configuration"
  | "generation"
  | "ecommerce"
  | "authentication";

export type AnalyticsRequestType = {
  start_date: string;
  end_date: string;
  funnels: FunnelType[];
};

export type SummaryType = {
  id: string;
  label: string;
  value: number | null;
  unit: "events" | "money";
  previousValue: number | null;
  absoluteChange: number | null;
  percentChange: number | null;
};

export type StageType = {
  id: string;
  label: string;
  eventCount: number;
  unit: string;
};

export type BreakdownType = {
  dimensions: Record<string, string>;
  eventCount: number;
  purchaseRevenue: number | null;
};

export type ItemType = {
  date: string;
  itemId: string | null;
  itemName: string | null;
  itemsSelected: number;
  itemsAddedToCart: number;
  itemsPurchased: number;
  itemRevenue: number;
};

export type InsightType = {
  title: string;
  description: string;
  evidence: string[];
  severity?: "info" | "warning" | "critical";
  priority?: "low" | "medium" | "high";
  category?: "ux" | "copy" | "technical" | "pricing" | "trust" | "measurement";
};

export type AnalyticsReportType = {
  gaEvent: FunnelType;
  analysisId: number;
  period: { startDate: string; endDate: string };
  dashboard: {
    summaryCards: SummaryType[];
    dailySeries: {
      date: string;
      eventCounts: Record<string, number>;
      purchaseRevenue: number | null;
    }[];
    stages: StageType[];
    breakdowns: Record<string, BreakdownType[]>;
    comparisonPeriod: { startDate: string; endDate: string };
    dataQuality: {
      hasData: boolean;
      hasComparisonData: boolean;
      currency: string | null;
      measurement: string;
      limitations: string[];
    };
  };
  metrics: {
    eventCounts: Record<string, number>;
    totalPageViews: number;
    purchaseRevenue: number;
    revenueCurrency: string | null;
    itemActivity: ItemType[];
  };
  report: {
    overview: string;
    findings: InsightType[];
    recommendations: InsightType[];
    limitations: string[];
  };
  model: string;
  tokensUsed: number;
};

export type AggregatedItemType = {
  key: string;
  itemId: string | null;
  itemName: string | null;
  itemsSelected: number;
  itemsAddedToCart: number;
  itemsPurchased: number;
  itemRevenue: number;
  rows: ItemType[];
};
