import type { ExportContextType } from "@/shared/lib/types/table";
import { computed, ref } from "vue";
import {
  aggregateItems,
  itemDailyRows,
} from "@/features/analyticsDashboard/lib/mappers/analytics";
import type { ProductActivityInputType } from "@/features/analyticsDashboard/lib/types/componentInputs";

export function useProductActivity(props: Readonly<ProductActivityInputType>) {
  const selected = ref("");

  const products = computed(() =>
    aggregateItems(props.report.metrics.itemActivity),
  );

  const rows = computed(() =>
    products.value.map((item) => ({
      key: item.key,
      cells: {
        id: item.itemId,
        name: item.itemName,
        selected: item.itemsSelected,
        added: item.itemsAddedToCart,
        purchased: item.itemsPurchased,
        revenue: item.itemRevenue,
      },
    })),
  );

  const daily = computed(() =>
    itemDailyRows(
      products.value.find((item) => item.key === selected.value)?.rows ?? [],
    ),
  );

  const exportContext = computed<ExportContextType>(() => ({
    scope: "Product activity",
    funnel: props.report.gaEvent,
    period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
    units: "Item quantities and item revenue; currency unknown.",
  }));

  return { selected, rows, daily, exportContext };
}
