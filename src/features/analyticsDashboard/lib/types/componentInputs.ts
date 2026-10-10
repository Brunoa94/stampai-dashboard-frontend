import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";

export type BreakdownTableInputType = {
  report: AnalyticsReportType;
  name: string;
};

export type ProductActivityInputType = { report: AnalyticsReportType };

export type AnalyticsOverviewInputType = { report: AnalyticsReportType };
