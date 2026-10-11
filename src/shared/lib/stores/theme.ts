import { computed, ref, watch } from "vue";
import { defineStore } from "pinia";

export type ThemePreferenceType = "system" | "light" | "dark";

const STORAGE_KEY = "stampai.theme";

function savedPreference(): ThemePreferenceType {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }

  return "system";
}

export const useThemeStore = defineStore("theme", () => {
  const preference = ref<ThemePreferenceType>(savedPreference());

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const systemDark = ref(media.matches);

  media.addEventListener("change", (event) => {
    systemDark.value = event.matches;
  });

  const resolved = computed(() =>
    preference.value === "system"
      ? systemDark.value
        ? "dark"
        : "light"
      : preference.value,
  );

  watch(
    resolved,
    (theme) => {
      document.documentElement.dataset.theme = theme;
    },
    { immediate: true },
  );

  watch(preference, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // A blocked storage write must not prevent a theme change.
    }
  });

  return { preference, resolved };
});
