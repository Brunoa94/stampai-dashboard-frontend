import { computed, ref, watch, type Ref } from "vue";
import {
  useReportList,
  useSavedReport,
} from "@/features/financeDashboard/lib/queries/finance";

export function useActivityTransactions(reportId: Ref<string>) {
  const {
    data: reports,
    isFetching: listing,
    error: listError,
  } = useReportList(ref(0));

  const options = computed(() => {
    const list = (reports.value ?? []).map((report) => ({
      value: report.id,
      label: `${report.start_date} — ${report.end_date} · ${report.id}`,
    }));

    // A report linked from Finance may be older than the newest page.
    return reportId.value && !list.some((item) => item.value === reportId.value)
      ? [{ value: reportId.value, label: reportId.value }, ...list]
      : list;
  });

  // Default to the newest saved report when none was requested.
  watch(
    reports,
    (list) => {
      if (!reportId.value && list?.length) reportId.value = list[0].id;
    },
    { immediate: true },
  );

  const {
    data: detail,
    isFetching: loading,
    error,
    refetch,
  } = useSavedReport(reportId);

  const report = computed(() => detail.value?.report ?? null);

  return {
    reports,
    listing,
    listError,
    options,
    report,
    loading,
    error,
    refetch,
  };
}
