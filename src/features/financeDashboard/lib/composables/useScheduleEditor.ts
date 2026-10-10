import { ref } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { saveSchedule } from "@/features/financeDashboard/lib/services/finance";
import type {
  ScheduleRequestType,
  ScheduleType,
} from "@/features/financeDashboard/lib/types/finance";
import { validateSchedule } from "@/features/financeDashboard/lib/helpers/validation";
import { errorMessage } from "@/shared/lib/constants/errors";

export function useScheduleEditor() {
  const id = ref<string | number | undefined>();

  const name = ref("");

  const enabled = ref(true);

  const cadence = ref<string | number>(1);

  const lookback = ref<string | number>(7);

  const ai = ref(false);

  const nextRun = ref("");

  const error = ref("");

  const saved = ref(false);

  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: ScheduleRequestType) => saveSchedule(body, id.value),
  });

  function edit(schedule?: ScheduleType): void {
    id.value = schedule?.id;

    name.value = schedule?.name ?? "";

    enabled.value = schedule?.enabled ?? true;

    cadence.value = schedule?.cadence_days ?? 1;

    lookback.value = schedule?.lookback_days ?? 7;

    ai.value = schedule?.include_ai ?? false;

    nextRun.value = schedule
      ? new Date(schedule.next_run_at).toISOString().slice(0, 16)
      : "";

    error.value = "";

    saved.value = false;
  }

  async function save(): Promise<void> {
    if (mutation.isPending.value) return;

    error.value = "";

    saved.value = false;

    try {
      const body = {
        name: name.value,
        enabled: enabled.value,
        cadence_days: Number(cadence.value),
        lookback_days: Number(lookback.value),
        include_ai: ai.value,
        next_run_at: nextRun.value ? `${nextRun.value}:00Z` : "",
      };

      validateSchedule(body);

      await mutation.mutateAsync(body);

      saved.value = true;

      await client.invalidateQueries({ queryKey: ["finance", "schedules"] });
    } catch (caught) {
      error.value = errorMessage(caught);
    }
  }

  return {
    id,
    name,
    enabled,
    cadence,
    lookback,
    ai,
    nextRun,
    error,
    saved,
    pending: mutation.isPending,
    edit,
    save,
  };
}
