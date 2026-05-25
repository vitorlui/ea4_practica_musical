import type { KeySignature, KeyMode } from "./types";

const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"] as const;
const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"] as const;

// Tonic → { numSharps: n } or { numFlats: n }
const MAJOR_KEY_ACCIDENTALS: Record<string, { sharps?: number; flats?: number }> = {
  C: {},
  G: { sharps: 1 },
  D: { sharps: 2 },
  A: { sharps: 3 },
  E: { sharps: 4 },
  B: { sharps: 5 },
  "F#": { sharps: 6 },
  "C#": { sharps: 7 },
  F: { flats: 1 },
  Bb: { flats: 2 },
  Eb: { flats: 3 },
  Ab: { flats: 4 },
  Db: { flats: 5 },
  Gb: { flats: 6 },
  Cb: { flats: 7 },
};

// Relative minor tonic → same accidentals as its relative major
const MINOR_TO_MAJOR_RELATIVE: Record<string, string> = {
  A: "C",
  E: "G",
  B: "D",
  "F#": "A",
  "C#": "E",
  "G#": "B",
  "D#": "F#",
  "A#": "C#",
  D: "F",
  G: "Bb",
  C: "Eb",
  F: "Ab",
  Bb: "Db",
  Eb: "Gb",
  Ab: "Cb",
};

export function getKeySignature(tonic: string, mode: KeyMode): KeySignature {
  let majorTonic = tonic;
  if (mode === "minor") {
    majorTonic = MINOR_TO_MAJOR_RELATIVE[tonic] ?? tonic;
  }

  const accInfo = MAJOR_KEY_ACCIDENTALS[majorTonic] ?? {};
  const numSharps = accInfo.sharps ?? 0;
  const numFlats = accInfo.flats ?? 0;

  if (numSharps > 0) {
    const accidentals = SHARP_ORDER.slice(0, numSharps).map((n) => `${n}#`);
    return { tonic, mode, accidentals, numAccidentals: numSharps, accidentalType: "sharp" };
  }
  if (numFlats > 0) {
    const accidentals = FLAT_ORDER.slice(0, numFlats).map((n) => `${n}b`);
    return { tonic, mode, accidentals, numAccidentals: numFlats, accidentalType: "flat" };
  }
  return { tonic, mode, accidentals: [], numAccidentals: 0, accidentalType: "none" };
}

export function getRelativeKey(tonic: string, mode: KeyMode): { tonic: string; mode: KeyMode } {
  if (mode === "major") {
    const entry = Object.entries(MINOR_TO_MAJOR_RELATIVE).find(([, maj]) => maj === tonic);
    return entry ? { tonic: entry[0], mode: "minor" } : { tonic, mode: "minor" };
  } else {
    const major = MINOR_TO_MAJOR_RELATIVE[tonic];
    return major ? { tonic: major, mode: "major" } : { tonic, mode: "major" };
  }
}

export const ALL_MAJOR_KEYS = Object.keys(MAJOR_KEY_ACCIDENTALS);
export const ALL_MINOR_KEYS = Object.keys(MINOR_TO_MAJOR_RELATIVE);

export function randomMajorKey(): string {
  return ALL_MAJOR_KEYS[Math.floor(Math.random() * ALL_MAJOR_KEYS.length)];
}

export function randomMinorKey(): string {
  return ALL_MINOR_KEYS[Math.floor(Math.random() * ALL_MINOR_KEYS.length)];
}
