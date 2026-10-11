<script setup lang="ts">
import ApiConnectionStatus from "@/shared/ui/ApiConnectionStatus/ApiConnectionStatus.vue";
import Tabs from "@/shared/ui/Tabs/Tabs.vue";
import ActivityHeader from "@/features/financeDashboard/ui/components/ActivityDashboard/ActivityHeader.vue";
import Notifications from "@/features/financeDashboard/ui/sections/Notifications.vue";
import ActivityTransactions from "@/features/financeDashboard/ui/sections/ActivityTransactions.vue";
import { ACTIVITY_SECTIONS } from "@/features/financeDashboard/lib/constants/sections";
import { useActivityView } from "@/features/financeDashboard/lib/composables/useActivityView";

const { section, reportId, openReport } = useActivityView();
</script>

<template>
  <div class="space-y-8">
    <ActivityHeader />

    <ApiConnectionStatus authentication-required />

    <Tabs
      v-model="section"
      :items="ACTIVITY_SECTIONS"
      label="Activity sections"
    />

    <Notifications v-if="section === 'inbox'" @open="openReport" />

    <ActivityTransactions v-else v-model:report-id="reportId" />
  </div>
</template>
