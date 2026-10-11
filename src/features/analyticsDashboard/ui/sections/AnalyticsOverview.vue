<script setup lang="ts">
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Button from "@/shared/ui/Button/Button.vue";
import { exportAnalyticsSummary } from "@/features/analyticsDashboard/lib/services/exports";
import MetricCard from "@/shared/ui/MetricCard/MetricCard.vue";
import Chart from "@/shared/ui/Chart/Chart.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import StageActivity from "@/features/analyticsDashboard/ui/components/StageActivity/StageActivity.vue";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import { useAnalyticsOverview } from "@/features/analyticsDashboard/lib/composables/useAnalyticsOverview";
import IssueActions from "@/shared/ui/IssueActions/IssueActions.vue";
import LimitationNote from "@/shared/ui/LimitationNote/LimitationNote.vue";
import { toRef } from "vue";
import { useAnalyticsIssues } from "@/features/analyticsDashboard/lib/composables/useAnalyticsIssues";
import { limitationIssue } from "@/features/analyticsDashboard/lib/mappers/analyticsIssues";

interface PropsI {
  report: AnalyticsReportType;
}

const props = defineProps<PropsI>();

const emit = defineEmits<{ stage: [id: string] }>();

const { cards, series, dates, revenue, context } = useAnalyticsOverview(props);

const {
  dataQualityLimitations,
  find,
  isPending,
  errorFor,
  pendingKey,
  createIssue,
  dismiss,
} = useAnalyticsIssues(toRef(props, "report"));
</script>

<template>
  <div class="grid gap-6">
    <Alert v-if="!report.dashboard.dataQuality.hasData" variant="info">
      No reported activity. This does not establish whether tracking is working.
    </Alert>

    <div>
      <Button @click="exportAnalyticsSummary(report)">
        Export summary CSV
      </Button>
    </div>

    <EmptyState
      v-if="!cards.length"
      title="No summary metrics returned"
      description="This response contains no summary cards. Missing metrics are unavailable, not zero."
    />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        v-for="(card, index) in cards"
        :key="card.id"
        v-bind="card"
        :accent="index === 0"
      />
    </div>

    <Paragraph variant="technical">
      Comparison: {{ context.comparison }} · measurement:
      {{ report.dashboard.dataQuality.measurement }} · currency:
      {{ report.dashboard.dataQuality.currency ?? "Unknown" }}
    </Paragraph>

    <Chart
      title="Daily activity"
      :dates="dates"
      :series="series"
      :context="context"
    />

    <Chart
      v-if="report.gaEvent === 'ecommerce'"
      title="Purchase revenue"
      :dates="dates"
      :series="revenue"
      :context="context"
    />

    <StageActivity
      v-if="report.dashboard.stages.length"
      :report="report"
      @select="emit('stage', $event)"
    />

    <LimitationNote v-for="note in dataQualityLimitations" :key="note">
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
  </div>
</template>
