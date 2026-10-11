<script setup lang="ts">
import { ref } from "vue";
import GenerationPanel from "@/shared/ui/GenerationPanel/GenerationPanel.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Checkbox from "@/shared/ui/Checkbox/Checkbox.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import type { FinanceRequestType } from "@/features/financeDashboard/lib/types/finance";

interface PropsI {
  pending: boolean;
}

defineProps<PropsI>();

const expanded = defineModel<boolean>("expanded", { required: true });

const emit = defineEmits<{
  generate: [input: Omit<FinanceRequestType, "request_id">];
}>();

const start = ref("");

const end = ref("");

const ai = ref(false);
</script>

<template>
  <GenerationPanel
    id="finance-generation-options"
    v-model:expanded="expanded"
    title="Report options"
    :pending="pending"
  >
    <form
      id="finance-generation-form"
      class="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[11rem_11rem_auto]"
      @submit.prevent="
        emit('generate', { start_date: start, end_date: end, include_ai: ai })
      "
    >
      <Label for="finance-start">
        Start date · UTC
        <Input
          id="finance-start"
          v-model="start"
          type="date"
          :disabled="pending"
          aria-describedby="finance-date-help"
        />
      </Label>

      <Label for="finance-end">
        End date · UTC
        <Input
          id="finance-end"
          v-model="end"
          type="date"
          :disabled="pending"
          aria-describedby="finance-date-help"
        />
      </Label>

      <Checkbox
        v-model="ai"
        :disabled="pending"
        class="sm:col-span-2 xl:col-span-1"
      >
        Include AI review
      </Checkbox>
    </form>

    <Paragraph id="finance-date-help" class="mt-4 text-xs">
      Inclusive UTC calendar dates · maximum 31 days.
    </Paragraph>
  </GenerationPanel>
</template>
