<script setup lang="ts">
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import SourceCard from "./SourceCard.vue";
import { useSourceCoverage } from "@/features/financeDashboard/lib/composables/useSourceCoverage";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";

interface PropsI {
  report: FinanceReportType;
}

const props = defineProps<PropsI>();

const { completed, failed, configured } = useSourceCoverage(props);
</script>

<template>
  <Panel id="finance-coverage">
    <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <Heading>Source coverage</Heading>

        <Paragraph v-if="report.dashboard.coverage.length" class="mt-1">
          {{ completed }} of {{ report.dashboard.coverage.length }} returned
          sources complete · report snapshot
        </Paragraph>
      </div>

      <Chip v-if="failed" variant="danger">
        {{ failed }}
        {{ failed === 1 ? "source unavailable" : "sources unavailable" }}
      </Chip>
    </div>

    <EmptyState
      v-if="!report.dashboard.coverage.length"
      title="No source coverage returned"
      description="Source completeness is unavailable for this snapshot. Missing sources must not be treated as zero."
    />

    <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SourceCard
        v-for="source in report.dashboard.coverage"
        :key="source.source"
        :source="source"
      />
    </div>

    <div
      class="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-elevated/30 p-4"
    >
      <div>
        <Heading as="h3" variant="card">Cost configuration</Heading>

        <Paragraph v-if="!configured" class="mt-1">
          Missing configuration prevents order contribution.
        </Paragraph>
      </div>

      <div class="flex flex-wrap gap-6">
        <div>
          <Span variant="label">Currency</Span>

          <Paragraph class="mt-1">
            {{ report.costConfiguration.currency ?? "Unavailable" }}
          </Paragraph>
        </div>

        <div>
          <Span variant="label">Cost basis</Span>

          <Paragraph class="mt-1">
            {{
              report.costConfiguration.costBasis?.replaceAll("_", " ") ??
              "Unavailable"
            }}
          </Paragraph>
        </div>
      </div>

      <Chip :variant="configured ? 'success' : 'danger'">
        {{ configured ? "Configured" : "Contribution unavailable" }}
      </Chip>
    </div>
  </Panel>
</template>
