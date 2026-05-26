export type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "" | "#" | "b" | "##" | "bb";
export type Octave = 2 | 3 | 4 | 5 | 6;

export interface Note {
  name: NoteName;
  accidental: Accidental;
  octave: Octave;
}

export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type IntervalQuality =
  | "justa"
  | "mayor"
  | "menor"
  | "aumentada"
  | "disminuida";

export interface IntervalResult {
  number: IntervalNumber;
  quality: IntervalQuality;
  semitones: number;
  label: string;
}

export type Duration = "w" | "h" | "q" | "8" | "16";
export type BeatType = "normal" | "sincopa" | "contratiempo" | "silencio";

export interface RhythmicFigure {
  duration: Duration;
  dots: 0 | 1;
  isRest: boolean;
  semitones?: number;
}

export interface Meter {
  numerator: number;
  denominator: number;
}

export interface RhythmicAnnotation {
  figureIndex: number;
  label: string;
  color: "correct" | "incorrect" | "missing" | "solution";
}

export interface RhythmicEvent {
  figure: RhythmicFigure;
  beatPosition: number;
  annotation?: BeatType;
}

export interface MeasureData {
  meter: Meter;
  events: RhythmicEvent[];
  clef?: "treble" | "bass";
}

export interface StaffData {
  measures: MeasureData[];
  title?: string;
}

export type ScaleType = "major" | "natural_minor" | "harmonic_minor";
export type KeyMode = "major" | "minor";

export interface KeySignature {
  tonic: string;
  mode: KeyMode;
  accidentals: string[];
  numAccidentals: number;
  accidentalType: "sharp" | "flat" | "none";
}

export interface ScaleExercise {
  tonic: string;
  mode: KeyMode;
  scaleType: ScaleType;
  notes: Note[];
}

export interface TransportConfig {
  count: number;       // 1–3 transpositions to show, default 2
  keys: string[];      // empty = any source key; e.g. ["C", "G"]
  intervals: string[]; // empty = use defaults; e.g. ["2ª major ↑", "3ª major ↓"]
}

export interface SyncopaConfig {
  meters: string[];    // empty = any; "2/4" | "3/4" | "4/4"
}

export interface IntervalsConfig {
  qualities: string[]; // empty = any; "justa" | "mayor" | "menor" | "aumentada" | "disminuida"
}

export interface ScalesConfig {
  modes: string[];     // empty = any; "major" | "minor"
  scaleTypes: string[]; // empty = any; "major" | "natural_minor" | "harmonic_minor"
}

export interface KeySigConfig {
  modes: string[];          // empty = any; "major" | "minor"
  accidentalTypes: string[]; // empty = any; "sharp" | "flat" | "none"
}

export interface EnarmoniaConfig {
  accidentalTypes: string[]; // empty = any; "sharp" | "flat" | "natural"
}

export interface AcordesConfig {
  modes: string[]; // empty = any; "major" | "minor"
}

export interface SemitonosConfig {
  types: string[]; // empty = any; "diatonic" | "chromatic"
}

export interface ExamConfig {
  exerciseCounts: Record<string, number>;
  title: string;
  date: string;
  studentName: string;
  transportConfig?: TransportConfig;
  syncopaConfig?: SyncopaConfig;
  intervalsConfig?: IntervalsConfig;
  scalesConfig?: ScalesConfig;
  keySigConfig?: KeySigConfig;
  enarmoniaConfig?: EnarmoniaConfig;
  acordesConfig?: AcordesConfig;
  semitonosConfig?: SemitonosConfig;
}

export type ExamExerciseType =
  | "sincopa"
  | "transporte"
  | "compas_tonalidad"
  | "intervalos"
  | "completar_compas"
  | "escalas"
  | "armadura"
  | "notas_extranyas"
  | "enarmonia"
  | "acordes"
  | "semitonos";

export interface ExamExercise {
  type: ExamExerciseType;
  number: number;
  title: string;
  instructions: string;
  data: unknown;
  solution: unknown;
}

export interface ExamData {
  config: ExamConfig;
  exercises: ExamExercise[];
  generatedAt: string;
}

export const NOTE_NAMES_ES: Record<NoteName, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

export const NOTE_NAMES_FROM_ES: Record<string, NoteName> = {
  Do: "C",
  Re: "D",
  Mi: "E",
  Fa: "F",
  Sol: "G",
  La: "A",
  Si: "B",
};
