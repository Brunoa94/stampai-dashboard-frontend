import { numberLabel, majorMoney } from "@/shared/lib/helpers/format";
import type {
  AnalyticsReportType,
  AggregatedItemType,
  ItemType,
} from "@/features/analyticsDashboard/lib/types/analytics";
import type { SeriesType, TableRowType } from "@/shared/lib/types/table";
import { calendarLabel } from "@/shared/lib/helpers/dates";

export function analyticsSeries(report: AnalyticsReportType): SeriesType[] {
  const names = [
    ...new Set(
      report.dashboard.dailySeries.flatMap((day) =>
        Object.keys(day.eventCounts),
      ),
    ),
  ];

  return names.map((id) => ({
    id,
    label: id.replaceAll("_", " "),
    unit: "events",
    values: report.dashboard.dailySeries.map((day) => day.eventCounts[id] ?? 0),
  }));
}

export function aggregateItems(items: ItemType[]): AggregatedItemType[] {
  const groups = new Map<string, AggregatedItemType>();

  items.forEach((item, index) => {
    const key =
      item.itemId && item.itemName
        ? JSON.stringify([item.itemId, item.itemName])
        : `unidentified-${index}`;

    const group = groups.get(key) ?? {
      key,
      itemId: item.itemId,
      itemName: item.itemName,
      itemsSelected: 0,
      itemsAddedToCart: 0,
      itemsPurchased: 0,
      itemRevenue: 0,
      rows: [],
    };

    group.itemsSelected += item.itemsSelected;

    group.itemsAddedToCart += item.itemsAddedToCart;

    group.itemsPurchased += item.itemsPurchased;

    group.itemRevenue += item.itemRevenue;

    group.rows.push(item);

    groups.set(key, group);
  });

  return [...groups.values()];
}

export function itemDailyRows(items: ItemType[]): TableRowType[] {
  return items.map((item, index) => ({
    key: `${item.date}-${index}`,
    cells: { ...item, date: calendarLabel(item.date) },
  }));
}

export function breakdownRows(
  report: AnalyticsReportType,
  name: string,
): TableRowType[] {
  const records = report.dashboard.breakdowns[name] ?? [];

  const total = records.reduce((sum, row) => sum + row.eventCount, 0);

  return records.map((row, index) => ({
    key: `${name}-${index}`,
    cells: {
      ...Object.fromEntries(
        Object.entries(row.dimensions).map(([key, value]) => [
          key,
          value || "Unknown",
        ]),
      ),
      eventCount: row.eventCount,
      share: total ? `${((row.eventCount / total) * 100).toFixed(1)}%` : null,
      purchaseRevenue: row.purchaseRevenue,
    },
  }));
}

export function analyticsCards(report: AnalyticsReportType) {
  return report.dashboard.summaryCards.map((card) => ({
    id: card.id,
    label: card.label,
    value:
      card.unit === "money"
        ? majorMoney(card.value, report.dashboard.dataQuality.currency)
        : numberLabel(card.value),
    change: !report.dashboard.dataQuality.hasComparisonData
      ? "No comparison data"
      : card.percentChange === null
        ? "No percentage baseline"
        : `${card.percentChange > 0 ? "+" : ""}${card.percentChange.toFixed(1)}%`,
    note: `Previous: ${card.unit === "money" ? majorMoney(card.previousValue, report.dashboard.dataQuality.currency) : numberLabel(card.previousValue)} ${card.unit} · change: ${card.unit === "money" ? majorMoney(card.absoluteChange, report.dashboard.dataQuality.currency) : numberLabel(card.absoluteChange)} ${card.unit}`,
    tone: !report.dashboard.dataQuality.hasComparisonData
      ? ("neutral" as const)
      : /fail|error/i.test(card.id) && card.percentChange !== null
        ? card.percentChange > 0
          ? ("danger" as const)
          : card.percentChange < 0
            ? ("success" as const)
            : ("neutral" as const)
        : ("neutral" as const),
  }));
}
