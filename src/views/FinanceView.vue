<script setup lang="ts">
import ApiConnectionStatus from "@/shared/ui/ApiConnectionStatus/ApiConnectionStatus.vue";
import { useFinanceView } from "@/features/financeDashboard/lib/composables/useFinanceView";
import FinanceContent from "@/features/financeDashboard/ui/components/FinanceDashboard/FinanceContent.vue";

import FinanceHeader from "@/features/financeDashboard/ui/components/FinanceDashboard/FinanceHeader.vue";
import { FINANCE_SECTIONS } from "@/features/financeDashboard/lib/constants/sections";

import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

import Button from "@/shared/ui/Button/Button.vue";

import Tabs from "@/shared/ui/Tabs/Tabs.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Loading from "@/shared/ui/Loading/Loading.vue";
import FinanceControls from "@/features/financeDashboard/ui/components/FinanceControls/FinanceControls.vue";

import { utcLabel } from "@/shared/lib/helpers/dates";

const {
  report,
  reviews,
  error,
  loading,
  savingAlert,
  pending,
  retry,
  acknowledge,
  section,
  ai,
  openSaved,
  evidence,
  generateReport,
  viewTransactions,
} = useFinanceView();
</script>

<template>
  <div class="space-y-8">
    <FinanceHeader />

    <ApiConnectionStatus authentication-required />

    <FinanceControls :pending="pending || loading" @generate="generateReport" />

    <Tabs
      v-model="section"
      :items="FINANCE_SECTIONS"
      label="Finance sections"
    />

    <Loading v-if="pending || loading" :ai="pending && ai" :initial="!report" />

    <Alert v-if="error">
      {{ error }}
      <template #action>
        <Button class="mt-3" :disabled="pending || loading" @click="retry">
          Retry failed action
        </Button>
      </template>
    </Alert>

    <div
      v-if="report"
      class="flex flex-wrap items-center justify-between gap-3"
    >
      <Paragraph variant="technical">
        Snapshot {{ report.id }} · {{ report.period.startDate }} —
        {{ report.period.endDate }} UTC · {{ utcLabel(report.generatedAt) }} ·
        {{ report.calculationVersion }}
      </Paragraph>

      <Button variant="ghost" @click="viewTransactions">
        View transactions in Activity
      </Button>
    </div>

    <FinanceContent
      :section="section"
      :report="report"
      :reviews="reviews"
      :saving-alert="savingAlert"
      :busy="pending || loading || !!error"
      @open="openSaved"
      @evidence="evidence"
      @acknowledge="acknowledge"
    />
  </div>
</template>
