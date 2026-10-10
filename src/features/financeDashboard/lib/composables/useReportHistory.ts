import { computed, ref } from "vue";
import { useReportList } from "@/features/financeDashboard/lib/queries/finance";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import { canUseLocalAdminAuth } from "@/shared/lib/constants/localAuth";

export function useReportHistory() {
  const offset = ref(0);

  const connection = useConnectionStore();

  const ready = computed(
    () =>
      !!connection.origin &&
      (!!connection.token || canUseLocalAdminAuth(connection.origin)),
  );

  const { data, isFetching, error, refetch } = useReportList(offset);

  const rows = computed(() =>
    (data.value ?? []).map((row) => ({ key: row.id, cells: { ...row } })),
  );

  const canPrevious = computed(() => offset.value > 0 && !isFetching.value);

  const canNext = computed(
    () => (data.value?.length ?? 0) === 20 && !isFetching.value,
  );

  function previous(): void {
    if (canPrevious.value) offset.value = Math.max(0, offset.value - 20);
  }

  function next(): void {
    if (canNext.value) offset.value += 20;
  }

  return {
    ready,
    data,
    isFetching,
    error,
    refetch,
    rows,
    canPrevious,
    canNext,
    previous,
    next,
  };
}
