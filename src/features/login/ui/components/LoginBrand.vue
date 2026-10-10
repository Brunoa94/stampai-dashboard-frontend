<script setup lang="ts">
import { Layers } from "@lucide/vue";

import Span from "@/shared/ui/Span/Span.vue";
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="flex size-10 items-center justify-center rounded-lg bg-gold text-black"
    >
      <Layers aria-hidden="true" />
    </div>

    <Span class="text-2xl font-bold">
      stamp
      <Span class="text-gold">ai</Span>
    </Span>
  </div>
</template>
