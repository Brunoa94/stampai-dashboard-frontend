import { ref, onScopeDispose } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { generateAnalytics } from "@/features/analyticsDashboard/lib/services/analytics";
import { validateDates } from "@/shared/lib/helpers/dates";
import { AppError, errorMessage } from "@/shared/lib/constants/errors";
import { logError } from "@/shared/lib/helpers/logger";
import type {
  AnalyticsRequestType,
  AnalyticsReportType,
} from "@/features/analyticsDashboard/lib/types/analytics";

export function useAnalytics() {
  const reports = ref<AnalyticsReportType[]>([]);

  const error = ref("");

  const lastRequest = ref<AnalyticsRequestType | null>(null);

  const completedAt = ref("");

  const controller = new AbortController();

  let disposed = false;

  const mutation = useMutation({
    mutationFn: (body: AnalyticsRequestType) =>
      generateAnalytics(body, controller.signal),
  });

  onScopeDispose(() => {
    disposed = true;

    controller.abort();
  });

  async function generate(body: AnalyticsRequestType): Promise<void> {
    if (mutation.isPending.value) return;

    error.value = "";

    try {
      validateDates(body.start_date, body.end_date, 366);

      if (
        !body.funnels.length ||
        new Set(body.funnels).size !== body.funnels.length
      )
        throw new AppError("FUNNELS");

      lastRequest.value = { ...body, funnels: [...body.funnels] };

      const result = await mutation.mutateAsync(body);

      if (!disposed) {
        reports.value = result;

        completedAt.value = new Date().toISOString();
      }
    } catch (caught) {
      if (!disposed) {
        error.value = errorMessage(caught);

        logError("analytics generation", caught);
      }
    }
  }

  function retry(): Promise<void> {
    return lastRequest.value ? generate(lastRequest.value) : Promise.resolve();
  }

  return {
    reports,
    error,
    completedAt,
    pending: mutation.isPending,
    generate,
    retry,
  };
}
