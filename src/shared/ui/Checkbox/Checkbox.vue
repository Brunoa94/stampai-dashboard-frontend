<script setup lang="ts">
interface PropsI {
  disabled?: boolean;
}

defineProps<PropsI>();

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <label
    class="min-h-11 inline-flex items-center gap-2 text-sm text-foreground"
  >
    <input
      v-model="model"
      type="checkbox"
      :disabled="disabled"
      class="size-4 shrink-0 accent-gold disabled:cursor-not-allowed"
    />

    <slot />
  </label>
</template>
