<script setup lang="ts">
import { AlertTriangle } from "@lucide/vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

defineSlots<{ default(): unknown; actions?(): unknown }>();
</script>

<template>
  <div class="flex items-start gap-3">
    <AlertTriangle
      :size="16"
      class="mt-0.5 shrink-0 text-gold"
      aria-label="Warning"
      role="img"
    />

    <div class="min-w-0 flex-1">
      <Paragraph><slot /></Paragraph>

      <div v-if="$slots.actions" class="mt-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
