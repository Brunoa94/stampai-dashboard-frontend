<script setup lang="ts">
import { Sparkles, CalendarDays } from "@lucide/vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import { FUNNELS } from "@/features/analyticsDashboard/lib/constants/funnels";
import type { AnalyticsRequestType } from "@/features/analyticsDashboard/lib/types/analytics";
import { useAnalyticsControls } from "@/features/analyticsDashboard/lib/composables/useAnalyticsControls";

interface PropsI {
  pending: boolean;
}

defineProps<PropsI>();

const emit = defineEmits<{ generate: [body: AnalyticsRequestType] }>();

const { start, end, selected, error, connection, preset, toggle } =
  useAnalyticsControls();
</script>

<template>
  <Panel>
    <form
      class="grid gap-5"
      @submit.prevent="
        emit('generate', {
          start_date: start,
          end_date: end,
          funnels: [...selected],
        })
      "
    >
      <div class="flex flex-wrap items-end gap-4">
        <Label for="analytics-start">
          Start date
          <Input id="analytics-start" v-model="start" type="date" />
        </Label>

        <Label for="analytics-end">
          End date
          <Input id="analytics-end" v-model="end" type="date" />
        </Label>

        <div class="flex flex-wrap gap-2">
          <Button @click="preset(7)">
            <CalendarDays :size="14" aria-hidden="true" />
            Last 7 days
          </Button>

          <Button @click="preset(30)">Last 30 days</Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          :disabled="pending"
          class="lg:ml-auto"
        >
          <Sparkles :size="16" aria-hidden="true" />
          {{ pending ? "Generating analysis…" : "Generate analysis" }}
        </Button>
      </div>

      <div class="flex flex-wrap gap-2" aria-label="Funnels to include">
        <Button
          v-for="funnel in FUNNELS"
          :key="funnel.id"
          :variant="selected.includes(funnel.id) ? 'active' : 'ghost'"
          :aria-pressed="selected.includes(funnel.id)"
          :disabled="pending"
          @click="toggle(funnel.id)"
        >
          {{ funnel.label }}
        </Button>
      </div>

      <Paragraph variant="technical">
        Inclusive dates ·
        {{ connection.timezone || "GA4 timezone not configured" }} · max 366
        days. Presets use complete days.
      </Paragraph>

      <Alert v-if="error">{{ error }}</Alert>
    </form>
  </Panel>
</template>
