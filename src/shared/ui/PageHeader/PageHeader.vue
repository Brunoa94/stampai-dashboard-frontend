<script setup lang="ts">
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";

interface PropsI {
  label: string;
  title: string;
  description: string;
  badge: string;
}

defineProps<PropsI>();

defineSlots<{ icon(): unknown; actions?(): unknown }>();
</script>

<template>
  <div class="page-header flex flex-wrap items-start justify-between gap-5">
    <div class="grid min-w-0 max-w-3xl gap-3">
      <div class="flex items-center gap-2.5">
        <div class="page-header-icon" aria-hidden="true">
          <slot name="icon" />
        </div>

        <Span class="page-header-label">{{ label }}</Span>
      </div>

      <Heading as="h1" variant="title">{{ title }}</Heading>

      <Paragraph class="max-w-2xl text-base leading-relaxed">
        {{ description }}
      </Paragraph>
    </div>

    <div class="ml-auto flex flex-col items-end gap-4">
      <Span class="page-header-badge">{{ badge }}</Span>

      <div v-if="$slots.actions" class="flex flex-wrap justify-end gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
