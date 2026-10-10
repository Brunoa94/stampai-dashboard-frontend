<script setup lang="ts">
import { ref } from "vue";
import { useScheduleList } from "@/features/financeDashboard/lib/queries/finance";
import { useScheduleEditor } from "@/features/financeDashboard/lib/composables/useScheduleEditor";
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Label from "@/shared/ui/Label/Label.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Checkbox from "@/shared/ui/Checkbox/Checkbox.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Loading from "@/shared/ui/Loading/Loading.vue";
import { errorMessage, ERROR_MESSAGES } from "@/shared/lib/constants/errors";
import { utcLabel } from "@/shared/lib/helpers/dates";

const { data, isFetching, error: loadError, refetch } = useScheduleList();

const {
  id,
  name,
  enabled,
  cadence,
  lookback,
  ai,
  nextRun,
  error,
  saved,
  pending,
  edit,
  save,
} = useScheduleEditor();

const editor = ref(false);
</script>

<template>
  <div class="grid gap-6">
    <div class="flex flex-wrap justify-between gap-4">
      <Paragraph class="max-w-3xl">
        Schedules analyze complete UTC days before execution. The backend runs
        the oldest due slot once and skips missed slots. Failures retry the same
        slot after five minutes. Notifications stay in the in-app inbox.
      </Paragraph>

      <Button :disabled="isFetching" @click="refetch()">
        Refresh schedules
      </Button>

      <Button
        variant="primary"
        @click="
          edit();
          editor = true;
        "
      >
        New schedule
      </Button>
    </div>

    <Loading v-if="isFetching" layout="list" :initial="!data" />

    <Alert v-if="loadError">
      {{ errorMessage(loadError) }}
      <template #action>
        <Button class="mt-3" @click="refetch()">Retry loading</Button>
      </template>
    </Alert>

    <EmptyState
      v-if="data && !data.length && !isFetching && !loadError"
      title="No schedules yet"
      description="Create a schedule to generate saved finance reports for complete UTC days."
    />

    <Panel v-for="schedule in data" :key="schedule.id">
      <div class="flex flex-wrap justify-between gap-4">
        <div class="grid gap-2">
          <Heading>{{ schedule.name }}</Heading>

          <div class="flex gap-2">
            <Chip :variant="schedule.enabled ? 'success' : 'neutral'">
              {{ schedule.enabled ? "Enabled" : "Disabled" }}
            </Chip>

            <Chip
              v-if="
                schedule.lease_until &&
                Date.parse(schedule.lease_until) > Date.now()
              "
              variant="gold"
            >
              Running
            </Chip>
          </div>

          <Paragraph>
            Every {{ schedule.cadence_days }} days ·
            {{ schedule.lookback_days }}-day lookback · next
            {{ utcLabel(schedule.next_run_at) }}
          </Paragraph>

          <Paragraph v-if="schedule.last_error">
            Last run error: {{ ERROR_MESSAGES.SERVER }}
          </Paragraph>
        </div>

        <Button
          :disabled="
            !!schedule.lease_until &&
            Date.parse(schedule.lease_until) > Date.now()
          "
          @click="
            edit(schedule);
            editor = true;
          "
        >
          Edit schedule
        </Button>
      </div>
    </Panel>

    <Panel v-if="editor">
      <Heading class="mb-4">
        {{ id === undefined ? "Create schedule" : "Edit schedule" }}
      </Heading>

      <form
        novalidate
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        @submit.prevent="save"
      >
        <Label for="schedule-name">
          Name
          <Input id="schedule-name" v-model="name" />
        </Label>

        <Label for="cadence">
          Cadence days (1–31)
          <Input
            id="cadence"
            v-model="cadence"
            type="number"
            min="1"
            max="31"
          />
        </Label>

        <Label for="lookback">
          Lookback days (1–31)
          <Input
            id="lookback"
            v-model="lookback"
            type="number"
            min="1"
            max="31"
          />
        </Label>

        <Label for="next-run">
          Next execution · UTC
          <Input id="next-run" v-model="nextRun" type="datetime-local" />
        </Label>

        <Checkbox v-model="enabled">Enabled</Checkbox>

        <Checkbox v-model="ai">Include AI review</Checkbox>

        <Paragraph class="sm:col-span-2 lg:col-span-3">
          The timestamp is interpreted as UTC. To disable a schedule, uncheck
          Enabled and save the full form with a future execution time.
        </Paragraph>

        <Alert v-if="error" class="sm:col-span-2 lg:col-span-3">
          {{ error }}
        </Alert>

        <Alert v-if="saved" variant="info" class="sm:col-span-2 lg:col-span-3">
          Schedule saved.
        </Alert>

        <div class="flex gap-2">
          <Button type="submit" variant="primary" :disabled="pending">
            {{ pending ? "Saving…" : "Save schedule" }}
          </Button>

          <Button :disabled="pending" @click="editor = false">Cancel</Button>
        </div>
      </form>
    </Panel>
  </div>
</template>
