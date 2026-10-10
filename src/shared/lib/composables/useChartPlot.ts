import { computed } from "vue";
import type { ChartDatumType, ChartLineType } from "@/shared/lib/types/chart";

export function useChartPlot(
  props: Readonly<{ data: ChartDatumType[]; lines: ChartLineType[] }>,
) {
  const x = (datum: ChartDatumType) => datum.index;

  const series = computed(() =>
    props.lines.map((line) => ({
      ...line,
      y: (datum: ChartDatumType) => datum.values[line.id] ?? Number.NaN,
    })),
  );

  const tickFormat = (index: number) =>
    props.data[Math.round(index)]?.date.slice(5) ?? "";

  const tickValues = computed(() =>
    props.data
      .filter(
        (_, index) =>
          index % Math.max(1, Math.ceil(props.data.length / 6)) === 0 ||
          index === props.data.length - 1,
      )
      .map((datum) => datum.index),
  );

  const valueFormat = (value: number) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  return { x, series, tickFormat, tickValues, valueFormat };
}
