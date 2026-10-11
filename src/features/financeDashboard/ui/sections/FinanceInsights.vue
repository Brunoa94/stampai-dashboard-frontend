<script setup lang="ts">
import { toRef } from "vue";
import Insights from "@/shared/ui/Insights/Insights.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Button from "@/shared/ui/Button/Button.vue";
import IssueActions from "@/shared/ui/IssueActions/IssueActions.vue";
import { useFinanceIssues } from "@/features/financeDashboard/lib/composables/useFinanceIssues";
import {
  findingIssue,
  limitationIssue,
} from "@/features/financeDashboard/lib/mappers/financeIssues";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import { evidenceTarget } from "@/features/financeDashboard/lib/helpers/finance";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

interface PropsI {
  report: FinanceReportType;
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
} = useFinanceIssues(toRef(props, "report"));

const emit = defineEmits<{ evidence: [target: string] }>();
</script>

<template>
  <div>
    <Paragraph v-if="report.insightsStatus === 'not_requested'">
      AI review was not requested. Generate a new report with AI enabled to
      include a narrative.
    </Paragraph>

    <Alert v-else-if="report.insightsStatus === 'failed'">
      {{ ERROR_MESSAGES.AI }}
    </Alert>

    <Insights
      v-else-if="report.insights"
      :overview="report.insights.overview"
      :findings="findings"
      :recommendations="report.insights.recommendations"
      :limitations="reviewLimitations"
    >
      <template #evidence="{ items }">
        <div v-for="id in items" :key="id" class="mt-2">
          <Button
            v-if="report.evidence[id] && evidenceTarget(id)"
            variant="ghost"
            class="justify-start px-0"
            @click="emit('evidence', evidenceTarget(id)!)"
          >
            {{ report.evidence[id].label }}:
            {{ report.evidence[id].value ?? "Unavailable" }}
            {{ report.evidence[id].unit }}
          </Button>

          <Paragraph v-else-if="report.evidence[id]">
            {{ report.evidence[id].label }}:
            {{ report.evidence[id].value ?? "Unavailable" }}
            {{ report.evidence[id].unit }}
          </Paragraph>

          <Paragraph v-else>{{ ERROR_MESSAGES.AI }}</Paragraph>
        </div>
      </template>

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
  </div>
</template>
