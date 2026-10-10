import { ref } from "vue";
import { useConnectionStore } from "@/shared/lib/stores/connection";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

export function useConnectionSettings() {
  const store = useConnectionStore();

  const origin = ref(store.origin);

  const token = ref(store.token);

  const timezone = ref(store.timezone);

  const error = ref("");

  function saveConnection(): boolean {
    try {
      const url = new URL(origin.value);

      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        url.pathname !== "/"
      )
        throw new Error();

      if (timezone.value)
        new Intl.DateTimeFormat("en", { timeZone: timezone.value });

      store.origin = url.origin;

      store.token = token.value;

      store.timezone = timezone.value;

      return true;
    } catch {
      error.value = ERROR_MESSAGES.INVALID;

      return false;
    }
  }

  return { origin, token, timezone, error, saveConnection };
}
