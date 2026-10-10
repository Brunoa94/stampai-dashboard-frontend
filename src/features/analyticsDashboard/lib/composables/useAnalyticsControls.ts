import { ref } from "vue";
import { completeDays } from "@/shared/lib/helpers/dates";
import { errorMessage } from "@/shared/lib/constants/errors";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import type { FunnelType } from "@/features/analyticsDashboard/lib/types/analytics";

export function useAnalyticsControls() {
  const start = ref("");

  const end = ref("");

  const selected = ref<FunnelType[]>(["generation", "ecommerce"]);

  const error = ref("");

  const connection = useConnectionStore();

  function preset(days: number): void {
    try {
      const range = completeDays(days, connection.timezone);

      start.value = range.start;

      end.value = range.end;

      error.value = "";
    } catch (caught) {
      error.value = errorMessage(caught);
    }
  }

  function toggle(id: FunnelType): void {
    selected.value = selected.value.includes(id)
      ? selected.value.filter((value) => value !== id)
      : [...selected.value, id];
  }

  return { start, end, selected, error, connection, preset, toggle };
}
