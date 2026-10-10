import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useConnectionStore = defineStore("connection", () => {
  const origin = ref<string>(import.meta.env.VITE_API_ORIGIN ?? "");

  const token = ref<string>("");

  const revision = ref(0);

  watch(
    [origin, token],
    () => {
      revision.value += 1;
    },
    { flush: "sync" },
  );

  const timezone = ref<string>(import.meta.env.VITE_GA4_TIMEZONE ?? "");

  function clearSession(): void {
    revision.value += 1;

    token.value = "";
  }

  return { origin, token, timezone, revision, clearSession };
});
