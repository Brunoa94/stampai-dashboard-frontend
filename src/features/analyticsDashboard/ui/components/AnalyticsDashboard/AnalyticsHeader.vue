<script setup lang="ts">
import { ChartNoAxesCombined } from "@lucide/vue";
import PageHeader from "@/shared/ui/PageHeader/PageHeader.vue";

defineSlots<{ actions?(): unknown }>();
</script>

<template>
  <PageHeader
    label="Analytics agent"
    title="See the bigger picture."
    description="Understand activity. Explore the evidence. Decide what comes next."
    badge="Aggregated events"
  >
    <template #icon><ChartNoAxesCombined :size="18" /></template>

    <template #actions><slot name="actions" /></template>
  </PageHeader>
</template>
