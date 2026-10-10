<script setup lang="ts">
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

interface PropsI {
  items: string[];
}

defineProps<PropsI>();

defineSlots<{ evidence(props: { items: string[] }): unknown }>();
</script>

<template>
  <details class="mt-3">
    <summary class="cursor-pointer text-xs text-gold">
      Supporting evidence
    </summary>

    <Paragraph v-if="!items.length" class="mt-2">
      No supporting evidence was returned.
    </Paragraph>

    <slot v-else name="evidence" :items="items">
      <Paragraph
        v-for="(evidence, index) in items"
        :key="index"
        class="mt-2"
        variant="technical"
      >
        {{ evidence }}
      </Paragraph>
    </slot>
  </details>
</template>
