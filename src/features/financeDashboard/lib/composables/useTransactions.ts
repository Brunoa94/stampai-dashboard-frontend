import type { ExportContextType } from "@/shared/lib/types/table";
import { computed, ref } from "vue";
import { transactionKey } from "@/features/financeDashboard/lib/helpers/finance";
import type { TransactionsInputType } from "@/features/financeDashboard/lib/types/componentInputs";

export function useTransactions(props: Readonly<TransactionsInputType>) {
  const provider = ref("");

  const currency = ref("");

  const category = ref("");

  const status = ref("");

  const date = ref("");

  const id = ref("");

  const selected = ref("");

  const filters = computed(() =>
    ["provider", "currency", "category", "status"].map((key) => ({
      key,
      options: [
        { value: "", label: `All ${key}s` },
        ...Array.from(
          new Set(
            props.report.dashboard.transactions.map(
              (row) =>
                row[key as "provider" | "currency" | "category" | "status"],
            ),
          ),
        ).map((value) => ({ value, label: value })),
      ],
    })),
  );

  const models = { provider, currency, category, status };

  const rows = computed(() =>
    props.report.dashboard.transactions
      .filter(
        (row) =>
          (!provider.value || row.provider === provider.value) &&
          (!currency.value || row.currency === currency.value) &&
          (!category.value || row.category === category.value) &&
          (!status.value || row.status === status.value) &&
          (!date.value || row.date.slice(0, 10) === date.value) &&
          (!id.value || row.id.includes(id.value)),
      )
      .map((row) => ({ key: transactionKey(row), cells: { ...row } })),
  );

  const detail = computed(() =>
    props.report.dashboard.transactions.find(
      (row) => transactionKey(row) === selected.value,
    ),
  );

  const exportContext = computed<ExportContextType>(() => ({
    scope: "Filtered transactions",
    period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
    units: "All monetary columns contain integer ISO currency minor units.",
  }));

  return {
    provider,
    category,
    date,
    id,
    selected,
    filters,
    models,
    rows,
    detail,
    exportContext,
  };
}
