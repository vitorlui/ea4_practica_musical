import type { Note, NoteName, IntervalResult, IntervalNumber, IntervalQuality } from "./types";

const DIATONIC_NAMES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const DIATONIC_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

function accidentalToSemitones(acc: string): number {
  if (acc === "#") return 1;
  if (acc === "b") return -1;
  if (acc === "##") return 2;
  if (acc === "bb") return -2;
  return 0;
}

function noteToAbsSemitones(note: Note): number {
  const idx = DIATONIC_NAMES.indexOf(note.name);
  return note.octave * 12 + DIATONIC_SEMITONES[idx] + accidentalToSemitones(note.accidental);
}

// Semitone count → quality given diatonic interval number
// Based on EA4 Lenguaje Musical theory
const QUALITY_TABLE: Record<number, Record<number, IntervalQuality>> = {
  1: { 0: "justa", 1: "aumentada" },
  2: { 0: "disminuida", 1: "menor", 2: "mayor", 3: "aumentada" },
  3: { 2: "disminuida", 3: "menor", 4: "mayor", 5: "aumentada" },
  4: { 4: "disminuida", 5: "justa", 6: "aumentada" },
  5: { 6: "disminuida", 7: "justa", 8: "aumentada" },
  6: { 7: "disminuida", 8: "menor", 9: "mayor", 10: "aumentada" },
  7: { 9: "disminuida", 10: "menor", 11: "mayor", 12: "aumentada" },
  8: { 11: "disminuida", 12: "justa", 13: "aumentada" },
};

export function calcInterval(lower: Note, upper: Note): IntervalResult {
  const lowerIdx = DIATONIC_NAMES.indexOf(lower.name);
  const upperIdx = DIATONIC_NAMES.indexOf(upper.name);

  // Diatonic distance (1-based)
  let diatonicDist = upperIdx - lowerIdx;
  let octaveAdd = 0;
  if (upper.octave > lower.octave) {
    octaveAdd = (upper.octave - lower.octave) * 7;
  }
  diatonicDist += octaveAdd;
  if (diatonicDist < 0) diatonicDist += 7;
  const mod = diatonicDist % 7;
  const number = (mod === 0 && diatonicDist > 0 ? 8 : mod + 1) as IntervalNumber;

  const semitones = noteToAbsSemitones(upper) - noteToAbsSemitones(lower);
  const absSemitones = Math.abs(semitones) % 12;

  const qualityMap = QUALITY_TABLE[number] ?? {};
  const quality: IntervalQuality = qualityMap[absSemitones] ?? qualityMap[semitones] ?? "mayor";

  const label = `${number}ª ${quality}`;
  return { number, quality, semitones: Math.abs(semitones), label };
}

// Generate a random interval exercise: returns lower note + interval number + quality to identify
export function randomIntervalExercise(): {
  lower: Note;
  upper: Note;
  result: IntervalResult;
} {
  const notes: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
  const lowerName = notes[Math.floor(Math.random() * notes.length)];
  const lower: Note = { name: lowerName, accidental: "", octave: 4 };

  // Pick a random diatonic interval 2-8
  const intervalNum = (Math.floor(Math.random() * 7) + 2) as IntervalNumber;
  const lowerIdx = DIATONIC_NAMES.indexOf(lowerName);
  const upperIdx = (lowerIdx + intervalNum - 1) % 7;
  const upperName = DIATONIC_NAMES[upperIdx];
  const octave: 4 | 5 = lowerIdx + intervalNum - 1 >= 7 ? 5 : 4;
  const upper: Note = { name: upperName, accidental: "", octave };

  const result = calcInterval(lower, upper);
  return { lower, upper, result };
}

export function intervalNumberToSpanish(n: IntervalNumber): string {
  const map: Record<IntervalNumber, string> = {
    1: "Unísono", 2: "2ª", 3: "3ª", 4: "4ª", 5: "5ª", 6: "6ª", 7: "7ª", 8: "8ª (octava)",
  };
  return map[n];
}
