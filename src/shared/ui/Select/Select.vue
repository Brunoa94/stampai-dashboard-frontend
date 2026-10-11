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
    class="rounded-lg border border-border bg-black/40 px-3 backdrop-blur-sm py-2.5 text-sm text-white"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
