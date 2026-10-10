import type {
  ColumnType,
  TableRowType,
  SeriesType,
  ExportContextType,
} from "@/shared/lib/types/table";

export type ChartInputType = {
  title: string;
  dates: string[];
  series: SeriesType[];
  context?: ExportContextType;
};

export type DataTableInputType = {
  title: string;
  columns: ColumnType[];
  rows: TableRowType[];
  context?: ExportContextType;
  selectable?: boolean;
  search?: boolean;
};
