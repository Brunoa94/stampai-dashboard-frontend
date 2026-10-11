<script setup lang="ts">
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import SourceCoverage from "@/features/financeDashboard/ui/components/SourceCoverage/SourceCoverage.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import MetricCard from "@/shared/ui/MetricCard/MetricCard.vue";
import Chart from "@/shared/ui/Chart/Chart.vue";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import { money } from "@/shared/lib/helpers/format";
import { utcLabel } from "@/shared/lib/helpers/dates";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";
import { useReceiptOverview } from "@/features/financeDashboard/lib/composables/useReceiptOverview";
import IssueActions from "@/shared/ui/IssueActions/IssueActions.vue";
import LimitationNote from "@/shared/ui/LimitationNote/LimitationNote.vue";
import { toRef } from "vue";
import { useFinanceIssues } from "@/features/financeDashboard/lib/composables/useFinanceIssues";
import { limitationIssue } from "@/features/financeDashboard/lib/mappers/financeIssues";

interface PropsI {
  report: FinanceReportType;
}

const props = defineProps<PropsI>();

const { complete, currencies, exportContexts } = useReceiptOverview(props);

const {
  limitations,
  find,
  isPending,
  errorFor,
  pendingKey,
  createIssue,
  dismiss,
} = useFinanceIssues(toRef(props, "report"));
</script>

<template>
  <div class="grid gap-6">
    <SourceCoverage :report="report" />

    <div id="finance-summaries" class="space-y-6">
      <div
        v-for="currency in currencies"
        :key="currency.summary.currency"
        class="space-y-4"
      >
        <Heading>{{ currency.summary.currency }} receipts</Heading>

        <Alert v-if="!complete" variant="info">
          Partial payment-source coverage. Totals include only returned
          classified activity; unavailable sources are not zero.
        </Alert>

        <Alert v-if="currency.summary.netReceiptsMinor === null" variant="info">
          Net receipts unavailable because included fees are missing. Known fees
          are a partial total.
        </Alert>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            v-for="(card, index) in currency.cards"
            :key="card.metric"
            :label="card.label"
            :value="card.formatted"
            :change="card.change"
            :note="card.note"
            :accent="index === 0"
          />
        </div>

        <Paragraph variant="technical">
          {{ currency.summary.unclassifiedCount }} unclassified records
          excluded. Payouts are not sales. Comparison:
          {{ report.comparisonPeriod.startDate }} —
          {{ report.comparisonPeriod.endDate }}
        </Paragraph>

        <Chart
          :title="`${currency.summary.currency} daily receipts`"
          :dates="report.dashboard.dailySeries.map((day) => day.date)"
          :series="currency.series"
          :context="exportContexts[currency.summary.currency]"
        />
      </div>

      <Paragraph v-if="!currencies.length">
        No reported receipt currency groups. Check source coverage.
      </Paragraph>
    </div>

    <Panel>
      <Heading class="mb-3">Current balance snapshots</Heading>

      <Paragraph class="mb-4">
        As of {{ utcLabel(report.dashboard.balanceAsOf) }}. These are current
        balances, not historical period balances.
      </Paragraph>

      <Paragraph
        v-if="
          report.dashboard.coverage.find((c) => c.source === 'balance')
            ?.status !== 'complete'
        "
      >
        {{ ERROR_MESSAGES.SOURCE }}
      </Paragraph>

      <EmptyState
        v-else-if="!report.dashboard.balances.length"
        title="No balance snapshots returned"
        description="Balance retrieval completed without currency balances. This does not establish a zero balance."
      />

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <MetricCard
          v-for="balance in report.dashboard.balances"
          :key="balance.currency"
          :label="`${balance.currency} available balance`"
          :value="money(balance.availableMinor, balance.currency)"
          :note="`Pending: ${money(balance.pendingMinor, balance.currency)}`"
        />
      </div>
    </Panel>

    <Panel>
      <Heading class="mb-3">Measurement limitations</Heading>

      <Paragraph v-if="!limitations.length">
        No measurement limitations were returned.
      </Paragraph>

      <LimitationNote v-for="note in limitations" :key="note" class="mb-4">
        {{ note }}

        <template #actions>
          <IssueActions
            :label="note"
            :issue="find(limitationIssue(report, note))"
            :pending="isPending(limitationIssue(report, note))"
            :disabled="!!pendingKey"
            :error="errorFor(limitationIssue(report, note))"
            @github="createIssue(limitationIssue(report, note))"
            @dismiss="dismiss(limitationIssue(report, note))"
          />
        </template>
      </LimitationNote>
    </Panel>
  </div>
</template>
