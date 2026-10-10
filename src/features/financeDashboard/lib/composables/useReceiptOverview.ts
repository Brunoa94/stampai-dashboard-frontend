import type { ExportContextType } from "@/shared/lib/types/table";
import { computed } from "vue";
import { receiptOverview } from "@/features/financeDashboard/lib/mappers/finance";
import { receiptsComplete } from "@/features/financeDashboard/lib/helpers/finance";
import type { ReceiptOverviewInputType } from "@/features/financeDashboard/lib/types/componentInputs";

export function useReceiptOverview(props: Readonly<ReceiptOverviewInputType>) {
  const complete = computed(() => receiptsComplete(props.report));

  const currencies = computed(() => receiptOverview(props.report));

  const exportContexts = computed<Record<string, ExportContextType>>(() =>
    Object.fromEntries(
      currencies.value.map((currency) => [
        currency.summary.currency,
        {
          scope: "Daily receipts",
          period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
          comparison: `${props.report.comparisonPeriod.startDate} — ${props.report.comparisonPeriod.endDate}`,
          units: `${currency.summary.currency} major units`,
        },
      ]),
    ),
  );

  return { complete, currencies, exportContexts };
}
