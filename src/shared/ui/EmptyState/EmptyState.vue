<script setup lang="ts">
import { Inbox } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

interface PropsI {
  title: string;
  description: string;
}

defineProps<PropsI>();
</script>

<template>
  <div
    role="status"
    class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-6 text-center"
  >
    <Inbox :size="24" class="text-muted" aria-hidden="true" />

    <Heading as="h3" variant="card">{{ title }}</Heading>

    <Paragraph class="max-w-xl">{{ description }}</Paragraph>

    <slot name="action" />
  </div>
</template>
