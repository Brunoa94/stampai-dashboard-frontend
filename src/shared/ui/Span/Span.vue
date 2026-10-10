<script setup lang="ts">
type VariantType = "body" | "muted" | "label" | "technical" | "value";

interface PropsI {
  variant?: VariantType;
}

withDefaults(defineProps<PropsI>(), { variant: "body" });

const variants: Record<VariantType, string> = {
  body: "text-sm",
  muted: "text-sm text-muted",
  label: "text-[10px] uppercase font-semibold tracking-[.2em] text-muted",
  technical: "text-xs font-mono text-muted",
  value: "font-mono text-3xl font-semibold tracking-tight",
};
</script>

<template>
  <span :class="variants[variant]"><slot /></span>
</template>
