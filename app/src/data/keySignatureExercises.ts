import type { KeyMode } from "../theory/types";

export interface KeySignatureExercise {
  id: string;
  tonic: string;
  mode: KeyMode;
  label: string;
  numAccidentals: number;
  accidentalType: "sharp" | "flat" | "none";
}

export const KEY_SIGNATURE_EXERCISES: KeySignatureExercise[] = [
  { id: "ks_C_maj", tonic: "C", mode: "major", label: "Do mayor", numAccidentals: 0, accidentalType: "none" },
  { id: "ks_G_maj", tonic: "G", mode: "major", label: "Sol mayor", numAccidentals: 1, accidentalType: "sharp" },
  { id: "ks_D_maj", tonic: "D", mode: "major", label: "Re mayor", numAccidentals: 2, accidentalType: "sharp" },
  { id: "ks_A_maj", tonic: "A", mode: "major", label: "La mayor", numAccidentals: 3, accidentalType: "sharp" },
  { id: "ks_E_maj", tonic: "E", mode: "major", label: "Mi mayor", numAccidentals: 4, accidentalType: "sharp" },
  { id: "ks_F_maj", tonic: "F", mode: "major", label: "Fa mayor", numAccidentals: 1, accidentalType: "flat" },
  { id: "ks_Bb_maj", tonic: "Bb", mode: "major", label: "Si♭ mayor", numAccidentals: 2, accidentalType: "flat" },
  { id: "ks_Eb_maj", tonic: "Eb", mode: "major", label: "Mi♭ mayor", numAccidentals: 3, accidentalType: "flat" },
  { id: "ks_Ab_maj", tonic: "Ab", mode: "major", label: "La♭ mayor", numAccidentals: 4, accidentalType: "flat" },
  { id: "ks_A_min", tonic: "A", mode: "minor", label: "La menor", numAccidentals: 0, accidentalType: "none" },
  { id: "ks_E_min", tonic: "E", mode: "minor", label: "Mi menor", numAccidentals: 1, accidentalType: "sharp" },
  { id: "ks_B_min", tonic: "B", mode: "minor", label: "Si menor", numAccidentals: 2, accidentalType: "sharp" },
  { id: "ks_D_min", tonic: "D", mode: "minor", label: "Re menor", numAccidentals: 1, accidentalType: "flat" },
  { id: "ks_G_min", tonic: "G", mode: "minor", label: "Sol menor", numAccidentals: 2, accidentalType: "flat" },
  { id: "ks_C_min", tonic: "C", mode: "minor", label: "Do menor", numAccidentals: 3, accidentalType: "flat" },
];

export function randomKeySignatureExercise(): KeySignatureExercise {
  return KEY_SIGNATURE_EXERCISES[Math.floor(Math.random() * KEY_SIGNATURE_EXERCISES.length)];
}
