<script setup lang="ts">
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import Select from "@/shared/ui/Select/Select.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import { useBreakdownTable } from "@/features/analyticsDashboard/lib/composables/useBreakdownTable";

interface PropsI {
  report: AnalyticsReportType;
  name: string;
}

const props = defineProps<PropsI>();

const { filters, dimensions, options, columns, rows, exportContext } =
  useBreakdownTable(props);
</script>

<template>
  <div class="grid gap-3">
    <Panel v-if="dimensions.length">
      <div class="flex flex-wrap gap-3">
        <Label v-for="dimension in dimensions" :key="dimension">
          {{ dimension }}
          <Select
            v-model="filters[dimension]"
            :aria-label="`Filter ${name} by ${dimension}`"
            :options="options[dimension] ?? []"
          />
        </Label>
      </div>
    </Panel>

    <DataTable
      :title="name.replaceAll('_', ' ')"
      :columns="columns"
      :rows="rows"
      :context="exportContext"
    />
  </div>
</template>
