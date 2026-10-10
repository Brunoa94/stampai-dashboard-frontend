<script setup lang="ts">
import { Wallet } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="grid gap-3">
      <Span variant="label" class="text-gold">Finance agent</Span>

      <Heading as="h1" variant="title">Clarity in every number.</Heading>

      <Paragraph>
        Reconcile receipts. Understand contribution. Keep your finances in view.
      </Paragraph>
    </div>

    <Chip variant="gold">
      <Wallet :size="12" aria-hidden="true" />
      Currency-aware reporting
    </Chip>
  </div>
</template>
