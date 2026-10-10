<script setup lang="ts">
import {
  VisXYContainer,
  VisLine,
  VisAxis,
  VisScatter,
  VisCrosshair,
} from "@unovis/vue";
import { CurveType } from "@unovis/ts";
import ChartContainer from "@/shared/ui/Chart/ChartContainer.vue";
import { useChartPlot } from "@/shared/lib/composables/useChartPlot";
import type { ChartDatumType, ChartLineType } from "@/shared/lib/types/chart";

interface PropsI {
  data: ChartDatumType[];
  lines: ChartLineType[];
}

const emit = defineEmits<{ focusDate: [index: number] }>();

function focusDate(_x?: number | Date, datum?: ChartDatumType): void {
  if (datum) emit("focusDate", datum.index);
}

const props = defineProps<PropsI>();

const { x, series, tickFormat, tickValues, valueFormat } = useChartPlot(props);
</script>

<template>
  <ChartContainer>
    <VisXYContainer :data="data" :duration="0">
      <template v-for="line in series" :key="line.id">
        <VisLine
          :x="x"
          :y="line.y"
          :color="line.color"
          :curve-type="CurveType.Linear"
          :line-width="2"
        />

        <VisScatter :x="x" :y="line.y" :color="line.color" :size="6" />
      </template>

      <VisCrosshair :x="x" :on-crosshair-move="focusDate" />

      <VisAxis
        type="x"
        :tick-format="tickFormat"
        :tick-values="tickValues"
        :grid-line="false"
      />

      <VisAxis type="y" :tick-format="valueFormat" :num-ticks="5" />
    </VisXYContainer>
  </ChartContainer>
</template>
