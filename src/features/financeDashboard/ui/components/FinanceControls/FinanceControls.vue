<script setup lang="ts">
import { ref } from "vue";
import { Sparkles } from "@lucide/vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Checkbox from "@/shared/ui/Checkbox/Checkbox.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import type { FinanceRequestType } from "@/features/financeDashboard/lib/types/finance";

interface PropsI {
  pending: boolean;
}

defineProps<PropsI>();

const emit = defineEmits<{
  generate: [input: Omit<FinanceRequestType, "request_id">];
}>();

const start = ref("");

const end = ref("");

const ai = ref(false);
</script>

<template>
  <Panel>
    <form
      class="flex flex-wrap items-end gap-4"
      @submit.prevent="
        emit('generate', { start_date: start, end_date: end, include_ai: ai })
      "
    >
      <Label for="finance-start">
        Start date · UTC
        <Input id="finance-start" v-model="start" type="date" />
      </Label>

      <Label for="finance-end">
        End date · UTC
        <Input id="finance-end" v-model="end" type="date" />
      </Label>

      <Checkbox v-model="ai" :disabled="pending" class="pb-3">
        Include AI review
      </Checkbox>

      <Button
        type="submit"
        variant="primary"
        :disabled="pending"
        class="lg:ml-auto"
      >
        <Sparkles :size="16" aria-hidden="true" />
        {{ pending ? "Generating report…" : "Generate report" }}
      </Button>
    </form>

    <Paragraph class="mt-4" variant="technical">
      Inclusive UTC calendar dates · max 31 days · explicit retries reuse the
      same request ID.
    </Paragraph>
  </Panel>
</template>
