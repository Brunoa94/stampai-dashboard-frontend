<script setup lang="ts">
interface PropsI {
  variant?: "default" | "gold";
}

withDefaults(defineProps<PropsI>(), { variant: "default" });
</script>

<template>
  <section
    :class="[
      'glass-panel rounded-2xl p-5 lg:p-6',
      variant === 'gold' && 'gold-panel',
    ]"
  >
    <slot />
  </section>
</template>
