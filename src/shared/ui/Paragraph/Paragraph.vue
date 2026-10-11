<script setup lang="ts">
type VariantType = "body" | "muted" | "technical";

interface PropsI {
  variant?: VariantType;
}

withDefaults(defineProps<PropsI>(), { variant: "muted" });

const variants: Record<VariantType, string> = {
  body: "text-sm leading-relaxed text-foreground",
  muted: "text-sm leading-relaxed text-muted",
  technical: "font-mono text-xs text-muted leading-relaxed",
};
</script>

<template>
  <p :class="variants[variant]"><slot /></p>
</template>
