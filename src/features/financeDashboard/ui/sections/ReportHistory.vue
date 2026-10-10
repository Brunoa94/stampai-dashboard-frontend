<script setup lang="ts">
import { REPORT_HISTORY_COLUMNS } from "@/features/financeDashboard/lib/constants/tableColumns";
import { useReportHistory } from "@/features/financeDashboard/lib/composables/useReportHistory";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Loading from "@/shared/ui/Loading/Loading.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import { errorMessage } from "@/shared/lib/constants/errors";

const emit = defineEmits<{ open: [id: string] }>();

const {
  ready,
  data,
  isFetching,
  error,
  refetch,
  rows,
  canPrevious,
  canNext,
  previous,
  next,
} = useReportHistory();
</script>

<template>
  <div class="grid gap-6">
    <Paragraph>
      Saved reports are immutable snapshots. Opening one does not call providers
      or generate AI. Select a report to explore its original saved data.
    </Paragraph>

    <Paragraph v-if="!ready">
      Configure your API connection to load saved reports.
    </Paragraph>

    <Button v-if="ready" :disabled="isFetching" @click="refetch()">
      Refresh saved reports
    </Button>

    <Loading v-if="isFetching" layout="table" :initial="!data" />

    <Alert v-if="error">
      {{ errorMessage(error) }}
      <template #action>
        <Button class="mt-3" :disabled="isFetching" @click="refetch()">
          Retry loading
        </Button>
      </template>
    </Alert>

    <DataTable
      v-if="data"
      title="Saved reports"
      empty-title="No saved reports on this page"
      empty-message="No saved reports were returned for this page. Generate a report to create a snapshot, or use Previous to check earlier pages."
      :columns="REPORT_HISTORY_COLUMNS"
      :rows="rows"
      selectable
      @select="emit('open', $event)"
    />

    <div v-if="data" class="flex gap-3">
      <Button :disabled="!canPrevious" @click="previous">Previous</Button>

      <Button :disabled="!canNext" @click="next">Next page</Button>
    </div>
  </div>
</template>
