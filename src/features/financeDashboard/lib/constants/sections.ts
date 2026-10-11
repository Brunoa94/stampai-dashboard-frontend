import type { NavigationItemType } from "@/shared/lib/types/navigation";

export const FINANCE_SECTIONS: NavigationItemType[] = [
  { id: "overview", label: "Overview" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "contribution", label: "Production costs" },
  { id: "insights", label: "Agent Overview" },
  { id: "alerts", label: "Alerts" },
  { id: "history", label: "Saved reports" },
];

export const ACTIVITY_SECTIONS: NavigationItemType[] = [
  { id: "inbox", label: "Inbox" },
  { id: "transactions", label: "Transactions" },
];
