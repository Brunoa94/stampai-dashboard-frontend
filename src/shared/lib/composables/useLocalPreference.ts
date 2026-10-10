import { ref, watch, type Ref } from "vue";
import { logWarning } from "@/shared/lib/helpers/logger";

// Preferences contain display choices only. Reports and credentials are never stored here.
export function useLocalPreference<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): Ref<T> {
  let initial = fallback;

  try {
    const raw = localStorage.getItem(`stampai:${key}`);

    if (raw) {
      const value: unknown = JSON.parse(raw);

      if (validate(value)) initial = value;
    }
  } catch {
    logWarning("Preference read unavailable");
  }

  const state = ref(initial) as Ref<T>;

  watch(
    state,
    (value) => {
      try {
        localStorage.setItem(`stampai:${key}`, JSON.stringify(value));
      } catch {
        logWarning("Preference save unavailable");
      }
    },
    { deep: true },
  );

  return state;
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
