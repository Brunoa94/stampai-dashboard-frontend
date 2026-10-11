<script setup lang="ts">
import { Activity } from "@lucide/vue";
import PageHeader from "@/shared/ui/PageHeader/PageHeader.vue";
</script>

<template>
  <PageHeader
    label="Activity"
    title="Everything that moved."
    description="Follow notifications and explore transactions from saved finance reports."
    badge="Inbox &amp; transactions"
  >
    <template #icon><Activity :size="18" /></template>
  </PageHeader>
</template>
