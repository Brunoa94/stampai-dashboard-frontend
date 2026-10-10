import { computed, ref } from "vue";
import {
  useLocalPreference,
  isStringArray,
} from "@/shared/lib/composables/useLocalPreference";
import { CHART_COLORS } from "@/shared/lib/constants/chart";
import type { ChartInputType } from "@/shared/lib/types/componentInputs";

export function useChart(props: Readonly<ChartInputType>) {
  const hidden = useLocalPreference(
    `chart:${props.title}:hidden`,
    [] as string[],
    isStringArray,
  );

  const mode = ref("chart");

  const focused = ref<number | null>(null);

  const visible = computed(() =>
    props.series.filter((series) => !hidden.value.includes(series.id)),
  );

  const range = computed(() => {
    const values = visible.value.flatMap((s) =>
      s.values.filter((v): v is number => v !== null),
    );

    return { min: Math.min(0, ...values), max: Math.max(1, ...values) };
  });

  const lines = computed(() =>
    visible.value.map((series) => ({
      ...series,
      color:
        CHART_COLORS[
          props.series.findIndex((item) => item.id === series.id) %
            CHART_COLORS.length
        ],
    })),
  );

  const dateOptions = computed(() =>
    props.dates.map((date, index) => ({ value: String(index), label: date })),
  );

  const selectedDate = computed({
    get: () => String(focused.value ?? 0),
    set: (value: string) => {
      focused.value = Number(value);
    },
  });

  const data = computed(() =>
    props.dates.map((date, index) => ({
      index,
      date,
      values: Object.fromEntries(
        visible.value.map((series) => [
          series.id,
          series.values[index] ?? null,
        ]),
      ),
    })),
  );

  const rows = computed(() =>
    props.dates.map((date, index) => ({
      key: date,
      cells: {
        date,
        ...Object.fromEntries(
          visible.value.map((s) => [s.id, s.values[index] ?? null]),
        ),
      },
    })),
  );

  const columns = computed(() => [
    { key: "date", label: "Date" },
    ...visible.value.map((s) => ({
      key: s.id,
      label: `${s.label} (${s.unit})`,
    })),
  ]);

  function toggle(id: string): void {
    hidden.value = hidden.value.includes(id)
      ? hidden.value.filter((value) => value !== id)
      : [...hidden.value, id];
  }

  const emptyState = computed(() => {
    if (!props.dates.length)
      return {
        title: "No reported days",
        description:
          "This response contains no daily rows. Missing days do not establish zero activity.",
      };

    if (!props.series.length)
      return {
        title: "No series returned",
        description: "There are no activity series available for this chart.",
      };

    if (!visible.value.length)
      return {
        title: "All series are hidden",
        description:
          "Select a series or show all series to display the returned values.",
      };

    if (
      !visible.value.some((series) =>
        series.values.some((value) => value !== null),
      )
    )
      return {
        title: "No available values",
        description:
          "The selected series contain unavailable values. Unavailable is not zero; use the table to inspect returned days.",
      };

    return null;
  });

  function showAll(): void {
    hidden.value = [];
  }

  return {
    data,
    dateOptions,
    selectedDate,
    emptyState,
    showAll,
    hidden,
    mode,
    focused,
    visible,
    range,
    lines,
    rows,
    columns,
    toggle,
  };
}
