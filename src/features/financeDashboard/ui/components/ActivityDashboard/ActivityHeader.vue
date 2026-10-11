<script setup lang="ts">
import { Activity } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="grid gap-3">
      <Span variant="label" class="text-gold">Activity</Span>

      <Heading as="h1" variant="title">Everything that moved.</Heading>

      <Paragraph>
        Follow notifications and explore transactions from saved finance
        reports.
      </Paragraph>
    </div>

    <Chip variant="gold">
      <Activity :size="12" aria-hidden="true" />
      Inbox &amp; transactions
    </Chip>
  </div>
</template>
