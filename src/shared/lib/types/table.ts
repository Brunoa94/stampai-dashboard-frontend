export type CellType = string | number | boolean | null;

export type TableRowType = { key: string; cells: Record<string, CellType> };

export type ColumnType = { key: string; label: string };

export type SeriesType = {
  id: string;
  label: string;
  values: (number | null)[];
  unit: string;
};

export type ExportContextType = {
  scope: string;
  period?: string;
  comparison?: string;
  funnel?: string;
  units?: string;
};
