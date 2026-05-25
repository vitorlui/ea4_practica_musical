import type { VexNote } from "../music/VexFlowRenderer";

export interface StaffExample {
  notes: VexNote[];
  keySignature?: string;
  timeSignature?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface TheoryStep {
  title: string;
  body: string;
  highlight?: boolean;
  staffExample?: StaffExample;
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
