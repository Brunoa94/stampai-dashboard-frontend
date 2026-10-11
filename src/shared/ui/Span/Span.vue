<script setup lang="ts">
type VariantType = "body" | "muted" | "label" | "technical" | "value";

interface PropsI {
  variant?: VariantType;
}

withDefaults(defineProps<PropsI>(), { variant: "body" });

const variants: Record<VariantType, string> = {
  body: "text-sm",
  muted: "text-sm text-muted",
  label: "text-xs font-medium text-muted",
  technical: "text-xs font-mono text-muted",
  value: "metric-value text-3xl font-semibold",
};
</script>

<template>
  <span :class="variants[variant]"><slot /></span>
</template>
