<script setup lang="ts">
type VariantType = "primary" | "secondary" | "ghost" | "active" | "danger";

interface PropsI {
  variant?: VariantType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

withDefaults(defineProps<PropsI>(), {
  variant: "secondary",
  type: "button",
  disabled: false,
});

const variants: Record<VariantType, string> = {
  primary: "bg-gold text-black border-gold font-bold shadow-gold",
  secondary: "bg-elevated text-white border-border hover:border-muted",
  ghost: "bg-transparent text-muted border-transparent hover:text-white",
  active: "bg-gold/10 text-gold border-gold/20",
  danger: "bg-danger/10 text-danger border-danger/20",
};

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
      variants[variant],
    ]"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
