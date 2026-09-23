export type CellFormatType = 'text' | 'number' | 'currency' | 'percent' | 'date' | 'general' | 'accounting';

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  bgColor?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  wrapText?: boolean;
  format?: CellFormatType;
  decimals?: number;
  currencySymbol?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  borderAll?: boolean;
  borderBox?: boolean;
}

export interface CellComment {
  author: string;
  text: string;
  timestamp: string;
}

export interface CellData {
  raw: string;           // Entered by user (e.g. "=SUM(A1:A5)" or "100" or "Hello")
  value: any;            // Computed / evaluated value
  style?: CellStyle;
  comment?: CellComment;
  error?: string;
}

export type SheetData = Record<string, CellData>; // key: "A1", "B2" etc.

export interface Worksheet {
  id: string;
  name: string;
  data: SheetData;
  rowCount: number;
  colCount: number;
  colWidths?: Record<number, number>;
  rowHeights?: Record<number, number>;
  tabColor?: string;
}

export interface CellCoords {
  col: number; // 0-indexed: 0 -> A
  row: number; // 0-indexed: 0 -> 1
}

export interface SelectionRange {
  start: CellCoords;
  end: CellCoords;
}

export type ThemeMode = 'classic' | 'dark' | 'glass' | 'emerald';

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'polarArea';
  range: string; // e.g. "A1:B6"
  labelColumn: string;
  dataColumn: string;
}
