<script setup lang="ts">
import { ChartNoAxesCombined } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="grid gap-3">
      <Span variant="label" class="text-gold">Analytics agent</Span>

      <Heading as="h1" variant="title">See the bigger picture.</Heading>

      <Paragraph>
        Understand activity. Explore the evidence. Decide what comes next.
      </Paragraph>
    </div>

    <Chip variant="gold">
      <ChartNoAxesCombined :size="12" aria-hidden="true" />
      Aggregated events
    </Chip>
  </div>
</template>
