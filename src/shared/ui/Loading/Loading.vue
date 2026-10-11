<script setup lang="ts">
import { Sparkles, LoaderCircle } from "@lucide/vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

type LayoutType = "report" | "table" | "list";

interface PropsI {
  ai?: boolean;
  initial?: boolean;
  layout?: LayoutType;
}

withDefaults(defineProps<PropsI>(), {
  ai: false,
  initial: false,
  layout: "report",
});
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="dashboard-panel rounded-xl p-5 space-y-5"
  >
    <div class="flex items-center gap-3 text-gold">
      <LoaderCircle
        v-if="!ai"
        class="animate-spin shrink-0"
        :size="22"
        aria-hidden="true"
      />

      <Sparkles v-if="ai" class="ai-pulse" :size="20" aria-hidden="true" />

      <Paragraph variant="body">
        {{
          ai
            ? "Generating AI analysis… Existing results remain available."
            : "Loading data…"
        }}
      </Paragraph>
    </div>

    <template v-if="initial">
      <template v-if="layout === 'report'">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="i in 4"
            :key="i"
            aria-hidden="true"
            class="skeleton h-36 rounded-xl"
          />
        </div>

        <div aria-hidden="true" class="skeleton h-72 rounded-xl" />
      </template>

      <div
        v-else-if="layout === 'table'"
        aria-hidden="true"
        class="dashboard-panel overflow-hidden rounded-xl"
      >
        <div class="skeleton h-16" />

        <div v-for="i in 5" :key="i" class="skeleton m-4 h-9 rounded" />
      </div>

      <div v-else aria-hidden="true" class="grid gap-4">
        <div v-for="i in 3" :key="i" class="skeleton h-28 rounded-xl" />
      </div>
    </template>
  </div>
</template>
