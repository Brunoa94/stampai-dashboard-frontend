<script setup lang="ts">
type VariantType = "title" | "section" | "card";

interface PropsI {
  as?: "h1" | "h2" | "h3" | "h4";
  variant?: VariantType;
}

withDefaults(defineProps<PropsI>(), { as: "h2", variant: "section" });

const variants: Record<VariantType, string> = {
  title: "text-4xl lg:text-5xl font-bold tracking-tight",
  section: "text-lg font-semibold tracking-tight",
  card: "text-sm font-semibold",
};
</script>

<template>
  <component :is="as" :class="variants[variant]"><slot /></component>
</template>
