<script setup lang="ts">
// Adapted from shadcn-vue's MIT-licensed ChartContainer (new-york-v4).
// https://github.com/unovue/shadcn-vue/tree/dev/apps/v4/registry/new-york-v4/ui/chart
import { useId } from "reka-ui";

const chartId = useId();
</script>

<template>
  <div
    data-slot="chart"
    :data-chart="chartId"
    class="shadcn-chart h-80 w-full text-xs [&_[data-vis-xy-container]]:h-full [&_[data-vis-xy-container]]:w-full"
  >
    <slot />
  </div>
</template>
