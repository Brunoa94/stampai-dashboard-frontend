import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ACTIVITY_SECTIONS } from "@/features/financeDashboard/lib/constants/sections";

export function useActivityView() {
  const route = useRoute();

  const router = useRouter();

  const requested = String(route.query.section ?? "");

  const section = ref(
    ACTIVITY_SECTIONS.some((item) => item.id === requested)
      ? requested
      : "inbox",
  );

  const reportId = ref(String(route.query.report ?? ""));

  watch([section, reportId], () => {
    void router.replace({
      query: {
        section: section.value,
        ...(reportId.value ? { report: reportId.value } : {}),
      },
    });
  });

  function openReport(id: string): void {
    void router.push({ path: "/finance", query: { report: id } });
  }

  return { section, reportId, openReport };
}
