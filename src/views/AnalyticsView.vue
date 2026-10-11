<script setup lang="ts">
import { ref } from "vue";
import { Sparkles } from "@lucide/vue";
import ApiConnectionStatus from "@/shared/ui/ApiConnectionStatus/ApiConnectionStatus.vue";
import AnalyticsReportContent from "@/features/analyticsDashboard/ui/components/AnalyticsDashboard/AnalyticsReportContent.vue";
import AnalyticsEmptyState from "@/features/analyticsDashboard/ui/components/AnalyticsDashboard/AnalyticsEmptyState.vue";
import AnalyticsHeader from "@/features/analyticsDashboard/ui/components/AnalyticsDashboard/AnalyticsHeader.vue";

import Button from "@/shared/ui/Button/Button.vue";

import Loading from "@/shared/ui/Loading/Loading.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";

import ReportControls from "@/features/analyticsDashboard/ui/components/ReportControls/ReportControls.vue";

import { useAnalyticsView } from "@/features/analyticsDashboard/lib/composables/useAnalyticsView";

const {
  reports,
  error,
  completedAt,
  pending,
  generate,
  retry,
  active,
  section,
  stage,
  report,
  funnelTabs,
  selectStage,
} = useAnalyticsView();

const generationExpanded = ref(false);
</script>

<template>
  <div class="space-y-8">
    <AnalyticsHeader>
      <template #actions>
        <Button
          id="analytics-generation-options-trigger"
          variant="primary"
          class="generation-action"
          :type="generationExpanded ? 'submit' : 'button'"
          :form="generationExpanded ? 'analytics-generation-form' : undefined"
          :disabled="pending"
          :aria-expanded="generationExpanded"
          aria-controls="analytics-generation-options"
          @click="generationExpanded = true"
        >
          <Sparkles :size="16" aria-hidden="true" />
          {{ pending ? "Generating analysis…" : "Generate analysis" }}
        </Button>
      </template>
    </AnalyticsHeader>

    <ApiConnectionStatus />

    <ReportControls
      v-model:expanded="generationExpanded"
      :pending="pending"
      @generate="generate"
    />

    <Loading v-if="pending" ai :initial="!reports.length" />

    <Alert v-if="error">
      {{ error }}
      <template #action>
        <Button class="mt-3" :disabled="pending" @click="retry">
          Retry last request
        </Button>
      </template>
    </Alert>

    <AnalyticsReportContent
      v-if="report"
      v-model:active="active"
      v-model:section="section"
      v-model:stage="stage"
      :report="report"
      :reports="reports"
      :completed-at="completedAt"
      :funnel-tabs="funnelTabs"
      @stage="selectStage"
    />

    <AnalyticsEmptyState v-else-if="!pending && !error" />
  </div>
</template>
