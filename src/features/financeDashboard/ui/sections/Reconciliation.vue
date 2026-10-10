<script setup lang="ts">
import type { ExportContextType } from "@/shared/lib/types/table";
import { INVOICE_RECONCILIATION_COLUMNS } from "@/features/financeDashboard/lib/constants/tableColumns";
import { computed } from "vue";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Select from "@/shared/ui/Select/Select.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import { useInvoiceEditor } from "@/features/financeDashboard/lib/composables/useInvoiceEditor";

interface PropsI {
  report: FinanceReportType;
}

const props = defineProps<PropsI>();

const {
  invoice,
  currency,
  payment,
  order,
  error,
  saved,
  paymentOptions,
  currencyOptions,
  orderOptions,
  pending,
  open,
  save,
} = useInvoiceEditor(() => props.report);

const rows = computed(() =>
  props.report.dashboard.invoices.map((row) => ({
    key: String(row.id),
    cells: { ...row },
  })),
);

function select(id: string): void {
  const value = props.report.dashboard.invoices.find(
    (row) => String(row.id) === id,
  );

  if (value) open(value);
}

const exportContext = computed<ExportContextType>(() => ({
  scope: "Invoices",
  period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
  units: "Amounts are integer ISO currency minor units.",
}));
</script>

<template>
  <div class="grid gap-6">
    <Paragraph>
      Matching uses exact provider, payment reference, currency, and amount.
      Invoice amounts are not added to processor sales.
    </Paragraph>

    <DataTable
      title="Invoice reconciliation"
      :columns="INVOICE_RECONCILIATION_COLUMNS"
      :rows="rows"
      selectable
      :context="exportContext"
      @select="select"
    />

    <Panel v-if="invoice">
      <Heading class="mb-3">Edit references · invoice {{ invoice.id }}</Heading>

      <Paragraph class="mb-4">
        Only choose verified processor records and retrieved order IDs. “Clear
        metadata” sends explicit null. Existing saved snapshots remain
        immutable; generate a new report to recompute reconciliation.
      </Paragraph>

      <Paragraph class="mb-4">
        Saved snapshot references: {{ invoice.currency ?? "Unavailable" }} ·
        {{ invoice.paymentReference ?? "Unavailable" }} ·
        {{ invoice.orderReference ?? "Unavailable" }}. Unverified values are not
        preselected.
      </Paragraph>

      <form class="grid gap-4 md:grid-cols-3" @submit.prevent="save">
        <Label>
          Currency
          <Select
            v-model="currency"
            aria-label="Verified invoice currency"
            :options="currencyOptions"
          />
        </Label>

        <Label>
          Verified payment reference
          <Select
            v-model="payment"
            aria-label="Verified payment reference"
            :options="paymentOptions"
          />
        </Label>

        <Label>
          Verified order ID
          <Select
            v-model="order"
            aria-label="Verified order reference"
            :options="orderOptions"
          />
        </Label>

        <Alert v-if="error" class="md:col-span-3">{{ error }}</Alert>

        <Alert v-if="saved" variant="info" class="md:col-span-3">
          References saved. This report is unchanged. Generate a new report to
          see recomputed matches.
        </Alert>

        <div class="flex gap-2">
          <Button type="submit" variant="primary" :disabled="pending">
            {{ pending ? "Saving…" : "Save references" }}
          </Button>

          <Button :disabled="pending" @click="invoice = null">Close</Button>
        </div>
      </form>
    </Panel>
  </div>
</template>
