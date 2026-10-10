export type InsightEntryType = {
  title: string;
  description: string;
  evidence: string[];
  severity?: string;
  priority?: string;
  category?: string;
};

export type InsightKindType = "finding" | "recommendation";
