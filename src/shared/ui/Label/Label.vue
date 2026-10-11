<script setup lang="ts">
interface PropsI {
  for?: string;
}

const props = defineProps<PropsI>();
</script>

<template>
  <label :for="props.for" class="field-label grid content-start gap-2">
    <slot />
  </label>
</template>
