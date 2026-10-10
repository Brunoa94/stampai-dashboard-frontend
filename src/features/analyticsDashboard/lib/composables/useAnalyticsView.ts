import { computed, ref, watch } from "vue";
import {
  useLocalPreference,
  isString,
} from "@/shared/lib/composables/useLocalPreference";
import { useAnalytics } from "@/features/analyticsDashboard/lib/composables/useAnalytics";
import { FUNNELS } from "@/features/analyticsDashboard/lib/constants/funnels";

export function useAnalyticsView() {
  const { reports, error, completedAt, pending, generate, retry } =
    useAnalytics();

  const active = useLocalPreference("analytics:funnel", "generation", isString);

  const section = ref("overview");

  const stage = ref("");

  const report = computed(
    () =>
      reports.value.find((item) => item.gaEvent === active.value) ??
      reports.value[0],
  );

  const funnelTabs = computed(() =>
    reports.value.map((item) => ({
      id: item.gaEvent,
      label: FUNNELS.find((f) => f.id === item.gaEvent)?.label ?? item.gaEvent,
    })),
  );

  watch(reports, () => {
    if (!reports.value.some((item) => item.gaEvent === active.value))
      active.value = reports.value[0]?.gaEvent ?? "generation";
  });

  function selectStage(id: string): void {
    stage.value = id;

    section.value = "breakdowns";
  }

  return {
    reports,
    error,
    completedAt,
    pending,
    generate,
    retry,
    active,
    section,
    stage,
    report,
    funnelTabs,
    selectStage,
  };
}
