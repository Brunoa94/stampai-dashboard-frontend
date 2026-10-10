<script setup lang="ts">
import { Layers } from "@lucide/vue";
import Span from "@/shared/ui/Span/Span.vue";

interface PropsI {
  collapsed: boolean;
}

defineProps<PropsI>();
</script>

<template>
  <div class="mb-12 flex items-center gap-3 px-1 pt-2">
    <div
      class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold text-black"
    >
      <Layers :size="22" aria-hidden="true" />
    </div>

    <div v-if="!collapsed" class="hidden md:block">
      <Span class="text-lg font-bold tracking-tight">
        stamp
        <Span class="text-gold">ai</Span>
      </Span>

      <div>
        <Span variant="label" class="text-[8px]">Intelligence workspace</Span>
      </div>
    </div>
  </div>
</template>
