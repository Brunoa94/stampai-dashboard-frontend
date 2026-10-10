<script setup lang="ts">
interface PropsI {
  for?: string;
}

const props = defineProps<PropsI>();
</script>

<template>
  <label :for="props.for" class="grid gap-2 text-xs font-medium text-muted">
    <slot />
  </label>
</template>
