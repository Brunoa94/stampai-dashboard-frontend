<script setup lang="ts">
type VariantType = "title" | "section" | "card";

interface PropsI {
  as?: "h1" | "h2" | "h3" | "h4";
  variant?: VariantType;
}

withDefaults(defineProps<PropsI>(), { as: "h2", variant: "section" });

const variants: Record<VariantType, string> = {
  title: "display-heading text-[2rem] sm:text-[2.5rem] xl:text-5xl",
  section: "font-display text-xl lg:text-2xl font-semibold leading-snug tracking-tight",
  card: "font-display text-sm font-semibold",
};
</script>

<template>
  <component :is="as" :class="variants[variant]"><slot /></component>
</template>
