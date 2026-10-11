<script setup lang="ts">
import type { ThemePreferenceType } from "@/shared/lib/stores/theme";

interface PropsI {
  mode: ThemePreferenceType;
}

defineProps<PropsI>();
</script>

<template>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    :class="[
      'shrink-0',
      mode === 'light'
        ? 'text-gold'
        : mode === 'dark'
          ? 'text-purple'
          : 'text-muted',
    ]"
  >
    <template v-if="mode === 'dark'">
      <path
        d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z"
        fill="currentColor"
        fill-opacity="0.12"
      />

      <path d="M18 3v4m-2-2h4" />
    </template>

    <template v-else>
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="currentColor"
        :fill-opacity="mode === 'light' ? 0.12 : 0"
      />

      <path
        d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"
      />

      <path
        v-if="mode === 'system'"
        d="M12 7.5a4.5 4.5 0 0 1 0 9Z"
        fill="currentColor"
        stroke="none"
      />
    </template>
  </svg>
</template>
