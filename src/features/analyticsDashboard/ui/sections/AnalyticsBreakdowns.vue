<script setup lang="ts">
import { computed } from "vue";
import BreakdownTable from "@/features/analyticsDashboard/ui/components/BreakdownTable/BreakdownTable.vue";
import Chart from "@/shared/ui/Chart/Chart.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import { analyticsSeries } from "@/features/analyticsDashboard/lib/mappers/analytics";

interface PropsI {
  report: AnalyticsReportType;
  selectedStage?: string;
}

const props = defineProps<PropsI>();

const names = computed(() => Object.keys(props.report.dashboard.breakdowns));

const selectedSeries = computed(() =>
  analyticsSeries(props.report).filter(
    (series) => series.id === props.selectedStage,
  ),
);
</script>

<template>
  <div class="grid gap-6">
    <Paragraph v-if="selectedStage">
      Selected stage: {{ selectedStage }}. Daily activity and returned
      breakdowns use this same report.
    </Paragraph>

    <Chart
      v-if="selectedSeries.length"
      :title="`${selectedStage} daily activity`"
      :dates="report.dashboard.dailySeries.map((day) => day.date)"
      :series="selectedSeries"
    />

    <Paragraph>
      Shares use the event total of each complete returned breakdown. Attributes
      are not linked to outcomes and do not establish causation. Use dimension
      filters for steps, directions, products, and other returned attributes.
    </Paragraph>

    <BreakdownTable
      v-for="name in names"
      :key="`${report.gaEvent}-${name}`"
      :name="name"
      :report="report"
    />

    <Paragraph v-if="!names.length">
      No breakdowns returned for this funnel.
    </Paragraph>
  </div>
</template>
