import type { Note, NoteName, Accidental, Octave } from "./types";

const DIATONIC_NAMES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const DIATONIC_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

function accidentalToSemitones(acc: Accidental): number {
  if (acc === "#") return 1;
  if (acc === "b") return -1;
  if (acc === "##") return 2;
  if (acc === "bb") return -2;
  return 0;
}

function noteToSemitones(note: Note): number {
  const idx = DIATONIC_NAMES.indexOf(note.name);
  return note.octave * 12 + DIATONIC_SEMITONES[idx] + accidentalToSemitones(note.accidental);
}

function semitoneToAccidental(diff: number): Accidental {
  if (diff === 0) return "";
  if (diff === 1) return "#";
  if (diff === -1) return "b";
  if (diff === 2) return "##";
  if (diff === -2) return "bb";
  return "";
}

export function transposeNote(note: Note, semitones: number, preferFlats = false): Note {
  const absoluteSemitone = noteToSemitones(note) + semitones;
  const octave = Math.floor(absoluteSemitone / 12) as Octave;
  const semitoneInOctave = ((absoluteSemitone % 12) + 12) % 12;

  // Find the closest diatonic note
  // Try to preserve diatonic distance (interval)
  const currentDiatonicIdx = DIATONIC_NAMES.indexOf(note.name);
  const diatonicSteps = Math.round(semitones / 12 * 7); // approximate diatonic distance
  const targetDiatonicIdx = ((currentDiatonicIdx + diatonicSteps) % 7 + 7) % 7;
  const targetDiatonicSemitone = DIATONIC_SEMITONES[targetDiatonicIdx];

  let diff = semitoneInOctave - targetDiatonicSemitone;
  // Normalize diff
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;

  const newName = DIATONIC_NAMES[targetDiatonicIdx];
  let accidental = semitoneToAccidental(diff);

  // If result has triple accidental (not representable), try adjacent diatonic note
  if (Math.abs(diff) > 2) {
    // Fall back to chromatic approach
    const chromatic = preferFlats
      ? ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
      : ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const chrStr = chromatic[semitoneInOctave];
    const name = chrStr[0] as NoteName;
    const acc = (chrStr.slice(1) as Accidental) || "";
    return { name, accidental: acc, octave };
  }

  return { name: newName, accidental, octave };
}

// Instrument transposition intervals (in semitones, diatonically)
export const INSTRUMENT_TRANSPOSITIONS: Record<string, { semitones: number; label: string }> = {
  "Bb_clarinet": { semitones: -2, label: "Clarinete en Si♭ (2ª mayor descendente)" },
  "Bb_trumpet": { semitones: -2, label: "Trompeta en Si♭ (2ª mayor descendente)" },
  "A_clarinet": { semitones: -3, label: "Clarinete en La (3ª menor descendente)" },
  "F_horn": { semitones: -7, label: "Trompa en Fa (5ª justa descendente)" },
  "Eb_alto_sax": { semitones: -9, label: "Saxofón Alto en Mi♭ (6ª mayor descendente)" },
  "Bb_tenor_sax": { semitones: -14, label: "Saxofón Tenor en Si♭ (9ª mayor descendente)" },
};

export function transposeNotes(notes: Note[], semitones: number, preferFlats = false): Note[] {
  return notes.map((n) => transposeNote(n, semitones, preferFlats));
}
