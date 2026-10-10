<script setup lang="ts">
import {
  PRODUCT_ACTIVITY_COLUMNS,
  PRODUCT_DAILY_ACTIVITY_COLUMNS,
} from "@/features/analyticsDashboard/lib/constants/tableColumns";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import { useProductActivity } from "@/features/analyticsDashboard/lib/composables/useProductActivity";

interface PropsI {
  report: AnalyticsReportType;
}

const props = defineProps<PropsI>();

const { selected, rows, daily, exportContext } = useProductActivity(props);
</script>

<template>
  <div class="grid gap-6">
    <Paragraph>
      Item quantities are separate from event counts. Item revenue overlaps
      purchase revenue and has no verified currency metadata. Unidentified rows
      remain separate.
    </Paragraph>

    <DataTable
      title="Product activity"
      empty-title="No product activity returned"
      empty-message="This report contains no item-activity rows. Missing rows do not establish zero purchases or revenue."
      :columns="PRODUCT_ACTIVITY_COLUMNS"
      :rows="rows"
      selectable
      :context="exportContext"
      @select="selected = $event"
    />

    <DataTable
      v-if="selected"
      title="Product daily activity"
      :columns="PRODUCT_DAILY_ACTIVITY_COLUMNS"
      :rows="daily"
    />
  </div>
</template>
