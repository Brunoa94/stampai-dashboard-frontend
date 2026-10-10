<script setup lang="ts">
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Checkbox from "@/shared/ui/Checkbox/Checkbox.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import Loading from "@/shared/ui/Loading/Loading.vue";
import { errorMessage } from "@/shared/lib/constants/errors";
import { utcLabel } from "@/shared/lib/helpers/dates";
import { useNotifications } from "@/features/financeDashboard/lib/composables/useNotifications";

const emit = defineEmits<{ open: [id: string] }>();

const {
  offset,
  unread,
  saveError,
  data,
  isFetching,
  error,
  refetch,
  mutation,
  toggle,
} = useNotifications();
</script>

<template>
  <div class="grid gap-5">
    <div class="flex justify-between">
      <Paragraph>
        Reading a notification does not acknowledge its report alert.
      </Paragraph>

      <Checkbox v-model="unread">Unread only</Checkbox>
    </div>

    <Loading v-if="isFetching" layout="list" :initial="!data" />

    <Alert v-if="error">
      {{ errorMessage(error) }}
      <template #action>
        <Button class="mt-3" @click="refetch()">Retry loading</Button>
      </template>
    </Alert>

    <Alert v-if="saveError">{{ saveError }}</Alert>

    <Panel v-for="notification in data" :key="notification.id">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="grid gap-3">
          <Chip :variant="notification.read ? 'neutral' : 'gold'">
            {{ notification.read ? "Read" : "Unread" }} ·
            {{ notification.severity }}
          </Chip>

          <Paragraph variant="body">{{ notification.message }}</Paragraph>

          <Paragraph variant="technical">
            {{ utcLabel(notification.created_at) }} · report
            {{ notification.report_id }}
          </Paragraph>
        </div>

        <div class="flex gap-2">
          <Button @click="emit('open', notification.report_id)">
            Open report
          </Button>

          <Button
            :disabled="mutation.isPending.value"
            @click="toggle(notification.id, !notification.read)"
          >
            {{ notification.read ? "Mark unread" : "Mark read" }}
          </Button>
        </div>
      </div>
    </Panel>

    <EmptyState
      v-if="data && !data.length && !isFetching && !error"
      :title="
        offset > 0
          ? 'No notifications on this page'
          : unread
            ? 'No unread notifications'
            : 'No notifications yet'
      "
      :description="
        offset > 0
          ? 'Return to the previous page to see earlier notifications.'
          : unread
            ? 'No unread notifications were returned. Turn off the unread filter to see all notifications.'
            : 'Report alerts appear here when the backend creates notifications.'
      "
    >
      <template v-if="unread && offset === 0" #action>
        <Button @click="unread = false">Show all notifications</Button>
      </template>
    </EmptyState>

    <div class="flex gap-3">
      <Button
        :disabled="offset === 0 || isFetching"
        @click="offset = Math.max(0, offset - 20)"
      >
        Previous
      </Button>

      <Button
        :disabled="(data?.length ?? 0) < 20 || isFetching"
        @click="offset += 20"
      >
        Next page
      </Button>
    </div>
  </div>
</template>
