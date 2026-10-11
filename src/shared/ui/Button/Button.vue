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
  primary:
    "primary-button bg-gold text-on-accent border-gold font-semibold hover:opacity-90",
  secondary: "bg-surface text-foreground border-border hover:bg-elevated",
  ghost:
    "bg-transparent text-muted border-transparent hover:bg-elevated hover:text-foreground",
  active:
    "active-button bg-elevated text-foreground border-transparent font-medium",
  danger: "bg-danger/10 text-danger border-danger/20",
};

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'control-button inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
      variants[variant],
    ]"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
