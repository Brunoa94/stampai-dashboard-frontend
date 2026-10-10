import type { SeriesType } from "@/shared/lib/types/table";

export type ChartDatumType = {
  index: number;
  date: string;
  values: Record<string, number | null>;
};

export type ChartLineType = SeriesType & { color: string | undefined };
