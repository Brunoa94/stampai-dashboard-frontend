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
    class="form-control w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
  />
</template>
