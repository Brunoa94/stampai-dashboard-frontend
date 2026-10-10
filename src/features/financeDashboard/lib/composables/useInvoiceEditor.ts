import { CLEAR_METADATA_OPTION } from "@/features/financeDashboard/lib/constants/referenceOptions";
import { ref, computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import type {
  FinanceReportType,
  InvoiceType,
} from "@/features/financeDashboard/lib/types/finance";
import { editInvoice } from "@/features/financeDashboard/lib/services/finance";
import { validateReference } from "@/features/financeDashboard/lib/helpers/validation";
import { errorMessage } from "@/shared/lib/constants/errors";

export function useInvoiceEditor(report: () => FinanceReportType) {
  const invoice = ref<InvoiceType | null>(null);

  const currency = ref("");

  const payment = ref("");

  const order = ref("");

  const error = ref("");

  const saved = ref(false);

  const verifiedPayments = computed(() =>
    report()
      .dashboard.transactions.filter(
        (row) =>
          row.provider === invoice.value?.provider && !!row.paymentReference,
      )
      .map((row) => ({
        value: row.paymentReference!,
        label: `${row.id} · ${row.currency} · ${row.paymentReference}`,
      })),
  );

  const currencies = computed(() =>
    [
      ...new Set(
        report()
          .dashboard.transactions.filter(
            (row) => row.provider === invoice.value?.provider,
          )
          .map((row) => row.currency),
      ),
    ].map((value) => ({ value, label: value })),
  );

  const orders = computed(() =>
    report().dashboard.orders.map((row) => ({
      value: row.id,
      label: `${row.id} · ${row.orderReference ?? "No reference"}`,
    })),
  );

  const mutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: {
        currency: string | null;
        provider_transaction_id: string | null;
        order_reference: string | null;
      };
    }) => editInvoice(id, body),
  });

  function open(value: InvoiceType): void {
    invoice.value = value;

    currency.value = currencies.value.some((o) => o.value === value.currency)
      ? value.currency!
      : "";

    payment.value = verifiedPayments.value.some(
      (o) => o.value === value.paymentReference,
    )
      ? value.paymentReference!
      : "";

    order.value = orders.value.some((o) => o.value === value.orderReference)
      ? value.orderReference!
      : "";

    error.value = "";

    saved.value = false;
  }

  async function save(): Promise<void> {
    if (!invoice.value || mutation.isPending.value) return;

    error.value = "";

    try {
      const body = {
        currency: currency.value || null,
        provider_transaction_id: payment.value || null,
        order_reference: order.value || null,
      };

      validateReference(invoice.value.id, body);

      await mutation.mutateAsync({ id: invoice.value.id, body });

      saved.value = true;
    } catch (caught) {
      error.value = errorMessage(caught);
    }
  }

  const currencyOptions = computed(() => [
    CLEAR_METADATA_OPTION,
    ...currencies.value,
  ]);

  const paymentOptions = computed(() => [
    CLEAR_METADATA_OPTION,
    ...verifiedPayments.value,
  ]);

  const orderOptions = computed(() => [CLEAR_METADATA_OPTION, ...orders.value]);

  return {
    invoice,
    currency,
    payment,
    order,
    error,
    saved,
    paymentOptions,
    currencyOptions,
    orderOptions,
    pending: mutation.isPending,
    open,
    save,
  };
}
