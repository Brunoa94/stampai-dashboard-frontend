<script setup lang="ts">
interface PropsI {
  options: { value: string; label: string }[];
}

defineProps<PropsI>();

const model = defineModel<string>({ default: "" });
</script>

<template>
  <select
    v-model="model"
    class="form-control min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
