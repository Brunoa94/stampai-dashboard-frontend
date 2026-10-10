import type { ExportContextType } from "@/shared/lib/types/table";
import { computed } from "vue";
import { contributionEligible } from "@/features/financeDashboard/lib/helpers/finance";
import type { ContributionInputType } from "@/features/financeDashboard/lib/types/componentInputs";

export function useContribution(props: Readonly<ContributionInputType>) {
  const eligible = computed(() => contributionEligible(props.report));

  const orders = computed(() =>
    props.report.dashboard.orders.map((order) => ({
      key: order.id,
      cells: {
        ...order,
        profitMinor: contributionEligible(props.report, order)
          ? order.profitMinor
          : null,
        marginPercent: contributionEligible(props.report, order)
          ? order.marginPercent
          : null,
        flag:
          order.profitMinor !== null && order.profitMinor < 0
            ? "Negative contribution"
            : null,
      },
    })),
  );

  const products = computed(() =>
    props.report.dashboard.products.map((product, index) => ({
      key: `${product.currency}-${product.productId}-${index}`,
      cells: {
        ...product,
        contributionMinor:
          eligible.value &&
          product.currency === props.report.costConfiguration.currency
            ? product.contributionMinor
            : null,
      },
    })),
  );

  const orderExportContext = computed<ExportContextType>(() => ({
    scope: "Order contribution",
    period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
    units: "Money is in integer ISO currency minor units; fulfillment in days.",
  }));

  const productExportContext = computed<ExportContextType>(() => ({
    scope: "Allocated products",
    period: `${props.report.period.startDate} — ${props.report.period.endDate}`,
    units: "Allocated by retail weight; integer ISO currency minor units.",
  }));

  return {
    eligible,
    orders,
    products,
    orderExportContext,
    productExportContext,
  };
}
