<script setup lang="ts">
import { Check } from "@lucide/vue";
import Button from "@/shared/ui/Button/Button.vue";

interface PropsI {
  selected: boolean;
  disabled?: boolean;
}

defineProps<PropsI>();

const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <Button
    class="filter-chip"
    :aria-pressed="selected"
    :disabled="disabled"
    @click="emit('toggle')"
  >
    <div class="filter-check" aria-hidden="true">
      <Check v-if="selected" :size="12" :stroke-width="3" />
    </div>

    <slot />
  </Button>
</template>
