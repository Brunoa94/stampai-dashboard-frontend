<script setup lang="ts">
import InsightsOverview from "@/shared/ui/Insights/InsightsOverview.vue";
import InsightsGroup from "@/shared/ui/Insights/InsightsGroup.vue";
import InsightsLimitations from "@/shared/ui/Insights/InsightsLimitations.vue";
import type { InsightEntryType } from "@/shared/lib/types/insights";

interface PropsI {
  overview: string;
  findings: InsightEntryType[];
  recommendations: InsightEntryType[];
  limitations: string[];
}

defineProps<PropsI>();

defineSlots<{ evidence(props: { items: string[] }): unknown }>();
</script>

<template>
  <div class="grid gap-6">
    <InsightsOverview :overview="overview" />

    <div class="grid gap-6 lg:grid-cols-2">
      <InsightsGroup :items="findings" kind="finding">
        <template v-if="$slots.evidence" #evidence="{ items }">
          <slot name="evidence" :items="items" />
        </template>
      </InsightsGroup>

      <InsightsGroup :items="recommendations" kind="recommendation">
        <template v-if="$slots.evidence" #evidence="{ items }">
          <slot name="evidence" :items="items" />
        </template>
      </InsightsGroup>
    </div>

    <InsightsLimitations :limitations="limitations" />
  </div>
</template>
