import type { NavigationItemType } from "@/shared/lib/types/navigation";

export const FINANCE_SECTIONS: NavigationItemType[] = [
  { id: "overview", label: "Overview" },
  { id: "reconciliation", label: "Reconciliation" },
  { id: "contribution", label: "Contribution" },
  { id: "insights", label: "AI insights" },
  { id: "alerts", label: "Alerts" },
  { id: "history", label: "Saved reports" },
  { id: "schedules", label: "Schedules" },
];

export const ACTIVITY_SECTIONS: NavigationItemType[] = [
  { id: "inbox", label: "Inbox" },
  { id: "transactions", label: "Transactions" },
];
