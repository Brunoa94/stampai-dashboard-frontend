<script setup lang="ts">
import Panel from "@/shared/ui/Panel/Panel.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Select from "@/shared/ui/Select/Select.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Loading from "@/shared/ui/Loading/Loading.vue";
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Transactions from "@/features/financeDashboard/ui/sections/Transactions.vue";
import { useActivityTransactions } from "@/features/financeDashboard/lib/composables/useActivityTransactions";
import { errorMessage } from "@/shared/lib/constants/errors";

const reportId = defineModel<string>("reportId", { required: true });

const {
  reports,
  listing,
  listError,
  options,
  report,
  loading,
  error,
  refetch,
} = useActivityTransactions(reportId);
</script>

<template>
  <div class="grid gap-6">
    <Panel>
      <Label for="activity-report">
        Saved report
        <Select
          id="activity-report"
          v-model="reportId"
          aria-label="Saved report for transactions"
          :options="options"
        />
      </Label>

      <Paragraph class="mt-3" variant="technical">
        Transactions come from immutable saved snapshots. Generate a report on
        the Finance page to add newer activity.
      </Paragraph>
    </Panel>

    <Alert v-if="listError">{{ errorMessage(listError) }}</Alert>

    <Loading v-if="listing || loading" layout="list" :initial="!report" />

    <Alert v-if="error">
      {{ errorMessage(error) }}
      <template #action>
        <Button class="mt-3" @click="refetch()">Retry loading</Button>
      </template>
    </Alert>

    <Transactions v-if="report" :key="report.id" :report="report" />

    <EmptyState
      v-else-if="reports && !reports.length && !listing"
      title="No saved reports yet"
      description="Generate a finance report to explore its transactions here."
    />
  </div>
</template>
