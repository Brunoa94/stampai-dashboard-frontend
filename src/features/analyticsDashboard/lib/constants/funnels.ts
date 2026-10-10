import type { FunnelType } from "@/features/analyticsDashboard/lib/types/analytics";

export const FUNNELS: { id: FunnelType; label: string }[] = [
  { id: "acquisition", label: "Acquisition" },
  { id: "engagement", label: "Engagement" },
  { id: "product_configuration", label: "Configuration" },
  { id: "generation", label: "Generation" },
  { id: "ecommerce", label: "Ecommerce" },
  { id: "authentication", label: "Authentication" },
];
