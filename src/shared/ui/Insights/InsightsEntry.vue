<script setup lang="ts">
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import Span from "@/shared/ui/Span/Span.vue";
import InsightsEvidence from "@/shared/ui/Insights/InsightsEvidence.vue";
import type {
  InsightEntryType,
  InsightKindType,
} from "@/shared/lib/types/insights";

interface PropsI {
  item: InsightEntryType;
  kind: InsightKindType;
}

defineProps<PropsI>();

defineSlots<{ evidence(props: { items: string[] }): unknown }>();
</script>

<template>
  <article class="mb-5 border-b border-border pb-5">
    <Chip
      v-if="kind === 'finding'"
      :variant="
        item.severity === 'critical' || item.severity === 'warning'
          ? 'danger'
          : 'neutral'
      "
    >
      {{ item.severity ?? "Finding" }}
    </Chip>

    <template v-else>
      <Chip variant="purple">{{ item.priority ?? "Recommendation" }}</Chip>

      <Span class="ml-2" variant="technical">{{ item.category }}</Span>
    </template>

    <Heading as="h3" variant="card" class="my-3">{{ item.title }}</Heading>

    <Paragraph>{{ item.description }}</Paragraph>

    <InsightsEvidence :items="item.evidence">
      <template v-if="$slots.evidence" #evidence="{ items }">
        <slot name="evidence" :items="items" />
      </template>
    </InsightsEvidence>
  </article>
</template>
