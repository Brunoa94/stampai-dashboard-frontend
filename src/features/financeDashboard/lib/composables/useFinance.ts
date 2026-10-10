import { ref, onScopeDispose } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  generateFinance,
  getReport,
  acknowledgeAlert,
} from "@/features/financeDashboard/lib/services/finance";
import { validateDates } from "@/shared/lib/helpers/dates";
import { errorMessage } from "@/shared/lib/constants/errors";
import { logError } from "@/shared/lib/helpers/logger";
import type {
  FinanceRequestType,
  FinanceReportType,
  AlertReviewType,
} from "@/features/financeDashboard/lib/types/finance";

export function useFinance() {
  const report = ref<FinanceReportType | null>(null);

  const reviews = ref<AlertReviewType[]>([]);

  const error = ref("");

  const loading = ref(false);

  const savingAlert = ref(false);

  const lastRequest = ref<FinanceRequestType | null>(null);

  const operation = ref<"generate" | "open" | "acknowledge">("generate");

  let lastOpen = "";

  let lastAlert = { id: "", value: false };

  const controller = new AbortController();

  let disposed = false;

  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: FinanceRequestType) =>
      generateFinance(body, controller.signal),
  });

  onScopeDispose(() => {
    disposed = true;

    controller.abort();
  });

  async function generate(
    input: Omit<FinanceRequestType, "request_id">,
    retry = false,
  ): Promise<void> {
    if (mutation.isPending.value || loading.value) return;

    error.value = "";

    operation.value = "generate";

    try {
      validateDates(input.start_date, input.end_date, 31);

      const body =
        retry && lastRequest.value
          ? lastRequest.value
          : { ...input, request_id: `finance_${crypto.randomUUID()}` };

      lastRequest.value = body;

      const result = await mutation.mutateAsync(body);

      if (!disposed) {
        report.value = result;

        reviews.value = [];

        await client.invalidateQueries({ queryKey: ["finance", "reports"] });

        await client.invalidateQueries({
          queryKey: ["finance", "notifications"],
        });
      }
    } catch (caught) {
      if (!disposed) {
        error.value = errorMessage(caught);

        logError("finance generation", caught);
      }
    }
  }

  async function open(id: string): Promise<void> {
    if (loading.value || mutation.isPending.value) return;

    operation.value = "open";

    lastOpen = id;

    loading.value = true;

    error.value = "";

    try {
      const detail = await getReport(id, controller.signal);

      if (!disposed) {
        report.value = detail.report;

        reviews.value = detail.alertReviews;
      }
    } catch (caught) {
      if (!disposed) error.value = errorMessage(caught);
    } finally {
      loading.value = false;
    }
  }

  async function acknowledge(id: string, value: boolean): Promise<void> {
    if (!report.value || savingAlert.value) return;

    operation.value = "acknowledge";

    lastAlert = { id, value };

    savingAlert.value = true;

    error.value = "";

    try {
      const result = await acknowledgeAlert(report.value.id, id, value);

      reviews.value = [
        ...reviews.value.filter((r) => r.alert_id !== id),
        {
          alert_id: id,
          acknowledged: result.acknowledged,
          updated_at: new Date().toISOString(),
        },
      ];
    } catch (caught) {
      error.value = errorMessage(caught);
    } finally {
      savingAlert.value = false;
    }
  }

  function retry(): Promise<void> {
    if (operation.value === "open") return open(lastOpen);

    if (operation.value === "acknowledge")
      return acknowledge(lastAlert.id, lastAlert.value);

    return lastRequest.value
      ? generate(lastRequest.value, true)
      : Promise.resolve();
  }

  return {
    report,
    reviews,
    error,
    loading,
    savingAlert,
    pending: mutation.isPending,
    generate,
    retry,
    open,
    acknowledge,
  };
}
