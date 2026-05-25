import type { MeasureData } from "../components/music/MultiMeasureRenderer";

export interface SyncopationExercise {
  id: string;
  title: string;
  timeSignature: string;
  keySignature: string;
  measures: MeasureData[];
}

// Beat-type classification is computed dynamically by classifyMeasures()
// in app/src/utils/beatTypeClassifier.ts.
//
// Síncopa patterns used:
//   A) 8_tie→8 (within-measure): 8@0.5 tieToNext to 8@1 (same pitch) → effectiveDur=1.0 → S
//   B) 8d at subdivision: 8d@0.5 → effectiveDur=0.75, crosses beat 1 → S
//   C) q at subdivision: q@0.5 → effectiveDur=1.0 → S
//   D) cross-barline tie: 8@1.5 tieToNext to M_next[0] (same pitch) → S
//
// Contratiempo patterns:
//   E) 8r + 8: rest at integer beat, note at 0.5 subdivision → C
//   F) 16r + 16: rest at integer beat, 16th at 0.25/0.5 → C
//
// Each exercise: 4 measures, ≥3 síncopes, ≥3 contratiempos.
// M3→M4 always has a cross-barline tie creating one additional síncopa.

export const SYNCOPATION_EXERCISES: SyncopationExercise[] = [
  // ── 1. Síncopas en 2/4 — corxeres lligades ────────────────────────────
  // M1: [8@0(N), 8_tie@0.5(S), 8@1(N), 8@1.5(N)]        1S
  // M2: [8r(sil), 8(C), 8r(sil), 8(C)]                   2C
  // M3: [8@0(N), 8_tie@0.5(S), 8@1(N), 8_cross@1.5(S)]   2S
  // M4: [q@0(N), 8r(sil), 8@1.5(C)]                       1C
  // Total: 3S  3C
  {
    id: "sync_24_1",
    title: "Corxeres lligades en 2/4",
    timeSignature: "2/4",
    keySignature: "C",
    measures: [
      {
        notes: [
          { keys: ["c/4"], duration: "8" },                           // pos=0   → N
          { keys: ["e/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0→1.5>1)
          { keys: ["e/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["d/4"], duration: "8" },                           // pos=1.5 → N (prev=note)
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=0.5 → C (prev=rest)
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["a/4"], duration: "8" },                           // pos=1.5 → C (prev=rest)
        ],
      },
      {
        notes: [
          { keys: ["g/4"], duration: "8" },                           // pos=0   → N
          { keys: ["g/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["g/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["f/4"], duration: "8", tieToNext: true },          // pos=1.5 → S (cross-barline: eff=1.5>2)
        ],
      },
      {
        notes: [
          { keys: ["f/4"], duration: "q" },                           // pos=0   → N (tied)
          { keys: ["d/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["e/4"], duration: "8" },                           // pos=1.5 → C (prev=rest)
        ],
      },
    ],
  },

  // ── 2. Síncopas en 3/4 — corxera amb puntillo ─────────────────────────
  // M1: [8(N), 8d(S), 16(N), 8_tie@1.5(S), q@2(N)]       2S  ← within-measure tie
  // M2: [8r(sil), 8(C), 8r(sil), 8(C), q(N)]              2C
  // M3: [8r(sil), 8d(S), 16(N), 8(N), 8r(sil), 8_cross(S)] 2S
  // M4: [q(N), 8r(sil), 8(C), q(N)]                       1C
  // Total: 4S  3C
  {
    id: "sync_34_1",
    title: "Corxera amb puntillo en 3/4",
    timeSignature: "3/4",
    keySignature: "G",
    measures: [
      {
        notes: [
          { keys: ["g/4"], duration: "8" },                           // pos=0    → N
          { keys: ["a/4"], duration: "8", dots: 1 },                  // pos=0.5  → S (8d: eff=0.75→1.25>1)
          { keys: ["g/4"], duration: "16" },                          // pos=1.25 → N (covered by 8d)
          { keys: ["g/4"], duration: "8", tieToNext: true },          // pos=1.5  → S (tie: eff=1.5→3.0>2)
          { keys: ["g/4"], duration: "q" },                           // pos=2    → N (continuation)
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=0.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["b/4"], duration: "8" },                           // pos=1.5 → C
          { keys: ["g/4"], duration: "q" },                           // pos=2   → N
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0    → sil
          { keys: ["c/5"], duration: "8", dots: 1 },                  // pos=0.5  → S (8d crosses 1)
          { keys: ["b/4"], duration: "16" },                          // pos=1.25 → N
          { keys: ["g/4"], duration: "8" },                           // pos=1.5  → N
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=2    → sil
          { keys: ["c/5"], duration: "8", tieToNext: true },          // pos=2.5  → S (cross: eff=1.5>3)
        ],
      },
      {
        notes: [
          { keys: ["c/5"], duration: "q" },                           // pos=0   → N (tied)
          { keys: ["d/5"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["e/5"], duration: "8" },                           // pos=1.5 → C
          { keys: ["d/5"], duration: "q" },                           // pos=2   → N
        ],
      },
    ],
  },

  // ── 3. Síncopas en 4/4 — corxeres lligades ────────────────────────────
  // M1: [q(N), 8(N), 8_tie@1.5(S), 8@2(N), q@2.5(S), 8@3.5(N)]  2S
  // M2: [8r(sil), 8(C), 8r(sil), 8(C), 8r(sil), 8(C), q(N)]      3C
  // M3: [8(N), 8_tie@0.5(S), 8@1(N), 8@1.5(N), 8@2(N), q@2.5(S), 8_cross@3.5(S)]  3S
  // M4: [q(N), 8r(sil), 8(C), q(N), q(N)]                          1C
  // Total: 5S  4C
  {
    id: "sync_44_1",
    title: "Corxeres lligades en 4/4",
    timeSignature: "4/4",
    keySignature: "C",
    measures: [
      {
        notes: [
          { keys: ["c/4"], duration: "q" },                           // pos=0   → N
          { keys: ["c/4"], duration: "8" },                           // pos=1   → N
          { keys: ["c/4"], duration: "8", tieToNext: true },          // pos=1.5 → S (8_tie: eff=1.0→2.5>2)
          { keys: ["c/4"], duration: "8" },                           // pos=2   → N (continuation)
          { keys: ["d/4"], duration: "q" },                           // pos=2.5 → S (q crosses beat 3)
          { keys: ["c/4"], duration: "8" },                           // pos=3.5 → N (beat 3 covered)
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=0.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["a/4"], duration: "8" },                           // pos=1.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=2   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=2.5 → C
          { keys: ["b/4"], duration: "q" },                           // pos=3   → N
        ],
      },
      {
        notes: [
          { keys: ["g/4"], duration: "8" },                           // pos=0   → N
          { keys: ["g/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["g/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["f/4"], duration: "8" },                           // pos=1.5 → N (prev=note)
          { keys: ["f/4"], duration: "8" },                           // pos=2   → N
          { keys: ["g/4"], duration: "q" },                           // pos=2.5 → S (crosses 3)
          { keys: ["f/4"], duration: "8", tieToNext: true },          // pos=3.5 → S (cross: eff=1.5>4)
        ],
      },
      {
        notes: [
          { keys: ["f/4"], duration: "q" },                           // pos=0   → N (tied)
          { keys: ["e/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["f/4"], duration: "8" },                           // pos=1.5 → C
          { keys: ["g/4"], duration: "q" },                           // pos=2   → N
          { keys: ["c/4"], duration: "q" },                           // pos=3   → N
        ],
      },
    ],
  },

  // ── 4. Contratemps en 2/4 — F major ───────────────────────────────────
  // M1: [8(N), 8_tie@0.5(S), 8@1(N), 8@1.5(N)]           1S
  // M2: [8r(sil), 8(C), 8r(sil), 8(C)]                    2C
  // M3: [8(N), 8_tie@0.5(S), 8@1(N), 8_cross@1.5(S)]      2S
  // M4: [q(N), 8r(sil), 8(C)]                              1C
  // Total: 3S  3C
  {
    id: "sync_24_2",
    title: "Contratemps en 2/4",
    timeSignature: "2/4",
    keySignature: "F",
    measures: [
      {
        notes: [
          { keys: ["f/4"], duration: "8" },                           // pos=0   → N
          { keys: ["f/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["f/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["g/4"], duration: "8" },                           // pos=1.5 → N
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=0.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["bb/4"], duration: "8" },                          // pos=1.5 → C
        ],
      },
      {
        notes: [
          { keys: ["a/4"], duration: "8" },                           // pos=0   → N
          { keys: ["a/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["a/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["bb/4"], duration: "8", tieToNext: true },         // pos=1.5 → S (cross: eff=1.5>2)
        ],
      },
      {
        notes: [
          { keys: ["bb/4"], duration: "q" },                          // pos=0   → N (tied)
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=1.5 → C
        ],
      },
    ],
  },

  // ── 5. Síncopas llargues en 3/4 — D major ─────────────────────────────
  // M1: [8(N), 8d(S), 16(N), 8_tie@1.5(S), q@2(N)]        2S  ← within-measure tie
  // M2: [8r(sil), 8(C), 8r(sil), 8(C), q(N)]               2C
  // M3: [8r(sil), 8d(S), 16(N), 8(N), 8r(sil), 8_cross(S)] 2S
  // M4: [q(N), 8r(sil), 8(C), q(N)]                        1C
  // Total: 4S  3C
  {
    id: "sync_34_2",
    title: "Síncopas llargues en 3/4",
    timeSignature: "3/4",
    keySignature: "D",
    measures: [
      {
        notes: [
          { keys: ["d/4"], duration: "8" },                           // pos=0    → N
          { keys: ["e/4"], duration: "8", dots: 1 },                  // pos=0.5  → S (8d: eff=0.75→1.25>1)
          { keys: ["d/4"], duration: "16" },                          // pos=1.25 → N
          { keys: ["d/4"], duration: "8", tieToNext: true },          // pos=1.5  → S (tie: eff=1.5→3.0>2)
          { keys: ["d/4"], duration: "q" },                           // pos=2    → N (continuation)
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["a/4"], duration: "8" },                           // pos=0.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["a/4"], duration: "8" },                           // pos=1.5 → C
          { keys: ["d/4"], duration: "q" },                           // pos=2   → N
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0    → sil
          { keys: ["b/4"], duration: "8", dots: 1 },                  // pos=0.5  → S (8d crosses 1)
          { keys: ["a/4"], duration: "16" },                          // pos=1.25 → N
          { keys: ["g/4"], duration: "8" },                           // pos=1.5  → N
          { keys: ["a/4"], duration: "8", isRest: true },             // pos=2    → sil
          { keys: ["f#/4"], duration: "8", tieToNext: true },         // pos=2.5  → S (cross: eff=1.5>3)
        ],
      },
      {
        notes: [
          { keys: ["f#/4"], duration: "q" },                          // pos=0   → N (tied)
          { keys: ["e/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["f#/4"], duration: "8" },                          // pos=1.5 → C
          { keys: ["d/4"], duration: "q" },                           // pos=2   → N
        ],
      },
    ],
  },

  // ── 6. Barreja en 4/4 — G major ───────────────────────────────────────
  // M1: [8(N), 8_tie@0.5(S), 8@1(N), 8@1.5(N), 8@2(N), q@2.5(S), 8@3.5(N)]  2S
  // M2: [8r(sil), 8(C), 8r(sil), 8(C), 8r(sil), 8(C), q(N)]                   3C
  // M3: [q(N), 8r(sil), 8(C), 8@2(N), q@2.5(S), 8_cross@3.5(S)]               2S 1C
  // M4: [q(N), 8r(sil), 8(C), q(N), q(N)]                                       1C
  // Total: 4S  5C
  {
    id: "sync_44_2",
    title: "Barreja en 4/4",
    timeSignature: "4/4",
    keySignature: "G",
    measures: [
      {
        notes: [
          { keys: ["g/4"], duration: "8" },                           // pos=0   → N
          { keys: ["a/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["a/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["f#/4"], duration: "8" },                          // pos=1.5 → N (prev=note)
          { keys: ["g/4"], duration: "8" },                           // pos=2   → N
          { keys: ["a/4"], duration: "q" },                           // pos=2.5 → S (crosses 3)
          { keys: ["g/4"], duration: "8" },                           // pos=3.5 → N
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=0.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["a/4"], duration: "8" },                           // pos=1.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=2   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=2.5 → C
          { keys: ["b/4"], duration: "q" },                           // pos=3   → N
        ],
      },
      {
        notes: [
          { keys: ["g/4"], duration: "q" },                           // pos=0   → N
          { keys: ["a/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["b/4"], duration: "8" },                           // pos=1.5 → C (prev=rest)
          { keys: ["g/4"], duration: "8" },                           // pos=2   → N
          { keys: ["a/4"], duration: "q" },                           // pos=2.5 → S (crosses 3)
          { keys: ["a/4"], duration: "8", tieToNext: true },          // pos=3.5 → S (cross: eff=1.5>4)
        ],
      },
      {
        notes: [
          { keys: ["a/4"], duration: "q" },                           // pos=0   → N (tied)
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=1.5 → C
          { keys: ["b/4"], duration: "q" },                           // pos=2   → N
          { keys: ["g/4"], duration: "q" },                           // pos=3   → N
        ],
      },
    ],
  },

  // ── 7. Semicorxeres en 2/4 ────────────────────────────────────────────
  // M1: [16r(sil), 16(C), 16(C), 8@0.75(N?), q@1(N)]  → adjusted below
  // Uses 16th rest + 16th contratiempo pattern
  // M1: [8r(sil), 16@0.5(C), 16@0.75(C), q@1(N)]       2C
  // M2: [8(N), 8_tie@0.5(S), 8@1(N), 8@1.5(N)]          1S
  // M3: [8(N), 8_tie@0.5(S), 8@1(N), 8_cross@1.5(S)]    2S
  // M4: [q(N), 8r(sil), 8(C)]                             1C
  // Total: 3S  3C
  {
    id: "sync_24_3",
    title: "Semicorxeres en 2/4",
    timeSignature: "2/4",
    keySignature: "C",
    measures: [
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0    → sil
          { keys: ["c/5"], duration: "16" },                          // pos=0.5  → C (prev=rest, eff=0.25<1)
          { keys: ["d/5"], duration: "16" },                          // pos=0.75 → C (prevBeat=0=rest)
          { keys: ["e/5"], duration: "q" },                           // pos=1    → N
        ],
      },
      {
        notes: [
          { keys: ["g/4"], duration: "8" },                           // pos=0   → N
          { keys: ["g/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["g/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["a/4"], duration: "8" },                           // pos=1.5 → N
        ],
      },
      {
        notes: [
          { keys: ["f/4"], duration: "8" },                           // pos=0   → N
          { keys: ["f/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["f/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["e/4"], duration: "8", tieToNext: true },          // pos=1.5 → S (cross: eff=1.5>2)
        ],
      },
      {
        notes: [
          { keys: ["e/4"], duration: "q" },                           // pos=0   → N (tied)
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["c/5"], duration: "8" },                           // pos=1.5 → C
        ],
      },
    ],
  },

  // ── 8. Barreja en 3/4 — A major ───────────────────────────────────────
  // M1: [8(N), 8_tie@0.5(S), 8@1(N), 8@1.5(N), q@2(N)]  1S
  // M2: [8r(sil), 8(C), 8r(sil), 8(C), q(N)]              2C
  // M3: [8r(sil), 8d(S), 16(N), 8(N), 8r(sil), 8_cross(S)] 2S
  // M4: [q(N), 8r(sil), 8(C), q(N)]                        1C
  // Total: 3S  3C
  {
    id: "sync_34_3",
    title: "Barreja en 3/4",
    timeSignature: "3/4",
    keySignature: "A",
    measures: [
      {
        notes: [
          { keys: ["a/4"], duration: "8" },                           // pos=0   → N
          { keys: ["a/4"], duration: "8", tieToNext: true },          // pos=0.5 → S (8_tie: eff=1.0)
          { keys: ["a/4"], duration: "8" },                           // pos=1   → N (continuation)
          { keys: ["g#/4"], duration: "8" },                          // pos=1.5 → N
          { keys: ["a/4"], duration: "q" },                           // pos=2   → N
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0   → sil
          { keys: ["c#/5"], duration: "8" },                          // pos=0.5 → C
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=1   → sil
          { keys: ["b/4"], duration: "8" },                           // pos=1.5 → C
          { keys: ["a/4"], duration: "q" },                           // pos=2   → N
        ],
      },
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },             // pos=0    → sil
          { keys: ["e/5"], duration: "8", dots: 1 },                  // pos=0.5  → S (8d: eff=0.75→1.25>1)
          { keys: ["d/5"], duration: "16" },                          // pos=1.25 → N
          { keys: ["c#/5"], duration: "8" },                          // pos=1.5  → N
          { keys: ["d/5"], duration: "8", isRest: true },             // pos=2    → sil
          { keys: ["e/5"], duration: "8", tieToNext: true },          // pos=2.5  → S (cross: eff=1.5>3)
        ],
      },
      {
        notes: [
          { keys: ["e/5"], duration: "q" },                           // pos=0   → N (tied)
          { keys: ["c#/5"], duration: "8", isRest: true },            // pos=1   → sil
          { keys: ["d/5"], duration: "8" },                           // pos=1.5 → C
          { keys: ["c#/5"], duration: "q" },                          // pos=2   → N
        ],
      },
    ],
  },
];

export function randomSyncopationExercise(): SyncopationExercise {
  return SYNCOPATION_EXERCISES[Math.floor(Math.random() * SYNCOPATION_EXERCISES.length)];
}
