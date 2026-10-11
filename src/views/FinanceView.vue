<script setup lang="ts">
import { ref } from "vue";
import { Sparkles } from "@lucide/vue";
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

const generationExpanded = ref(false);
</script>

<template>
  <div class="space-y-8">
    <FinanceHeader>
      <template #actions>
        <Button
          id="finance-generation-options-trigger"
          variant="primary"
          class="generation-action"
          :type="generationExpanded ? 'submit' : 'button'"
          :form="generationExpanded ? 'finance-generation-form' : undefined"
          :disabled="pending || loading"
          :aria-expanded="generationExpanded"
          aria-controls="finance-generation-options"
          @click="generationExpanded = true"
        >
          <Sparkles :size="16" aria-hidden="true" />
          {{ pending ? "Generating report…" : "Generate report" }}
        </Button>
      </template>
    </FinanceHeader>

    <ApiConnectionStatus authentication-required />

    <FinanceControls
      v-model:expanded="generationExpanded"
      :pending="pending || loading"
      @generate="generateReport"
    />

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
