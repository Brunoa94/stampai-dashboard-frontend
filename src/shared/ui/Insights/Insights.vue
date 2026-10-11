<script setup lang="ts">
import InsightsOverview from "@/shared/ui/Insights/InsightsOverview.vue";
import InsightsGroup from "@/shared/ui/Insights/InsightsGroup.vue";
import InsightsLimitations from "@/shared/ui/Insights/InsightsLimitations.vue";
import type {
  InsightEntryType,
  InsightKindType,
} from "@/shared/lib/types/insights";

interface PropsI {
  overview: string;
  findings: InsightEntryType[];
  recommendations: InsightEntryType[];
  limitations: string[];
}

defineProps<PropsI>();

defineSlots<{
  evidence(props: { items: string[] }): unknown;
  actions?(props: { item: InsightEntryType; kind: InsightKindType }): unknown;
  limitationActions?(props: { note: string }): unknown;
}>();
</script>

<template>
  <div class="grid gap-6">
    <InsightsOverview :overview="overview" />

    <div class="grid gap-6 lg:grid-cols-2">
      <InsightsGroup :items="findings" kind="finding">
        <template v-if="$slots.evidence" #evidence="{ items }">
          <slot name="evidence" :items="items" />
        </template>

        <template v-if="$slots.actions" #actions="slotProps">
          <slot name="actions" v-bind="slotProps" />
        </template>
      </InsightsGroup>

      <InsightsGroup :items="recommendations" kind="recommendation">
        <template v-if="$slots.evidence" #evidence="{ items }">
          <slot name="evidence" :items="items" />
        </template>

        <template v-if="$slots.actions" #actions="slotProps">
          <slot name="actions" v-bind="slotProps" />
        </template>
      </InsightsGroup>
    </div>

    <InsightsLimitations :limitations="limitations">
      <template v-if="$slots.limitationActions" #actions="{ note }">
        <slot name="limitationActions" :note="note" />
      </template>
    </InsightsLimitations>
  </div>
</template>
