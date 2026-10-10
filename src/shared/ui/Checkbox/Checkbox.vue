<script setup lang="ts">
interface PropsI {
  disabled?: boolean;
}

defineProps<PropsI>();

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <label class="inline-flex items-center gap-2 text-sm text-muted">
    <input
      v-model="model"
      type="checkbox"
      :disabled="disabled"
      class="size-4 accent-gold"
    />

    <slot />
  </label>
</template>
