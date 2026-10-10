<script setup lang="ts">
import { Sparkles } from "@lucide/vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";

interface PropsI {
  overview: string;
}

defineProps<PropsI>();
</script>

<template>
  <Panel variant="gold">
    <div class="mb-4 flex items-center gap-2 text-gold">
      <Sparkles :size="18" aria-hidden="true" />

      <Heading>AI-generated review</Heading>

      <Chip variant="gold">AI narrative</Chip>
    </div>

    <Paragraph variant="body">{{ overview }}</Paragraph>
  </Panel>
</template>
