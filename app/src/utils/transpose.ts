import type { MeasureData } from "../components/music/MultiMeasureRenderer";
import type { VexNote } from "../components/music/VexFlowRenderer";

export interface TransportInterval {
  label: string;
  degrees: number;    // diatonic letter shift: 1 for 2nd, 2 for 3rd
  semitones: number;  // chromatic semitones (positive)
  direction: 1 | -1; // 1 = up, -1 = down
}

export const TRANSPORT_INTERVALS: TransportInterval[] = [
  { label: "2ª major superior",  degrees: 1, semitones: 2, direction:  1 },
  { label: "2ª major inferior",  degrees: 1, semitones: 2, direction: -1 },
  { label: "2ª menor superior",  degrees: 1, semitones: 1, direction:  1 },
  { label: "2ª menor inferior",  degrees: 1, semitones: 1, direction: -1 },
  { label: "3ª major superior",  degrees: 2, semitones: 4, direction:  1 },
  { label: "3ª major inferior",  degrees: 2, semitones: 4, direction: -1 },
  { label: "3ª menor superior",  degrees: 2, semitones: 3, direction:  1 },
  { label: "3ª menor inferior",  degrees: 2, semitones: 3, direction: -1 },
];

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const LETTER_ST: Record<string, number> = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const ACC_OFFSET: Record<string, number> = { "##":2, "#":1, "":0, "b":-1, "bb":-2, "n":0 };

function offsetToAcc(n: number): string {
  if (n ===  2) return "##";
  if (n ===  1) return "#";
  if (n ===  0) return "";
  if (n === -1) return "b";
  if (n === -2) return "bb";
  return "";
}

function transposeVexKey(vexKey: string, iv: TransportInterval): string {
  const m = vexKey.match(/^([a-g])(##?|bb?|b|n)?\/(\d+)$/);
  if (!m) return vexKey;

  const letter = m[1].toUpperCase();
  const acc = m[2] ?? "";
  const octave = parseInt(m[3]);

  const letterIdx = LETTERS.indexOf(letter as typeof LETTERS[number]);
  const noteSt = LETTER_ST[letter]! + (ACC_OFFSET[acc] ?? 0) + octave * 12;
  const targetSt = noteSt + iv.direction * iv.semitones;

  const rawNew = letterIdx + iv.direction * iv.degrees;
  const newLetterIdx = ((rawNew % 7) + 7) % 7;
  const newOctave = octave + Math.floor(rawNew / 7);
  const newLetter = LETTERS[newLetterIdx]!;

  const naturalSt = LETTER_ST[newLetter]! + newOctave * 12;
  return `${newLetter.toLowerCase()}${offsetToAcc(targetSt - naturalSt)}/${newOctave}`;
}

const KS_TO_VEX: Record<string, string> = {
  C:"c/4", G:"g/4", D:"d/4", A:"a/4", E:"e/4", B:"b/4",
  "F#":"f#/4", "C#":"c#/4",
  F:"f/4", Bb:"bb/4", Eb:"eb/4", Ab:"ab/4", Db:"db/4", Gb:"gb/4",
};
const VEX_TO_KS: Record<string, string> = Object.fromEntries(
  Object.entries(KS_TO_VEX).map(([k, v]) => [v, k]),
);

export function transposeKeySignature(ks: string, iv: TransportInterval): string {
  const vexKey = KS_TO_VEX[ks];
  if (!vexKey) return ks;
  return VEX_TO_KS[transposeVexKey(vexKey, iv)] ?? ks;
}

function transposeNote(note: VexNote, iv: TransportInterval): VexNote {
  if (note.isRest) return note;
  return { ...note, keys: note.keys.map(k => transposeVexKey(k, iv)), accidentals: undefined };
}

export function transposeMeasures(measures: MeasureData[], iv: TransportInterval): MeasureData[] {
  return measures.map(m => ({ ...m, notes: m.notes.map(n => transposeNote(n, iv)) }));
}
