import type { ScaleType, KeyMode } from "../theory/types";

export interface ScaleExerciseConfig {
  id: string;
  tonic: string;
  mode: KeyMode;
  scaleType: ScaleType;
  label: string;
}

export const SCALE_EXERCISES: ScaleExerciseConfig[] = [
  { id: "sc_C_maj", tonic: "C", mode: "major", scaleType: "major", label: "Do mayor" },
  { id: "sc_G_maj", tonic: "G", mode: "major", scaleType: "major", label: "Sol mayor" },
  { id: "sc_D_maj", tonic: "D", mode: "major", scaleType: "major", label: "Re mayor" },
  { id: "sc_A_maj", tonic: "A", mode: "major", scaleType: "major", label: "La mayor" },
  { id: "sc_E_maj", tonic: "E", mode: "major", scaleType: "major", label: "Mi mayor" },
  { id: "sc_F_maj", tonic: "F", mode: "major", scaleType: "major", label: "Fa mayor" },
  { id: "sc_Bb_maj", tonic: "Bb", mode: "major", scaleType: "major", label: "Si♭ mayor" },
  { id: "sc_Eb_maj", tonic: "Eb", mode: "major", scaleType: "major", label: "Mi♭ mayor" },
  { id: "sc_A_nm", tonic: "A", mode: "minor", scaleType: "natural_minor", label: "La menor natural" },
  { id: "sc_E_nm", tonic: "E", mode: "minor", scaleType: "natural_minor", label: "Mi menor natural" },
  { id: "sc_D_nm", tonic: "D", mode: "minor", scaleType: "natural_minor", label: "Re menor natural" },
  { id: "sc_G_nm", tonic: "G", mode: "minor", scaleType: "natural_minor", label: "Sol menor natural" },
  { id: "sc_A_hm", tonic: "A", mode: "minor", scaleType: "harmonic_minor", label: "La menor armónica" },
  { id: "sc_E_hm", tonic: "E", mode: "minor", scaleType: "harmonic_minor", label: "Mi menor armónica" },
  { id: "sc_D_hm", tonic: "D", mode: "minor", scaleType: "harmonic_minor", label: "Re menor armónica" },
];

export function randomScaleExercise(): ScaleExerciseConfig {
  return SCALE_EXERCISES[Math.floor(Math.random() * SCALE_EXERCISES.length)];
}
