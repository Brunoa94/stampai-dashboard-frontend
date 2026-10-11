<script setup lang="ts">
import { Wallet } from "@lucide/vue";
import PageHeader from "@/shared/ui/PageHeader/PageHeader.vue";

defineSlots<{ actions?(): unknown }>();
</script>

<template>
  <PageHeader
    label="Finance agent"
    title="Clarity in every number."
    description="Reconcile receipts. Understand contribution. Keep your finances in view."
    badge="Currency-aware reporting"
  >
    <template #icon><Wallet :size="18" /></template>

    <template #actions><slot name="actions" /></template>
  </PageHeader>
</template>
