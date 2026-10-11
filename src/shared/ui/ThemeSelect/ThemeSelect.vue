<script setup lang="ts">
import ThemeIcon from "./ThemeIcon.vue";
import { useThemeStore } from "@/shared/lib/stores/theme";

const theme = useThemeStore();
</script>

<template>
  <label
    class="h-11 inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 text-muted"
  >
    <ThemeIcon :mode="theme.preference" />

    <select
      v-model="theme.preference"
      aria-label="Color theme"
      class="h-full min-w-0 bg-transparent text-sm text-foreground"
    >
      <option value="system">System</option>

      <option value="light">Light</option>

      <option value="dark">Dark</option>
    </select>
  </label>
</template>
