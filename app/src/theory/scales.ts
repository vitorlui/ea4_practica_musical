import type { Note, NoteName, Accidental, Octave, ScaleType, KeyMode } from "./types";

// Semitone intervals for each scale type
const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [2, 2, 1, 2, 2, 2, 1],
  natural_minor: [2, 1, 2, 2, 1, 2, 2],
  harmonic_minor: [2, 1, 2, 2, 1, 3, 1],
};

const CHROMATIC_SHARPS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const CHROMATIC_FLATS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const DIATONIC_NAMES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const DIATONIC_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

function parseNoteString(str: string): { name: NoteName; accidental: Accidental } {
  const name = str[0] as NoteName;
  const accidental = (str.slice(1) as Accidental) || "";
  return { name, accidental };
}

function noteToSemitone(name: NoteName, accidental: Accidental): number {
  const base = DIATONIC_SEMITONES[DIATONIC_NAMES.indexOf(name)];
  const mod = accidental === "#" ? 1 : accidental === "b" ? -1 : accidental === "##" ? 2 : accidental === "bb" ? -2 : 0;
  return (base + mod + 12) % 12;
}

function useFlatKey(tonic: string): boolean {
  const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb", "D", "G", "C", "F#", "Bb", "Eb"];
  // Keys that prefer flats
  return ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"].includes(tonic) ||
    ["D", "G", "C"].includes(tonic) === false && tonic.endsWith("b");
}

export function buildScale(tonic: string, scaleType: ScaleType): Note[] {
  const parsed = parseNoteString(tonic);
  const tonicSemitone = noteToSemitone(parsed.name, parsed.accidental);
  const intervals = SCALE_INTERVALS[scaleType];

  const preferFlats = tonic.includes("b") || ["F"].includes(tonic);
  const chromatic = preferFlats ? CHROMATIC_FLATS : CHROMATIC_SHARPS;

  const tonicDiatonicIndex = DIATONIC_NAMES.indexOf(parsed.name);
  const notes: Note[] = [];
  let currentSemitone = tonicSemitone;

  for (let i = 0; i <= 7; i++) {
    const diatonicIndex = (tonicDiatonicIndex + i) % 7;
    const diatonicName = DIATONIC_NAMES[diatonicIndex];
    const diatonicSemitone = DIATONIC_SEMITONES[diatonicIndex];
    const semitone = ((currentSemitone % 12) + 12) % 12;

    let diff = (semitone - diatonicSemitone + 12) % 12;
    if (diff > 6) diff -= 12;
    let accidental: Accidental = "";
    if (diff === 1) accidental = "#";
    else if (diff === -1) accidental = "b";
    else if (diff === 2) accidental = "##";
    else if (diff === -2) accidental = "bb";

    const octave: Octave = i < 7 ? 4 : 5;
    notes.push({ name: diatonicName, accidental, octave });

    if (i < 7) {
      currentSemitone += intervals[i];
    }
  }

  return notes;
}

export function scaleTypeForMode(mode: KeyMode): ScaleType {
  return mode === "major" ? "major" : "natural_minor";
}

export function noteToSpanish(note: Note): string {
  const names: Record<NoteName, string> = { C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si" };
  const accStr = note.accidental === "#" ? "♯" : note.accidental === "b" ? "♭" : note.accidental === "##" ? "𝄪" : note.accidental === "bb" ? "𝄫" : "";
  return names[note.name] + accStr;
}
