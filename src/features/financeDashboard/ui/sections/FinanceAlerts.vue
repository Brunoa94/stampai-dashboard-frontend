<script setup lang="ts">
import Panel from "@/shared/ui/Panel/Panel.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Chip from "@/shared/ui/Chip/Chip.vue";
import Button from "@/shared/ui/Button/Button.vue";
import type {
  FinanceReportType,
  AlertReviewType,
} from "@/features/financeDashboard/lib/types/finance";

interface PropsI {
  report: FinanceReportType;
  reviews: AlertReviewType[];
  pending: boolean;
}

defineProps<PropsI>();

const emit = defineEmits<{ acknowledge: [id: string, value: boolean] }>();
</script>

<template>
  <div class="grid gap-5">
    <Paragraph>
      Acknowledgement means reviewed, not corrected. Notifications have separate
      read status. The fee alert threshold is 5% of a classified sale; refunds
      and negative order contribution may also create alerts.
    </Paragraph>

    <Panel v-for="alert in report.dashboard.alerts" :key="alert.id">
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
    </Panel>

    <Paragraph v-if="!report.dashboard.alerts.length">
      No alerts returned for this saved report.
    </Paragraph>
  </div>
</template>
