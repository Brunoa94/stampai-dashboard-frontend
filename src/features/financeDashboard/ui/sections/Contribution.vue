<script setup lang="ts">
import {
  ORDER_CONTRIBUTION_COLUMNS,
  PRODUCT_CONTRIBUTION_COLUMNS,
} from "@/features/financeDashboard/lib/constants/tableColumns";
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Alert from "@/shared/ui/Alert/Alert.vue";
import MetricCard from "@/shared/ui/MetricCard/MetricCard.vue";
import DataTable from "@/shared/ui/DataTable/DataTable.vue";
import type { FinanceReportType } from "@/features/financeDashboard/lib/types/finance";
import { money, numberLabel } from "@/shared/lib/helpers/format";
import { useContribution } from "@/features/financeDashboard/lib/composables/useContribution";

interface PropsI {
  report: FinanceReportType;
}

const props = defineProps<PropsI>();

const { eligible, orders, products, orderExportContext, productExportContext } =
  useContribution(props);
</script>

<template>
  <div id="finance-contribution" class="grid gap-6">
    <Heading>Fulfillment and order contribution</Heading>

    <Paragraph>
      Order contribution excludes overhead, unlinked adjustments, and refunds
      outside the selected window. It is not company net profit. Costs are
      already normalized by the backend; quantities are not multiplied again.
    </Paragraph>

    <Paragraph>
      Cost currency: {{ report.costConfiguration.currency ?? "Unavailable" }} ·
      basis: {{ report.costConfiguration.costBasis ?? "Unavailable" }}
    </Paragraph>

    <Alert v-if="!eligible" variant="info">
      Contribution is unavailable without complete coverage and verified cost
      configuration.
    </Alert>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Retrieved orders"
        :value="numberLabel(report.dashboard.orderMetrics.totalOrders)"
      />

      <MetricCard
        label="Fulfilled orders"
        :value="numberLabel(report.dashboard.orderMetrics.fulfilledOrders)"
        :note="`Pending: ${report.dashboard.orderMetrics.pendingOrders}`"
      />

      <MetricCard
        label="Matched orders"
        :value="numberLabel(report.dashboard.orderMetrics.matchedOrders)"
        :note="`Contribution eligible: ${report.dashboard.orderMetrics.contributionEligibleOrders}`"
      />

      <MetricCard
        label="Average fulfillment days"
        :value="
          numberLabel(report.dashboard.orderMetrics.averageFulfillmentDays)
        "
      />
    </div>

    <EmptyState
      v-if="!report.dashboard.contributionSummaries.length"
      title="No contribution summaries returned"
      description="This snapshot has no currency-specific contribution summaries. Check cost configuration, source coverage, and eligible matched orders; missing summaries do not establish zero contribution."
    />

    <div class="grid gap-4 sm:grid-cols-2">
      <MetricCard
        v-for="summary in report.dashboard.contributionSummaries"
        :key="summary.currency"
        :label="`${summary.currency} order contribution`"
        :value="
          money(
            eligible && summary.currency === report.costConfiguration.currency
              ? summary.contributionMinor
              : null,
            summary.currency,
          )
        "
        :note="`${summary.matchedOrderCount} eligible matched orders · margin ${numberLabel(eligible && summary.currency === report.costConfiguration.currency ? summary.marginPercent : null)}%`"
      />
    </div>

    <DataTable
      title="Fulfillment and order costs"
      empty-title="No orders returned"
      empty-message="This snapshot contains no retrieved orders. Missing order rows do not establish zero fulfillment or contribution."
      :columns="ORDER_CONTRIBUTION_COLUMNS"
      :rows="orders"
      :context="orderExportContext"
    />

    <Heading>Product contribution explorer</Heading>

    <Paragraph>
      Allocated by retail weight. Receipts, refunds, fees, shipping and tax are
      allocated estimates, not separately verified product payments. Missing
      product rows do not establish zero contribution.
    </Paragraph>

    <DataTable
      title="Allocated product contribution"
      empty-title="No product allocations returned"
      empty-message="Product allocation requires eligible orders and valid retail weights. Missing product rows do not establish zero contribution."
      :columns="PRODUCT_CONTRIBUTION_COLUMNS"
      :rows="products"
      :context="productExportContext"
    />
  </div>
</template>
