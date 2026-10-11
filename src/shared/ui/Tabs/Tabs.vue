<script setup lang="ts">
import Button from "@/shared/ui/Button/Button.vue";

interface PropsI {
  items: { id: string; label: string }[];
  label: string;
}

defineProps<PropsI>();

const model = defineModel<string>({ required: true });
</script>

<template>
  <nav
    :aria-label="label"
    class="section-tabs flex gap-6 overflow-x-auto border-b border-border"
  >
    <Button
      v-for="item in items"
      :key="item.id"
      :variant="model === item.id ? 'active' : 'ghost'"
      :aria-current="model === item.id ? 'page' : undefined"
      class="shrink-0"
      @click="model = item.id"
    >
      {{ item.label }}
    </Button>
  </nav>
</template>
