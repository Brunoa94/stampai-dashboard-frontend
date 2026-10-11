<script setup lang="ts">
import { toRef } from "vue";
import Insights from "@/shared/ui/Insights/Insights.vue";
import IssueActions from "@/shared/ui/IssueActions/IssueActions.vue";
import { useAnalyticsIssues } from "@/features/analyticsDashboard/lib/composables/useAnalyticsIssues";
import {
  findingIssue,
  limitationIssue,
} from "@/features/analyticsDashboard/lib/mappers/analyticsIssues";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";

interface PropsI {
  report: AnalyticsReportType;
}

const props = defineProps<PropsI>();

const {
  findings,
  reviewLimitations,
  find,
  isPending,
  errorFor,
  pendingKey,
  createIssue,
  dismiss,
} = useAnalyticsIssues(toRef(props, "report"));
</script>

<template>
  <Insights
    :overview="report.report.overview"
    :findings="findings"
    :recommendations="report.report.recommendations"
    :limitations="reviewLimitations"
  >
    <template #actions="{ item, kind }">
      <IssueActions
        v-if="kind === 'finding'"
        :label="item.title"
        :issue="find(findingIssue(report, item))"
        :pending="isPending(findingIssue(report, item))"
        :disabled="!!pendingKey"
        :error="errorFor(findingIssue(report, item))"
        @github="createIssue(findingIssue(report, item))"
        @dismiss="dismiss(findingIssue(report, item))"
      />
    </template>

    <template #limitationActions="{ note }">
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
  </Insights>
</template>
