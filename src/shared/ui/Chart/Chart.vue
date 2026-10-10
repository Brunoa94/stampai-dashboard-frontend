<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import Select from "@/shared/ui/Select/Select.vue";
import Span from "@/shared/ui/Span/Span.vue";
import { CHART_COLORS } from "@/shared/lib/constants/chart";
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import type { SeriesType, ExportContextType } from "@/shared/lib/types/table";
import { numberLabel } from "@/shared/lib/helpers/format";
import { useChart } from "@/shared/lib/composables/useChart";

interface PropsI {
  title: string;
  dates: string[];
  series: SeriesType[];
  context?: ExportContextType;
}

const props = defineProps<PropsI>();

const {
  emptyState,
  showAll,
  hidden,
  mode,
  focused,
  visible,
  data,
  dateOptions,
  selectedDate,
  lines,
  rows,
  columns,
  toggle,
} = useChart(props);

const ChartPlot = defineAsyncComponent(
  () => import("@/shared/ui/Chart/ChartPlot.vue"),
);
</script>

<template>
  <Panel>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <Heading>{{ title }}</Heading>

        <Paragraph class="mt-1">
          Daily values · exact calendar dates · no previous-period series
        </Paragraph>
      </div>

      <div class="flex gap-1">
        <Button
          :variant="mode === 'chart' ? 'active' : 'ghost'"
          :aria-pressed="mode === 'chart'"
          @click="mode = 'chart'"
        >
          Chart
        </Button>

        <Button
          :variant="mode === 'table' ? 'active' : 'ghost'"
          :aria-pressed="mode === 'table'"
          @click="mode = 'table'"
        >
          Table
        </Button>
      </div>
    </div>

    <div class="mb-4 flex flex-wrap gap-2">
      <Button
        v-for="(seriesItem, seriesIndex) in series"
        :key="seriesItem.id"
        :variant="hidden.includes(seriesItem.id) ? 'ghost' : 'secondary'"
        :aria-pressed="!hidden.includes(seriesItem.id)"
        @click="toggle(seriesItem.id)"
      >
        <Span
          class="mr-2 inline-block size-2 rounded-full"
          :style="{
            backgroundColor: CHART_COLORS[seriesIndex % CHART_COLORS.length],
            opacity: hidden.includes(seriesItem.id) ? 0.3 : 1,
          }"
        />

        {{ seriesItem.label }}
      </Button>
    </div>

    <EmptyState v-if="mode === 'chart' && emptyState" v-bind="emptyState">
      <template v-if="series.length && !visible.length" #action>
        <Button @click="showAll">Show all series</Button>
      </template>
    </EmptyState>

    <div v-else-if="mode === 'chart'" class="relative">
      <div role="img" :aria-label="`${title}; use the table for exact values`">
        <ChartPlot :data="data" :lines="lines" @focus-date="focused = $event" />
      </div>

      <div
        class="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4"
      >
        <Paragraph variant="technical">
          Gaps indicate unavailable values. Zero is shown on the axis.
        </Paragraph>

        <Select
          v-model="selectedDate"
          :options="dateOptions"
          aria-label="Show exact values for a date"
        />
      </div>

      <div
        v-if="dates.length"
        class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        role="status"
        :aria-label="`Values for ${dates[focused ?? 0]}`"
      >
        <div
          v-for="line in lines"
          :key="line.id"
          class="rounded-lg border border-border bg-elevated/30 px-3 py-2.5"
        >
          <div class="flex items-center gap-2">
            <Span
              class="size-2 rounded-full"
              :style="{ backgroundColor: line.color }"
            />

            <Span variant="muted">{{ line.label }}</Span>
          </div>

          <Paragraph class="mt-1 font-mono text-white">
            {{ numberLabel(line.values[focused ?? 0]) }}
          </Paragraph>

          <Span variant="technical">{{ line.unit }}</Span>
        </div>
      </div>

      <Paragraph v-if="!visible.length">
        Select a series to display activity.
      </Paragraph>
    </div>

    <DataTable
      v-else
      :title="`${title} — daily table`"
      :columns="columns"
      :rows="rows"
      :context="context"
    />
  </Panel>
</template>
