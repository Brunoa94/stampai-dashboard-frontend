<script setup lang="ts">
import { STAGE_ACTIVITY_COLUMNS } from "@/features/analyticsDashboard/lib/constants/tableColumns";
import { computed, ref } from "vue";
import { useMediaQuery } from "@/shared/lib/composables/useMediaQuery";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import { stageNodes } from "@/features/analyticsDashboard/lib/helpers/stages";

interface PropsI {
  report: AnalyticsReportType;
}

const props = defineProps<PropsI>();

const emit = defineEmits<{ select: [id: string] }>();

const mode = ref("graph");

const stacked = useMediaQuery("(max-width: 639px)");

const focused = ref("");

const nodes = computed(() =>
  stageNodes(props.report.dashboard.stages, stacked.value),
);

const rows = computed(() =>
  props.report.dashboard.stages.map((stage) => ({
    key: stage.id,
    cells: {
      id: stage.id,
      label: stage.label,
      count: stage.eventCount,
      unit: "events",
    },
  })),
);
</script>

<template>
  <Panel>
    <div class="mb-3 flex flex-wrap justify-between gap-3">
      <Heading>Aggregate stage activity</Heading>

      <div class="flex gap-1">
        <Button
          v-for="option in ['graph', 'bars', 'table']"
          :key="option"
          :variant="mode === option ? 'active' : 'ghost'"
          :aria-pressed="mode === option"
          @click="mode = option"
        >
          {{ option }}
        </Button>
      </div>
    </div>

    <Paragraph class="mb-5">
      Independent aggregate events, not ordered user journeys or conversion.
      Connections show configured stage order; they do not measure traffic.
    </Paragraph>

    <div class="mb-5 flex flex-wrap gap-4 border-y border-border py-3">
      <Span
        v-for="card in report.dashboard.summaryCards"
        :key="card.id"
        variant="technical"
      >
        {{ card.label }}: {{ card.value ?? "Unavailable" }} {{ card.unit }}
      </Span>

      <Span variant="technical">
        Comparison: {{ report.dashboard.comparisonPeriod.startDate }} —
        {{ report.dashboard.comparisonPeriod.endDate }}
      </Span>
    </div>

    <div v-if="mode === 'graph'" class="overflow-x-auto">
      <svg
        :viewBox="
          stacked
            ? `0 0 320 ${nodes.length * 230 + 40}`
            : `0 0 ${Math.max(500, nodes.length * 210)} 360`
        "
        class="w-full"
        role="group"
        aria-label="Aggregate stage activity graph"
      >
        <path
          v-for="(node, index) in nodes.slice(0, -1)"
          :key="node.id"
          :d="
            stacked
              ? `M ${node.x} ${node.y + node.radius} C ${node.x} ${node.y + 130}, ${node.x} ${nodes[index + 1]!.y - 130}, ${node.x} ${nodes[index + 1]!.y - nodes[index + 1]!.radius}`
              : `M ${node.x + node.radius} ${node.y} C ${node.x + 130} ${node.y}, ${nodes[index + 1]!.x - 130} ${nodes[index + 1]!.y}, ${nodes[index + 1]!.x - nodes[index + 1]!.radius} ${nodes[index + 1]!.y}`
          "
          fill="none"
          stroke="var(--color-purple)"
          stroke-opacity=".16"
          stroke-width="16"
        />

        <g
          v-for="node in nodes"
          :key="node.id"
          tabindex="0"
          role="button"
          :aria-label="`${node.label}: ${node.eventCount} events. Open daily activity.`"
          class="cursor-pointer"
          @focus="focused = node.id"
          @mouseenter="focused = node.id"
          @click="emit('select', node.id)"
          @keydown.enter.prevent="emit('select', node.id)"
          @keydown.space.prevent="emit('select', node.id)"
        >
          <title>
            {{ node.id }}: {{ node.eventCount }} events ·
            {{ report.period.startDate }} — {{ report.period.endDate }} ·
            previous
            {{
              report.dashboard.summaryCards.find((card) => card.id === node.id)
                ?.previousValue ?? "Unavailable"
            }}
          </title>

          <circle
            :cx="node.x"
            :cy="node.y"
            :r="node.radius"
            fill="var(--color-surface)"
            stroke="var(--color-purple)"
            stroke-width="7"
          />

          <text
            :x="node.x"
            :y="node.y"
            text-anchor="middle"
            fill="white"
            font-size="25"
            font-family="monospace"
          >
            {{ node.eventCount.toLocaleString() }}
          </text>

          <text
            :x="node.x"
            :y="node.y + 23"
            text-anchor="middle"
            fill="var(--color-muted)"
            font-size="11"
          >
            events
          </text>

          <text
            :x="node.x"
            :y="node.y + node.radius + 29"
            text-anchor="middle"
            fill="var(--color-purple)"
            font-size="12"
          >
            {{ node.label }}
          </text>
        </g>
      </svg>

      <Paragraph v-if="focused" role="status" class="mb-3">
        {{ focused }}:
        {{
          report.dashboard.stages.find((stage) => stage.id === focused)
            ?.eventCount
        }}
        events · {{ report.period.startDate }} — {{ report.period.endDate }} ·
        previous
        {{
          report.dashboard.summaryCards.find((card) => card.id === focused)
            ?.previousValue ?? "Unavailable"
        }}
      </Paragraph>

      <Paragraph variant="technical">
        Node radius: 48–72 SVG units, square-root scaled against the largest
        stage. Exact counts are shown.
      </Paragraph>
    </div>

    <div v-else-if="mode === 'bars'" class="grid gap-5">
      <div v-for="node in nodes" :key="node.id">
        <Button
          variant="ghost"
          class="mb-2 px-0"
          @click="emit('select', node.id)"
        >
          {{ node.label }} · {{ node.eventCount }} events
        </Button>

        <div class="h-3 rounded bg-elevated">
          <div
            class="h-full rounded bg-purple"
            :style="{ width: `${node.width}%` }"
          />
        </div>
      </div>
    </div>

    <DataTable
      v-else
      title="Stage activity table"
      :columns="STAGE_ACTIVITY_COLUMNS"
      :rows="rows"
    />
  </Panel>
</template>
