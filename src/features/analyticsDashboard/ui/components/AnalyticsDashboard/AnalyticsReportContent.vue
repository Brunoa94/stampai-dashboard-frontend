<script setup lang="ts">
import { ANALYTICS_SECTIONS } from "@/features/analyticsDashboard/lib/constants/sections";
import { ArrowUpRight } from "@lucide/vue";

import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";

import Button from "@/shared/ui/Button/Button.vue";

import Tabs from "@/shared/ui/Tabs/Tabs.vue";

import AnalyticsOverview from "@/features/analyticsDashboard/ui/sections/AnalyticsOverview.vue";
import AnalyticsBreakdowns from "@/features/analyticsDashboard/ui/sections/AnalyticsBreakdowns.vue";
import ProductActivity from "@/features/analyticsDashboard/ui/sections/ProductActivity.vue";
import AnalyticsInsights from "@/features/analyticsDashboard/ui/sections/AnalyticsInsights.vue";
import { FUNNELS } from "@/features/analyticsDashboard/lib/constants/funnels";

import type { AnalyticsReportType } from "@/features/analyticsDashboard/lib/types/analytics";
import type { NavigationItemType } from "@/shared/lib/types/navigation";

interface PropsI {
  report: AnalyticsReportType;
  reports: AnalyticsReportType[];
  completedAt: string;
  funnelTabs: NavigationItemType[];
}

defineProps<PropsI>();

const active = defineModel<string>("active", { required: true });

const section = defineModel<string>("section", { required: true });

const stage = defineModel<string>("stage", { required: true });

const emit = defineEmits<{ stage: [id: string] }>();
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-wrap justify-between gap-2">
      <Paragraph variant="technical">
        Displaying saved response: {{ report.period.startDate }} —
        {{ report.period.endDate }} · analysis {{ report.analysisId }}
      </Paragraph>

      <Paragraph variant="technical">
        Local request completed: {{ completedAt }}
      </Paragraph>
    </div>

    <Tabs v-model="active" :items="funnelTabs" label="Returned funnels" />

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Button
        v-for="item in reports"
        :key="item.gaEvent"
        :variant="item.gaEvent === active ? 'active' : 'secondary'"
        class="justify-between"
        @click="active = item.gaEvent"
      >
        {{ FUNNELS.find((f) => f.id === item.gaEvent)?.label }} ·
        {{ item.period.startDate }} — {{ item.period.endDate }}
        <ArrowUpRight :size="14" aria-hidden="true" />
      </Button>
    </div>

    <Tabs
      v-model="section"
      :items="ANALYTICS_SECTIONS"
      label="Analytics sections"
    />

    <AnalyticsOverview
      v-if="section === 'overview'"
      :report="report"
      @stage="emit('stage', $event)"
    />

    <AnalyticsBreakdowns
      v-else-if="section === 'breakdowns'"
      :report="report"
      :selected-stage="stage"
    />

    <ProductActivity v-else-if="section === 'products'" :report="report" />

    <AnalyticsInsights v-else :report="report" />
  </div>
</template>
