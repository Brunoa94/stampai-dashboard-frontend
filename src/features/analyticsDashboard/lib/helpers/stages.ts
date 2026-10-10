import type { StageType } from "@/features/analyticsDashboard/lib/types/analytics";

export function stageNodes(stages: StageType[], stacked = false) {
  const max = Math.max(1, ...stages.map((stage) => stage.eventCount));

  return stages.map((stage, index) => ({
    ...stage,
    x: stacked ? 160 : index * 210 + 105,
    y: stacked ? 110 + index * 230 : index % 2 ? 215 : 110,
    radius: 48 + 24 * Math.sqrt(stage.eventCount / max),
    width: (stage.eventCount / max) * 100,
  }));
}
