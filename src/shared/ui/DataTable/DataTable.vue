<script setup lang="ts">
import { ArrowDownUp, Download, Search } from "@lucide/vue";
import EmptyState from "@/shared/ui/EmptyState/EmptyState.vue";
import Button from "@/shared/ui/Button/Button.vue";
import Input from "@/shared/ui/Input/Input.vue";
import Heading from "@/shared/ui/Heading/Heading.vue";
import Paragraph from "@/shared/ui/Paragraph/Paragraph.vue";
import Span from "@/shared/ui/Span/Span.vue";
import type {
  ColumnType,
  TableRowType,
  ExportContextType,
} from "@/shared/lib/types/table";
import { downloadCsv } from "@/shared/lib/helpers/csv";
import { useDataTable } from "@/shared/lib/composables/useDataTable";

interface PropsI {
  title: string;
  emptyTitle?: string;
  emptyMessage?: string;
  columns: ColumnType[];
  rows: TableRowType[];
  context?: ExportContextType;
  selectable?: boolean;
  search?: boolean;
}

const props = withDefaults(defineProps<PropsI>(), { search: true });

const emit = defineEmits<{ select: [key: string] }>();

const { query, sort, ascending, filtered, sortBy } = useDataTable(props);
</script>

<template>
  <section class="glass-panel overflow-hidden rounded-2xl">
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-b border-border p-5"
    >
      <div class="grid gap-1">
        <Heading as="h3">{{ title }}</Heading>

        <Span variant="technical">
          {{ filtered.length }} of {{ rows.length }} returned records
        </Span>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div v-if="search" class="relative">
          <Search
            :size="14"
            class="absolute left-3 top-3.5 text-muted"
            aria-hidden="true"
          />

          <Input
            v-model="query"
            type="search"
            :aria-label="`Search ${title}`"
            placeholder="Search records…"
            class="pl-9"
          />
        </div>

        <Button
          :disabled="!filtered.length"
          @click="
            downloadCsv(title, columns, filtered, {
              ...context,
              scope: 'Visible filtered table',
            })
          "
        >
          <Download :size="14" aria-hidden="true" />
          Export visible CSV
        </Button>
      </div>
    </div>

    <div v-if="filtered.length" class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <caption class="sr-only">
          {{ title }}. Sort using column buttons. Export includes the visible
          filtered rows.
        </caption>

        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="
                sort === column.key
                  ? ascending
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              "
              class="whitespace-nowrap border-b border-border p-4"
            >
              <Button
                variant="ghost"
                class="px-0 py-1 text-[10px] uppercase tracking-widest"
                @click="sortBy(column.key)"
              >
                {{ column.label }}
                <ArrowDownUp :size="11" aria-hidden="true" />
              </Button>
            </th>

            <th v-if="selectable" scope="col" class="p-4">Details</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in filtered"
            :key="row.key"
            class="border-b border-border/60 hover:bg-elevated/40"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="max-w-96 whitespace-pre-wrap p-4 font-mono text-muted"
            >
              {{ row.cells[column.key] ?? "Unavailable" }}
            </td>

            <td v-if="selectable" class="p-4">
              <Button
                variant="ghost"
                :aria-label="`Open details for ${row.key}`"
                @click="emit('select', row.key)"
              >
                View
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState
      v-if="!filtered.length"
      class="m-5"
      :title="
        rows.length
          ? 'No matching records'
          : (emptyTitle ?? 'No reported records')
      "
      :description="
        rows.length
          ? 'No records match your search. Clear it to see the returned records.'
          : (emptyMessage ??
            'The response contains no records for this view. Missing records do not establish zero activity.')
      "
    >
      <template v-if="query" #action>
        <Button @click="query = ''">Clear search</Button>
      </template>
    </EmptyState>

    <Paragraph class="border-t border-border px-5 py-3" variant="technical">
      Export scope: visible filtered table.
      {{ context?.units ?? "Units are shown in column labels." }}
    </Paragraph>
  </section>
</template>
