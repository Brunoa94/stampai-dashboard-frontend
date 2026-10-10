export type FinanceRequestType = {
  request_id: string;
  start_date: string;
  end_date: string;
  include_ai: boolean;
};

export type ReceiptType = {
  currency: string;
  fractionDigits: number;
  salesMinor: number;
  refundsMinor: number;
  feesMinor: number;
  netReceiptsMinor: number | null;
  unclassifiedCount: number;
};

export type TransactionType = {
  id: string;
  provider: string;
  date: string;
  category: string;
  status: string;
  currency: string;
  amountMinor: number;
  feeMinor: number | null;
  netMinor: number | null;
  reference: string | null;
  paymentReference: string | null;
};

export type InvoiceType = {
  id: number;
  provider: string;
  amountMinor: number | null;
  currency: string | null;
  date: string;
  paymentReference: string | null;
  orderReference: string | null;
  transactionId: string | null;
  matchStatus:
    | "matched"
    | "unmatched"
    | "duplicate"
    | "amount_mismatch"
    | "currency_mismatch"
    | "status_mismatch";
  reason: string | null;
};

export type OrderType = {
  id: string;
  orderReference: string | null;
  date: string;
  status: string;
  totalPriceMinor: number;
  shippingMinor: number | null;
  taxMinor: number | null;
  currency: string | null;
  fulfilledAt: string | null;
  fulfillmentDays: number | null;
  paymentMatchStatus: string;
  invoiceId: number | null;
  productionCostMinor: number | null;
  shippingCostMinor: number | null;
  taxCostMinor: number | null;
  revenueMinor: number | null;
  refundsMinor: number | null;
  feesMinor: number | null;
  profitMinor: number | null;
  marginPercent: number | null;
  limitation: string | null;
};

export type ProductType = {
  productId: string;
  name: string | null;
  currency: string;
  quantity: number;
  orderCount: number;
  allocatedRevenueMinor: number;
  allocatedRefundsMinor: number;
  allocatedFeesMinor: number;
  productionCostMinor: number;
  allocatedShippingMinor: number;
  allocatedTaxMinor: number;
  contributionMinor: number;
  allocationMethod: "retail_weight";
};

export type ContributionType = {
  currency: string;
  matchedOrderCount: number;
  revenueMinor: number;
  refundsMinor: number;
  feesMinor: number;
  productionCostMinor: number;
  shippingCostMinor: number;
  taxCostMinor: number;
  contributionMinor: number | null;
  marginPercent: number | null;
};

export type CoverageType = {
  source: string;
  status: "complete" | "failed" | "not_requested";
  recordCount: number | null;
  error: string | null;
};

export type AlertType = { id: string; severity: string; message: string };

export type DashboardType = {
  summaries: ReceiptType[];
  dailySeries: { date: string; summaries: ReceiptType[] }[];
  transactions: TransactionType[];
  invoices: InvoiceType[];
  orders: OrderType[];
  orderMetrics: {
    totalOrders: number;
    fulfilledOrders: number;
    pendingOrders: number;
    matchedOrders: number;
    contributionEligibleOrders: number;
    averageFulfillmentDays: number | null;
  };
  products: ProductType[];
  contributionSummaries: ContributionType[];
  trends: {
    currency: string;
    metric: string;
    currentValue: number | null;
    previousValue: number | null;
    absoluteChange: number | null;
    percentChange: number | null;
    comparable: boolean;
  }[];
  balances: {
    currency: string;
    availableMinor: number;
    pendingMinor: number;
  }[];
  balanceAsOf: string | null;
  coverage: CoverageType[];
  limitations: string[];
  alerts: AlertType[];
};

export type FinanceInsightType = {
  title: string;
  description: string;
  evidence: string[];
};

export type FinanceReportType = {
  id: string;
  generatedAt: string;
  calculationVersion: string;
  period: { startDate: string; endDate: string; timezone: string };
  comparisonPeriod: { startDate: string; endDate: string };
  costConfiguration: {
    currency: string | null;
    costBasis: "per_unit" | "line_total" | null;
  };
  dashboard: DashboardType;
  comparison: DashboardType;
  insights: {
    overview: string;
    findings: FinanceInsightType[];
    recommendations: FinanceInsightType[];
    limitations: string[];
  } | null;
  insightsStatus: "not_requested" | "complete" | "failed";
  evidence: Record<
    string,
    { label: string; value: number | string | null; unit: string }
  >;
};

export type AlertReviewType = {
  alert_id: string;
  acknowledged: boolean;
  updated_at: string;
};

export type ReportDetailType = {
  report: FinanceReportType;
  alertReviews: AlertReviewType[];
};

export type ReportListType = {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string;
};

export type ReferenceRequestType = {
  currency: string | null;
  provider_transaction_id: string | null;
  order_reference: string | null;
};

export type InvoiceRecordType = {
  id: number;
  name: string;
  amount: number;
  payment_provider_name: string;
  created_at: string;
  updated_at: string;
} & ReferenceRequestType;

export type ScheduleRequestType = {
  name: string;
  enabled: boolean;
  cadence_days: number;
  lookback_days: number;
  include_ai: boolean;
  next_run_at: string;
};

export type ScheduleType = ScheduleRequestType & {
  id: string | number;
  lease_until: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationType = {
  id: string | number;
  report_id: string;
  alert_id: string;
  message: string;
  severity: string;
  read: boolean;
  created_at: string;
};
