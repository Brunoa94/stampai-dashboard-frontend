import type { ColumnType } from "@/shared/lib/types/table";

export const STAGE_ACTIVITY_COLUMNS: ColumnType[] = [
  { key: "id", label: "Event" },
  { key: "label", label: "Stage" },
  { key: "count", label: "Count" },
  { key: "unit", label: "Unit" },
];

export const PRODUCT_DAILY_ACTIVITY_COLUMNS: ColumnType[] = [
  { key: "date", label: "Date" },
  { key: "itemsSelected", label: "Units selected" },
  { key: "itemsAddedToCart", label: "Units added" },
  { key: "itemsPurchased", label: "Units purchased" },
  { key: "itemRevenue", label: "Item revenue (currency unknown)" },
];

export const PRODUCT_ACTIVITY_COLUMNS: ColumnType[] = [
  { key: "id", label: "Item ID" },
  { key: "name", label: "Name" },
  { key: "selected", label: "Units selected" },
  { key: "added", label: "Units added to cart" },
  { key: "purchased", label: "Units purchased" },
  { key: "revenue", label: "Item revenue (currency unknown)" },
];
