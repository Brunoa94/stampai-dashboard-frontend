<script setup lang="ts">
import { CalendarDays } from "@lucide/vue";
import GenerationPanel from "@/shared/ui/GenerationPanel/GenerationPanel.vue";
import Button from "@/shared/ui/Button/Button.vue";
import FilterChip from "@/shared/ui/FilterChip/FilterChip.vue";
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

const expanded = defineModel<boolean>("expanded", { required: true });

const emit = defineEmits<{ generate: [body: AnalyticsRequestType] }>();

const { start, end, selected, error, connection, preset, toggle } =
  useAnalyticsControls();
</script>

<template>
  <GenerationPanel
    id="analytics-generation-options"
    v-model:expanded="expanded"
    title="Analysis options"
    :pending="pending"
  >
    <form
      id="analytics-generation-form"
      class="grid gap-5"
      @submit.prevent="
        emit('generate', {
          start_date: start,
          end_date: end,
          funnels: [...selected],
        })
      "
    >
      <div
        class="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[11rem_11rem_auto]"
      >
        <Label for="analytics-start">
          Start date
          <Input
            id="analytics-start"
            v-model="start"
            type="date"
            :disabled="pending"
            aria-describedby="analytics-date-help"
          />
        </Label>

        <Label for="analytics-end">
          End date
          <Input
            id="analytics-end"
            v-model="end"
            type="date"
            :disabled="pending"
            aria-describedby="analytics-date-help"
          />
        </Label>

        <div
          class="flex flex-col gap-2 sm:col-span-2 sm:flex-row xl:col-span-1"
        >
          <Button
            :disabled="pending"
            class="flex-1 xl:flex-none"
            @click="preset(7)"
          >
            <CalendarDays :size="14" aria-hidden="true" />
            Last 7 days
          </Button>

          <Button
            :disabled="pending"
            class="flex-1 xl:flex-none"
            @click="preset(30)"
          >
            Last 30 days
          </Button>
        </div>
      </div>

      <fieldset class="min-w-0 border-0 p-0" :disabled="pending">
        <legend class="field-label mb-2">Funnels to include</legend>

        <div class="grid gap-2 sm:flex sm:flex-wrap">
          <FilterChip
            v-for="funnel in FUNNELS"
            :key="funnel.id"
            :selected="selected.includes(funnel.id)"
            :disabled="pending"
            @toggle="toggle(funnel.id)"
          >
            {{ funnel.label }}
          </FilterChip>
        </div>
      </fieldset>

      <Paragraph id="analytics-date-help" class="text-xs">
        Inclusive dates ·
        {{ connection.timezone || "GA4 timezone not configured" }} · max 366
        days. Presets use complete days.
      </Paragraph>

      <Alert v-if="error">{{ error }}</Alert>
    </form>
  </GenerationPanel>
</template>
