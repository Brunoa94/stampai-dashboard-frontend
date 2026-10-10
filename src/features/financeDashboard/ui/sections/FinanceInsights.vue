<script setup lang="ts">
import Insights from "@/shared/ui/Insights/Insights.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Button from "@/shared/ui/Button/Button.vue";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import { evidenceTarget } from "@/features/financeDashboard/lib/helpers/finance";
import { ERROR_MESSAGES } from "@/shared/lib/constants/errors";

interface PropsI {
  report: FinanceReportType;
}

defineProps<PropsI>();

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
      :findings="report.insights.findings"
      :recommendations="report.insights.recommendations"
      :limitations="[
        ...report.dashboard.limitations,
        ...report.insights.limitations,
      ]"
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
    </Insights>
  </div>
</template>
