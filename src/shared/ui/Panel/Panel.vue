<script setup lang="ts">
interface PropsI {
  variant?: "default" | "gold";
}

withDefaults(defineProps<PropsI>(), { variant: "default" });
</script>

<template>
  <section
    :class="[
      'dashboard-panel rounded-xl p-5 lg:p-6',
      variant === 'gold' && 'accent-panel',
    ]"
  >
    <slot />
  </section>
</template>
