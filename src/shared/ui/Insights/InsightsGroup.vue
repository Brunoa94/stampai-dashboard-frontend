<script setup lang="ts">
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import InsightsEntry from "@/shared/ui/Insights/InsightsEntry.vue";
import type {
  InsightEntryType,
  InsightKindType,
} from "@/shared/lib/types/insights";

interface PropsI {
  items: InsightEntryType[];
  kind: InsightKindType;
}

defineProps<PropsI>();

defineSlots<{ evidence(props: { items: string[] }): unknown }>();
</script>

<template>
  <Panel>
    <Heading class="mb-5">
      {{ kind === "finding" ? "Findings" : "Recommendations" }}
    </Heading>

    <InsightsEntry
      v-for="(item, index) in items"
      :key="`${item.title}-${index}`"
      :item="item"
      :kind="kind"
    >
      <template v-if="$slots.evidence" #evidence="{ items: evidenceItems }">
        <slot name="evidence" :items="evidenceItems" />
      </template>
    </InsightsEntry>

    <Paragraph v-if="!items.length">
      {{
        kind === "finding"
          ? "No findings returned."
          : "No recommendations returned."
      }}
    </Paragraph>
  </Panel>
</template>
