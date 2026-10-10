<script setup lang="ts">
interface PropsI {
  type?:
    | "text"
    | "password"
    | "date"
    | "number"
    | "url"
    | "search"
    | "datetime-local";
  disabled?: boolean;
}

withDefaults(defineProps<PropsI>(), { type: "text", disabled: false });

const model = defineModel<string | number>({ default: "" });
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :disabled="disabled"
    class="w-full min-w-0 rounded-lg border border-border bg-black px-3 py-2.5 text-sm text-white placeholder:text-muted focus:border-gold disabled:opacity-50"
  />
</template>
