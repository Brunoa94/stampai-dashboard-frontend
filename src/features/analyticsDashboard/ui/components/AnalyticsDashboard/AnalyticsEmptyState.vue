<script setup lang="ts">
import { ChartNoAxesCombined } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";

import Panel from "@/shared/ui/Panel/Panel.vue";
</script>

<template>
  <Panel
    class="flex min-h-80 flex-col items-center justify-center gap-4 text-center"
  >
    <div
      class="flex size-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5 text-gold"
    >
      <ChartNoAxesCombined :size="28" aria-hidden="true" />
    </div>

    <Heading>Your next insight starts here.</Heading>

    <Paragraph class="max-w-md">
      Choose a date range and your funnels, then generate an analysis. Charts,
      stage activity, and evidence will appear from your API response.
    </Paragraph>

    <Span variant="technical">One report. Every perspective.</Span>
  </Panel>
</template>
