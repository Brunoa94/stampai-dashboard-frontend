<script setup lang="ts">
interface PropsI {
  ordered?: boolean;
}

defineProps<PropsI>();
</script>

<template>
  <component :is="ordered ? 'ol' : 'ul'" class="grid gap-2"><slot /></component>
</template>
