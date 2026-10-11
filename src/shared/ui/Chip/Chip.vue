<script setup lang="ts">
type VariantType = "neutral" | "gold" | "success" | "danger" | "purple";

interface PropsI {
  variant?: VariantType;
}

withDefaults(defineProps<PropsI>(), { variant: "neutral" });

const variants: Record<VariantType, string> = {
  neutral: "bg-elevated text-muted border-border",
  gold: "bg-gold/10 text-gold border-gold/20",
  success: "bg-success/10 text-success border-success/20",
  danger: "bg-danger/10 text-danger border-danger/20",
  purple: "bg-purple/10 text-purple border-purple/20",
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium',
      variants[variant],
    ]"
  >
    <slot />
  </span>
</template>
