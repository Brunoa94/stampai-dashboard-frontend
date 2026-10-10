import { computed, ref } from "vue";
import {
  useLocalPreference,
  isString,
  isBoolean,
} from "@/shared/lib/composables/useLocalPreference";
import type { DataTableInputType } from "@/shared/lib/types/componentInputs";

export function useDataTable(props: Readonly<DataTableInputType>) {
  const query = ref("");

  const sort = useLocalPreference(`table:${props.title}:sort`, "", isString);

  const ascending = useLocalPreference(
    `table:${props.title}:ascending`,
    true,
    isBoolean,
  );

  const filtered = computed(() =>
    props.rows
      .filter((row) =>
        Object.values(row.cells).some((cell) =>
          String(cell ?? "Unavailable")
            .toLowerCase()
            .includes(query.value.toLowerCase()),
        ),
      )
      .slice()
      .sort((a, b) => {
        if (!sort.value) return 0;

        const first = a.cells[sort.value];

        const second = b.cells[sort.value];

        const result =
          typeof first === "number" && typeof second === "number"
            ? first - second
            : String(first ?? "").localeCompare(String(second ?? ""));

        return ascending.value ? result : -result;
      }),
  );

  function sortBy(key: string): void {
    if (sort.value === key) ascending.value = !ascending.value;
    else {
      sort.value = key;

      ascending.value = true;
    }
  }

  return { query, sort, ascending, filtered, sortBy };
}
