<script setup lang="ts">
import { ArrowUpRight, Activity } from "@lucide/vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";

interface PropsI {
  label: string;
  value: string;
  note?: string;
  change?: string;
  tone?: "neutral" | "success" | "danger";
  accent?: boolean;
}

withDefaults(defineProps<PropsI>(), { tone: "neutral" });
</script>

<template>
  <Panel :variant="accent ? 'gold' : 'default'" class="min-w-0">
    <div class="mb-7 flex items-center justify-between">
      <Activity
        :size="20"
        :class="accent ? 'text-gold' : 'text-muted'"
        aria-hidden="true"
      />

      <Chip v-if="change" :variant="tone">
        <ArrowUpRight :size="12" aria-hidden="true" />
        {{ change }}
      </Chip>
    </div>

    <div class="grid gap-2">
      <Span variant="label">{{ label }}</Span>

      <Span variant="value" class="break-words">{{ value }}</Span>

      <Paragraph v-if="note" variant="technical">{{ note }}</Paragraph>
    </div>
  </Panel>
</template>
