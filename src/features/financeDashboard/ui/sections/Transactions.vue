<script setup lang="ts">
import { TRANSACTION_COLUMNS } from "@/features/financeDashboard/lib/constants/tableColumns";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Select from "@/shared/ui/Select/Select.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Button from "@/shared/ui/Button/Button.vue";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import { useTransactions } from "@/features/financeDashboard/lib/composables/useTransactions";

interface PropsI {
  report: FinanceReportType;
}

const props = defineProps<PropsI>();

const { date, id, selected, filters, models, rows, detail, exportContext } =
  useTransactions(props);
</script>

<template>
  <div class="grid gap-6">
    <Panel>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Label v-for="filter in filters" :key="filter.key">
          {{ filter.key }}
          <Select
            v-model="models[filter.key as keyof typeof models].value"
            :aria-label="`Filter transactions by ${filter.key}`"
            :options="filter.options"
          />
        </Label>

        <Label for="tx-date">
          Date
          <Input id="tx-date" v-model="date" type="date" />
        </Label>

        <Label for="tx-id">
          Transaction ID
          <Input id="tx-id" v-model="id" />
        </Label>
      </div>
    </Panel>

    <DataTable
      title="Transaction explorer"
      :columns="TRANSACTION_COLUMNS"
      :rows="rows"
      selectable
      :context="exportContext"
      @select="selected = $event"
    />

    <Panel v-if="detail">
      <div class="flex justify-between">
        <Heading>Transaction details</Heading>

        <Button variant="ghost" @click="selected = ''">Close</Button>
      </div>

      <Paragraph class="mt-3">
        Original reference: {{ detail.reference ?? "Unavailable" }}
      </Paragraph>

      <Paragraph>
        Normalized payment reference:
        {{ detail.paymentReference ?? "Unavailable" }}
      </Paragraph>

      <Paragraph>
        Provider: {{ detail.provider }} · {{ detail.id }} · {{ detail.date }} ·
        {{ detail.category }}
      </Paragraph>
    </Panel>
  </div>
</template>
