<script setup lang="ts">
import ReceiptOverview from "@/features/financeDashboard/ui/sections/ReceiptOverview.vue";
import Reconciliation from "@/features/financeDashboard/ui/sections/Reconciliation.vue";
import Contribution from "@/features/financeDashboard/ui/sections/Contribution.vue";
import FinanceInsights from "@/features/financeDashboard/ui/sections/FinanceInsights.vue";
import ReportHistory from "@/features/financeDashboard/ui/sections/ReportHistory.vue";
import FinanceAlerts from "@/features/financeDashboard/ui/sections/FinanceAlerts.vue";

import type {
  FinanceReportType,
  AlertReviewType,
} from "@/features/financeDashboard/lib/types/finance";
import FinanceEmptyState from "@/features/financeDashboard/ui/components/FinanceDashboard/FinanceEmptyState.vue";

interface PropsI {
  section: string;
  report: FinanceReportType | null;
  reviews: AlertReviewType[];
  savingAlert: boolean;
  busy: boolean;
}

defineProps<PropsI>();

const emit = defineEmits<{
  open: [id: string];
  evidence: [target: string];
  acknowledge: [id: string, value: boolean];
}>();
</script>

<template>
  <ReportHistory v-if="section === 'history'" @open="emit('open', $event)" />

  <template v-else-if="report">
    <ReceiptOverview v-if="section === 'overview'" :report="report" />

    <Reconciliation v-else-if="section === 'reconciliation'" :report="report" />

    <Contribution v-else-if="section === 'contribution'" :report="report" />

    <FinanceInsights
      v-else-if="section === 'insights'"
      :report="report"
      @evidence="emit('evidence', $event)"
    />

    <FinanceAlerts
      v-else-if="section === 'alerts'"
      :report="report"
      :reviews="reviews"
      :pending="savingAlert"
      @acknowledge="(id, value) => emit('acknowledge', id, value)"
    />
  </template>

  <FinanceEmptyState v-else-if="!busy" />
</template>
