<script setup lang="ts">
import { Wallet } from "@lucide/vue";
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
      <Wallet :size="28" aria-hidden="true" />
    </div>

    <Heading>Know where you stand.</Heading>

    <Paragraph class="max-w-md">
      Generate a finance report to see your real receipts, reconciliation, and
      fulfillment data, or reopen an immutable saved snapshot.
    </Paragraph>

    <Span variant="technical">Separate currencies. Verified numbers.</Span>
  </Panel>
</template>
