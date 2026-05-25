import type { VexNote } from "../components/music/VexFlowRenderer";

export interface SyncopationExercise {
  id: string;
  title: string;
  timeSignature: string;
  keySignature: string;
  notes: VexNote[];
  // beatPosition → BeatType for each note
  beatTypes: ("normal" | "sincopa" | "contratiempo" | "silencio")[];
}

// Pre-composed exercises for 2/4, 3/4, 4/4
export const SYNCOPATION_EXERCISES: SyncopationExercise[] = [
  {
    id: "sync_24_1",
    title: "Síncopa en 2/4",
    timeSignature: "2/4",
    keySignature: "C",
    notes: [
      { keys: ["c/4"], duration: "8" },
      { keys: ["d/4"], duration: "q" },
      { keys: ["e/4"], duration: "8" },
    ],
    beatTypes: ["normal", "sincopa", "normal"],
  },
  {
    id: "sync_34_1",
    title: "Síncopa en 3/4",
    timeSignature: "3/4",
    keySignature: "G",
    notes: [
      { keys: ["g/4"], duration: "q" },
      { keys: ["a/4"], duration: "8" },
      { keys: ["b/4"], duration: "q" },
      { keys: ["g/4"], duration: "8" },
    ],
    beatTypes: ["normal", "contratiempo", "sincopa", "normal"],
  },
  {
    id: "sync_44_1",
    title: "Síncopas en 4/4",
    timeSignature: "4/4",
    keySignature: "C",
    notes: [
      { keys: ["c/4"], duration: "q" },
      { keys: ["d/4"], duration: "8" },
      { keys: ["e/4"], duration: "q" },
      { keys: ["d/4"], duration: "8" },
      { keys: ["c/4"], duration: "q" },
    ],
    beatTypes: ["normal", "contratiempo", "sincopa", "contratiempo", "normal"],
  },
  {
    id: "sync_24_2",
    title: "Contratiempo en 2/4",
    timeSignature: "2/4",
    keySignature: "F",
    notes: [
      { keys: ["b/4"], duration: "8", isRest: true },
      { keys: ["c/5"], duration: "8" },
      { keys: ["a/4"], duration: "8", isRest: true },
      { keys: ["f/4"], duration: "8" },
    ],
    beatTypes: ["silencio", "contratiempo", "silencio", "contratiempo"],
  },
  {
    id: "sync_34_2",
    title: "Síncopa larga en 3/4",
    timeSignature: "3/4",
    keySignature: "D",
    notes: [
      { keys: ["d/4"], duration: "8" },
      { keys: ["e/4"], duration: "h" },
      { keys: ["f#/4"], duration: "8" },
    ],
    beatTypes: ["contratiempo", "sincopa", "contratiempo"],
  },
];

export function randomSyncopationExercise(): SyncopationExercise {
  return SYNCOPATION_EXERCISES[Math.floor(Math.random() * SYNCOPATION_EXERCISES.length)];
}
