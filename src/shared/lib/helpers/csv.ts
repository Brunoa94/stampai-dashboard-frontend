import type {
  CellType,
  ColumnType,
  TableRowType,
  ExportContextType,
} from "@/shared/lib/types/table";

export function csvCell(value: CellType): string {
  let text = value == null ? "Unavailable" : String(value);

  if (/^[\s]*[=+@-]/.test(text) && typeof value !== "number") text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

export function makeCsv(
  columns: ColumnType[],
  rows: TableRowType[],
  context: ExportContextType,
): string {
  return [
    ...Object.entries(context).map(([key, value]) =>
      [key, value ?? ""].map(csvCell).join(","),
    ),
    columns.map((c) => csvCell(c.label)).join(","),
    ...rows.map((row) =>
      columns.map((c) => csvCell(row.cells[c.key] ?? null)).join(","),
    ),
  ].join("\r\n");
}

export function downloadCsv(
  name: string,
  columns: ColumnType[],
  rows: TableRowType[],
  context: ExportContextType,
): void {
  const url = URL.createObjectURL(
    new Blob(["\ufeff", makeCsv(columns, rows, context)], {
      type: "text/csv;charset=utf-8",
    }),
  );

  const link = document.createElement("a");

  link.href = url;

  link.download = `${name}.csv`;

  link.click();

  URL.revokeObjectURL(url);
}
