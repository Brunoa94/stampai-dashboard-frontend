import type { ColumnType } from "@/shared/lib/types/table";

export const PRODUCT_CONTRIBUTION_COLUMNS: ColumnType[] = [
  { key: "productId", label: "Product ID" },
  { key: "name", label: "Name" },
  { key: "currency", label: "Currency" },
  { key: "quantity", label: "Units" },
  { key: "orderCount", label: "Orders" },
  { key: "allocatedRevenueMinor", label: "Allocated receipts (minor)" },
  { key: "allocatedRefundsMinor", label: "Allocated refunds (minor)" },
  { key: "allocatedFeesMinor", label: "Allocated fees (minor)" },
  { key: "productionCostMinor", label: "Production cost (minor)" },
  { key: "allocatedShippingMinor", label: "Allocated shipping (minor)" },
  { key: "allocatedTaxMinor", label: "Allocated tax (minor)" },
  { key: "contributionMinor", label: "Allocated contribution (minor)" },
  { key: "allocationMethod", label: "Allocation method" },
];

export const ORDER_CONTRIBUTION_COLUMNS: ColumnType[] = [
  { key: "id", label: "Order ID" },
  { key: "orderReference", label: "Reference" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "fulfilledAt", label: "Fulfilled at" },
  { key: "fulfillmentDays", label: "Fulfillment days" },
  { key: "paymentMatchStatus", label: "Payment match" },
  { key: "invoiceId", label: "Invoice" },
  { key: "currency", label: "Currency" },
  { key: "totalPriceMinor", label: "Retail price (minor)" },
  { key: "productionCostMinor", label: "Production cost (minor)" },
  { key: "shippingCostMinor", label: "Shipping cost (minor)" },
  { key: "taxCostMinor", label: "Tax cost (minor)" },
  { key: "revenueMinor", label: "Linked receipts (minor)" },
  { key: "refundsMinor", label: "Linked refunds (minor)" },
  { key: "feesMinor", label: "Fees (minor)" },
  { key: "profitMinor", label: "Order contribution (minor)" },
  { key: "marginPercent", label: "Margin %" },
  { key: "limitation", label: "Limitation" },
  { key: "flag", label: "Flag" },
];

export const INVOICE_RECONCILIATION_COLUMNS: ColumnType[] = [
  { key: "id", label: "Invoice" },
  { key: "provider", label: "Provider" },
  { key: "date", label: "Date" },
  { key: "amountMinor", label: "Amount (minor units)" },
  { key: "currency", label: "Currency" },
  { key: "paymentReference", label: "Payment reference" },
  { key: "orderReference", label: "Order reference" },
  { key: "transactionId", label: "Matched transaction" },
  { key: "matchStatus", label: "Match status" },
  { key: "reason", label: "Explanation" },
];

export const TRANSACTION_COLUMNS: ColumnType[] = [
  { key: "id", label: "ID" },
  { key: "provider", label: "Provider" },
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "currency", label: "Currency" },
  { key: "amountMinor", label: "Amount (minor units)" },
  { key: "feeMinor", label: "Fee (minor units)" },
  { key: "netMinor", label: "Net (minor units)" },
];

export const REPORT_HISTORY_COLUMNS: ColumnType[] = [
  { key: "id", label: "Report ID" },
  { key: "created_at", label: "Created at" },
  { key: "start_date", label: "Start date UTC" },
  { key: "end_date", label: "End date UTC" },
];
