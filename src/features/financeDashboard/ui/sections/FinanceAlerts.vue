<script setup lang="ts">
import { toRef } from "vue";
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import Button from "@/shared/ui/Button/Button.vue";
import IssueActions from "@/shared/ui/IssueActions/IssueActions.vue";
import { useFinanceIssues } from "@/features/financeDashboard/lib/composables/useFinanceIssues";
import { alertIssue } from "@/features/financeDashboard/lib/mappers/financeIssues";
import type {
  FinanceReportType,
  AlertReviewType,
} from "@/features/financeDashboard/lib/types/finance";

interface PropsI {
  report: FinanceReportType;
  reviews: AlertReviewType[];
  pending: boolean;
}

const props = defineProps<PropsI>();

const { alerts, find, isPending, errorFor, pendingKey, createIssue, dismiss } =
  useFinanceIssues(toRef(props, "report"));

const emit = defineEmits<{ acknowledge: [id: string, value: boolean] }>();
</script>

<template>
  <div class="grid gap-5">
    <Paragraph>
      Acknowledgement means reviewed, not corrected. Notifications have separate
      read status. The fee alert threshold is 5% of a classified sale; refunds
      and negative order contribution may also create alerts. Create a GitHub
      issue to track a fix, or mark an alert as clean so it is never reported
      again.
    </Paragraph>

    <Panel v-for="alert in alerts" :key="alert.id">
      <div class="flex flex-wrap justify-between gap-4">
        <div class="space-y-3">
          <Chip
            :variant="
              alert.severity === 'critical' || alert.severity === 'warning'
                ? 'danger'
                : 'neutral'
            "
          >
            {{ alert.severity }}
          </Chip>

          <Heading as="h3" variant="card">{{ alert.id }}</Heading>

          <Paragraph>{{ alert.message }}</Paragraph>
        </div>

        <Button
          :disabled="pending"
          @click="
            emit(
              'acknowledge',
              alert.id,
              !reviews.some((r) => r.alert_id === alert.id && r.acknowledged),
            )
          "
        >
          {{
            reviews.some((r) => r.alert_id === alert.id && r.acknowledged)
              ? "Mark unreviewed"
              : "Acknowledge"
          }}
        </Button>
      </div>

      <IssueActions
        class="mt-4 border-t border-border pt-4"
        :label="alert.id"
        :issue="find(alertIssue(report, alert))"
        :pending="isPending(alertIssue(report, alert))"
        :disabled="!!pendingKey"
        :error="errorFor(alertIssue(report, alert))"
        @github="createIssue(alertIssue(report, alert))"
        @dismiss="dismiss(alertIssue(report, alert))"
      />
    </Panel>

    <Paragraph v-if="!alerts.length">
      No alerts returned for this saved report.
    </Paragraph>
  </div>
</template>
