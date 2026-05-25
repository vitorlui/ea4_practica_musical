export interface TheoryStep {
  title: string;
  body: string;
  highlight?: boolean;
}

export type BadgeType = "perfecta" | "imperfecta" | "consonante" | "disonante";

export interface BadgeCell {
  text: string;
  badge?: BadgeType;
}

export type TableCell = string | BadgeCell;

export interface TheoryTable {
  headers: string[];
  rows: TableCell[][];
}

export interface TheorySection {
  id: string;
  title?: string;
  content?: string[];
  steps?: TheoryStep[];
  table?: TheoryTable;
}
