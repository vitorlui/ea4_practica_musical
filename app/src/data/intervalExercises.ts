import type { Note } from "../theory/types";

export interface IntervalExercise {
  id: string;
  lower: Note;
  upper: Note;
  // Correct answer
  number: number;
  quality: string;
  label: string;
}

// Pre-composed interval exercises covering all qualities
export const INTERVAL_EXERCISES: IntervalExercise[] = [
  { id: "int_1", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "D", accidental: "", octave: 4 }, number: 2, quality: "mayor", label: "2ª mayor" },
  { id: "int_2", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "E", accidental: "b", octave: 4 }, number: 3, quality: "menor", label: "3ª menor" },
  { id: "int_3", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "E", accidental: "", octave: 4 }, number: 3, quality: "mayor", label: "3ª mayor" },
  { id: "int_4", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "F", accidental: "", octave: 4 }, number: 4, quality: "justa", label: "4ª justa" },
  { id: "int_5", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "F", accidental: "#", octave: 4 }, number: 4, quality: "aumentada", label: "4ª aumentada" },
  { id: "int_6", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "G", accidental: "", octave: 4 }, number: 5, quality: "justa", label: "5ª justa" },
  { id: "int_7", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "G", accidental: "b", octave: 4 }, number: 5, quality: "disminuida", label: "5ª disminuida" },
  { id: "int_8", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "A", accidental: "", octave: 4 }, number: 6, quality: "mayor", label: "6ª mayor" },
  { id: "int_9", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "A", accidental: "b", octave: 4 }, number: 6, quality: "menor", label: "6ª menor" },
  { id: "int_10", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "B", accidental: "", octave: 4 }, number: 7, quality: "mayor", label: "7ª mayor" },
  { id: "int_11", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "B", accidental: "b", octave: 4 }, number: 7, quality: "menor", label: "7ª menor" },
  { id: "int_12", lower: { name: "C", accidental: "", octave: 4 }, upper: { name: "C", accidental: "", octave: 5 }, number: 8, quality: "justa", label: "8ª justa" },
  { id: "int_13", lower: { name: "G", accidental: "", octave: 4 }, upper: { name: "D", accidental: "", octave: 5 }, number: 5, quality: "justa", label: "5ª justa" },
  { id: "int_14", lower: { name: "D", accidental: "", octave: 4 }, upper: { name: "A", accidental: "", octave: 4 }, number: 5, quality: "justa", label: "5ª justa" },
  { id: "int_15", lower: { name: "E", accidental: "", octave: 4 }, upper: { name: "G", accidental: "", octave: 4 }, number: 3, quality: "menor", label: "3ª menor" },
  { id: "int_16", lower: { name: "F", accidental: "", octave: 4 }, upper: { name: "A", accidental: "", octave: 4 }, number: 3, quality: "mayor", label: "3ª mayor" },
  { id: "int_17", lower: { name: "A", accidental: "", octave: 4 }, upper: { name: "C", accidental: "", octave: 5 }, number: 3, quality: "menor", label: "3ª menor" },
  { id: "int_18", lower: { name: "B", accidental: "", octave: 4 }, upper: { name: "F", accidental: "#", octave: 5 }, number: 5, quality: "justa", label: "5ª justa" },
];

export function randomIntervalExercise(): IntervalExercise {
  return INTERVAL_EXERCISES[Math.floor(Math.random() * INTERVAL_EXERCISES.length)];
}

export function noteToVexKey(note: Note): string {
  const nameMap: Record<string, string> = { C: "c", D: "d", E: "e", F: "f", G: "g", A: "a", B: "b" };
  return `${nameMap[note.name]}${note.accidental}/${note.octave}`;
}
