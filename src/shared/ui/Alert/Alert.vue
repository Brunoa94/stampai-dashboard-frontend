<script setup lang="ts">
import { AlertTriangle, Info } from "@lucide/vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

interface PropsI {
  title?: string;
  variant?: "error" | "info";
}

withDefaults(defineProps<PropsI>(), { variant: "error" });
</script>

<template>
  <div
    :role="variant === 'error' ? 'alert' : 'status'"
    :class="[
      'flex items-start gap-3 rounded-xl border p-4',
      variant === 'error'
        ? 'border-danger/50 bg-danger/10 text-danger'
        : 'border-gold/20 bg-gold/5 text-gold',
    ]"
  >
    <component
      :is="variant === 'error' ? AlertTriangle : Info"
      :size="17"
      class="mt-0.5 shrink-0"
      aria-hidden="true"
    />

    <div class="min-w-0">
      <Heading
        v-if="title || variant === 'error'"
        as="h3"
        variant="card"
        class="mb-2"
      >
        {{ title ?? ERROR_MESSAGES.REQUEST_FAILED }}
      </Heading>

      <Paragraph variant="body"><slot /></Paragraph>

      <slot name="action" />
    </div>
  </div>
</template>
