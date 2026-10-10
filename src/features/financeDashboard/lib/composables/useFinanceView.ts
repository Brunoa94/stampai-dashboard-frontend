import { ref, nextTick } from "vue";
import { useFinance } from "@/features/financeDashboard/lib/composables/useFinance";
import type { FinanceRequestType } from "@/features/financeDashboard/lib/types/finance";

export function useFinanceView() {
  const {
    report,
    reviews,
    error,
    loading,
    savingAlert,
    pending,
    generate,
    retry,
    open,
    acknowledge,
  } = useFinance();

  const section = ref("history");

  const ai = ref(false);

  async function openSaved(id: string): Promise<void> {
    await open(id);

    if (!error.value) section.value = "overview";
  }

  async function evidence(target: string): Promise<void> {
    section.value =
      target === "finance-contribution" ? "contribution" : "overview";

    await nextTick();

    const panel = document.getElementById(target);

    panel?.setAttribute("tabindex", "-1");

    panel?.focus();

    panel?.scrollIntoView({ block: "center" });
  }

  async function generateReport(
    input: Omit<FinanceRequestType, "request_id">,
  ): Promise<void> {
    ai.value = input.include_ai;

    await generate(input);

    if (!error.value) section.value = "overview";
  }

  return {
    report,
    reviews,
    error,
    loading,
    savingAlert,
    pending,
    retry,
    acknowledge,
    section,
    ai,
    openSaved,
    evidence,
    generateReport,
  };
}
