import { SYNCOPATION_EXERCISES } from "../data/syncopationExercises";
import { classifyMeasures } from "../utils/beatTypeClassifier";
import { SCALE_EXERCISES } from "../data/scaleExercises";
import { buildScale, noteToSpanish } from "../theory/scales";
import { addBeatStrengths } from "../utils/metricLabels";
import {
  TRANSPORT_INTERVALS, transposeMeasures, transposeKeySignature,
} from "../utils/transpose";
import type {
  ExamData, ExamConfig, ExamExercise,
  TransportConfig, SyncopaConfig, IntervalsConfig, ScalesConfig, KeySigConfig,
  Note,
} from "../theory/types";
import type { MeasureData } from "../components/music/MultiMeasureRenderer";
import type { VexNote } from "../components/music/VexFlowRenderer";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterOrAll<T>(arr: T[], predicate: (x: T) => boolean): T[] {
  const filtered = arr.filter(predicate);
  return filtered.length > 0 ? filtered : arr;
}

// ── Transport: source melodies only (transpositions computed dynamically) ────
interface TransportFragment {
  measures: MeasureData[];
  keySignature: string;
  timeSignature: string;
}

const TRANSPORT_FRAGMENTS: TransportFragment[] = [
  // C major  2/4
  {
    keySignature: "C", timeSignature: "2/4",
    measures: [
      { notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }] },
      { notes: [{ keys: ["f/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }] },
      { notes: [{ keys: ["e/4"], duration: "h" }] },
    ],
  },
  // G major  3/4
  {
    keySignature: "G", timeSignature: "3/4",
    measures: [
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["b/4"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "h" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["d/5"], duration: "q" }, { keys: ["b/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "h", dots: 1 }] },
    ],
  },
  // F major  4/4
  {
    keySignature: "F", timeSignature: "4/4",
    measures: [
      { notes: [{ keys: ["f/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "h" }] },
      { notes: [{ keys: ["c/5"], duration: "q" }, { keys: ["bb/4"], duration: "q" }, { keys: ["a/4"], duration: "h" }] },
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["bb/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["f/4"], duration: "w" }] },
    ],
  },
  // Bb major  2/4
  {
    keySignature: "Bb", timeSignature: "2/4",
    measures: [
      { notes: [{ keys: ["f/4"], duration: "q" }, { keys: ["bb/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }] },
      { notes: [{ keys: ["eb/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }] },
      { notes: [{ keys: ["c/4"], duration: "h" }] },
    ],
  },
  // C major  3/4
  {
    keySignature: "C", timeSignature: "3/4",
    measures: [
      { notes: [{ keys: ["e/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["c/5"], duration: "q" }] },
      { notes: [{ keys: ["d/5"], duration: "h" }, { keys: ["b/4"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }] },
      { notes: [{ keys: ["e/4"], duration: "h", dots: 1 }] },
    ],
  },
  // G major  4/4
  {
    keySignature: "G", timeSignature: "4/4",
    measures: [
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["b/4"], duration: "h" }] },
      { notes: [{ keys: ["c/5"], duration: "q" }, { keys: ["b/4"], duration: "q" }, { keys: ["a/4"], duration: "h" }] },
      { notes: [{ keys: ["d/5"], duration: "q" }, { keys: ["b/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "w" }] },
    ],
  },
];

// ── Anàlisi Mètric-Tonal: 4-measure fragments ────────────────────────────────
// Student sees flat melody (no bar lines, no time sig).
// Solution shows bar lines + time sig + degree annotations (I IV V VII).
interface MetricTonalFragment {
  measures: MeasureData[];         // correct barred measures (solution)
  annotatedMeasures: MeasureData[]; // same + bottomAnnotations for I/IV/V/VII
  keySignature: string;
  timeSignature: string;
  meterLabel: string;
  keyLabel: string;
  tonicLabel: string;
  subdominantLabel: string;
  dominantLabel: string;
  leadingToneLabel: string;
}

const D_I  = "#1d4ed8"; // tonic    blue
const D_IV = "#16a34a"; // subdominant green
const D_V  = "#c2410c"; // dominant  orange
const D_VII = "#dc2626"; // leading tone red

function ann(label: string, color: string) {
  return { bottomAnnotations: [label], bottomAnnotationColors: [color] };
}

const METRIC_TONAL_FRAGMENTS: MetricTonalFragment[] = [
  // ── Sol major, 3/4 ───────────────────────────────────────────────────────
  {
    keySignature: "G", timeSignature: "3/4",
    meterLabel: "3/4", keyLabel: "Sol major",
    tonicLabel: "I (Tònica) = Sol", subdominantLabel: "IV (Subdominant) = Do",
    dominantLabel: "V (Dominant) = Re", leadingToneLabel: "VII (Sensible) = Fa#",
    measures: [
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["b/4"], duration: "q" }] },
      { notes: [{ keys: ["c/5"], duration: "q" }, { keys: ["d/5"], duration: "q" }, { keys: ["b/4"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["f#/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "h", dots: 1 }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["g/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["a/4"], duration: "q" },
        { keys: ["b/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["c/5"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["d/5"], duration: "q", ...ann("V", D_V) },
        { keys: ["b/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q" },
        { keys: ["f#/4"], duration: "q", ...ann("VII", D_VII) },
        { keys: ["g/4"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["g/4"], duration: "h", dots: 1, ...ann("I", D_I) }] },
    ],
  },
  // ── Re major, 2/4 ────────────────────────────────────────────────────────
  {
    keySignature: "D", timeSignature: "2/4",
    meterLabel: "2/4", keyLabel: "Re major",
    tonicLabel: "I (Tònica) = Re", subdominantLabel: "IV (Subdominant) = Sol",
    dominantLabel: "V (Dominant) = La", leadingToneLabel: "VII (Sensible) = Do#",
    measures: [
      { notes: [{ keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["f#/4"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["c#/5"], duration: "q" }] },
      { notes: [{ keys: ["d/4"], duration: "h" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["d/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["e/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["g/4"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["f#/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("V", D_V) },
        { keys: ["c#/5"], duration: "q", ...ann("VII", D_VII) },
      ]},
      { notes: [{ keys: ["d/4"], duration: "h", ...ann("I", D_I) }] },
    ],
  },
  // ── Fa major, 4/4 ────────────────────────────────────────────────────────
  {
    keySignature: "F", timeSignature: "4/4",
    meterLabel: "4/4", keyLabel: "Fa major",
    tonicLabel: "I (Tònica) = Fa", subdominantLabel: "IV (Subdominant) = Si♭",
    dominantLabel: "V (Dominant) = Do", leadingToneLabel: "VII (Sensible) = Mi",
    measures: [
      { notes: [{ keys: ["f/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["bb/4"], duration: "q" }] },
      { notes: [{ keys: ["c/5"], duration: "h" }, { keys: ["a/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["e/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }] },
      { notes: [{ keys: ["f/4"], duration: "w" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["f/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["g/4"], duration: "q" },
        { keys: ["a/4"], duration: "q" },
        { keys: ["bb/4"], duration: "q", ...ann("IV", D_IV) },
      ]},
      { notes: [
        { keys: ["c/5"], duration: "h", ...ann("V", D_V) },
        { keys: ["a/4"], duration: "q" },
        { keys: ["g/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["e/4"], duration: "q", ...ann("VII", D_VII) },
        { keys: ["f/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["g/4"], duration: "q" },
        { keys: ["a/4"], duration: "q" },
      ]},
      { notes: [{ keys: ["f/4"], duration: "w", ...ann("I", D_I) }] },
    ],
  },
  // ── La menor (harmònica), 3/4 ─────────────────────────────────────────────
  {
    keySignature: "C", timeSignature: "3/4",
    meterLabel: "3/4", keyLabel: "La menor",
    tonicLabel: "I (Tònica) = La", subdominantLabel: "IV (Subdominant) = Re",
    dominantLabel: "V (Dominant) = Mi", leadingToneLabel: "VII (Sensible) = Sol#",
    measures: [
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["b/4"], duration: "q" }, { keys: ["c/5"], duration: "q" }] },
      { notes: [{ keys: ["d/5"], duration: "q" }, { keys: ["e/5"], duration: "q" }, { keys: ["f/5"], duration: "q" }] },
      { notes: [
        { keys: ["g#/4"], duration: "q", accidentals: ["#"] },
        { keys: ["e/5"], duration: "q" },
        { keys: ["a/4"], duration: "q" },
      ]},
      { notes: [{ keys: ["a/4"], duration: "h", dots: 1 }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["b/4"], duration: "q" },
        { keys: ["c/5"], duration: "q" },
      ]},
      { notes: [
        { keys: ["d/5"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["e/5"], duration: "q", ...ann("V", D_V) },
        { keys: ["f/5"], duration: "q" },
      ]},
      { notes: [
        { keys: ["g#/4"], duration: "q", accidentals: ["#"], ...ann("VII", D_VII) },
        { keys: ["e/5"], duration: "q", ...ann("V", D_V) },
        { keys: ["a/4"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["a/4"], duration: "h", dots: 1, ...ann("I", D_I) }] },
    ],
  },
  // ── Mi menor (harmònica), 4/4 ─────────────────────────────────────────────
  {
    keySignature: "G", timeSignature: "4/4",
    meterLabel: "4/4", keyLabel: "Mi menor",
    tonicLabel: "I (Tònica) = Mi", subdominantLabel: "IV (Subdominant) = La",
    dominantLabel: "V (Dominant) = Si", leadingToneLabel: "VII (Sensible) = Re#",
    measures: [
      { notes: [{ keys: ["e/4"], duration: "q" }, { keys: ["f#/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }] },
      { notes: [{ keys: ["b/4"], duration: "h" }, { keys: ["g/4"], duration: "h" }] },
      { notes: [
        { keys: ["a/4"], duration: "q" },
        { keys: ["b/4"], duration: "q" },
        { keys: ["d#/5"], duration: "q", accidentals: ["#"] },
        { keys: ["e/5"], duration: "q" },
      ]},
      { notes: [{ keys: ["e/4"], duration: "w" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["e/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["f#/4"], duration: "q" },
        { keys: ["g/4"], duration: "q" },
        { keys: ["a/4"], duration: "q", ...ann("IV", D_IV) },
      ]},
      { notes: [
        { keys: ["b/4"], duration: "h", ...ann("V", D_V) },
        { keys: ["g/4"], duration: "h" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["b/4"], duration: "q", ...ann("V", D_V) },
        { keys: ["d#/5"], duration: "q", accidentals: ["#"], ...ann("VII", D_VII) },
        { keys: ["e/5"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["e/4"], duration: "w", ...ann("I", D_I) }] },
    ],
  },
  // ── Si♭ major, 3/4 ───────────────────────────────────────────────────────
  {
    keySignature: "Bb", timeSignature: "3/4",
    meterLabel: "3/4", keyLabel: "Si♭ major",
    tonicLabel: "I (Tònica) = Si♭", subdominantLabel: "IV (Subdominant) = Mi♭",
    dominantLabel: "V (Dominant) = Fa", leadingToneLabel: "VII (Sensible) = La",
    measures: [
      { notes: [{ keys: ["bb/4"], duration: "q" }, { keys: ["c/5"], duration: "q" }, { keys: ["d/5"], duration: "q" }] },
      { notes: [{ keys: ["eb/5"], duration: "q" }, { keys: ["f/5"], duration: "q" }, { keys: ["d/5"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["bb/4"], duration: "q" }, { keys: ["c/5"], duration: "q" }] },
      { notes: [{ keys: ["bb/4"], duration: "h", dots: 1 }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["bb/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["c/5"], duration: "q" },
        { keys: ["d/5"], duration: "q" },
      ]},
      { notes: [
        { keys: ["eb/5"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["f/5"], duration: "q", ...ann("V", D_V) },
        { keys: ["d/5"], duration: "q" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("VII", D_VII) },
        { keys: ["bb/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["c/5"], duration: "q" },
      ]},
      { notes: [{ keys: ["bb/4"], duration: "h", dots: 1, ...ann("I", D_I) }] },
    ],
  },
  // ── Do major, 4/4 ────────────────────────────────────────────────────────
  {
    keySignature: "C", timeSignature: "4/4",
    meterLabel: "4/4", keyLabel: "Do major",
    tonicLabel: "I (Tònica) = Do", subdominantLabel: "IV (Subdominant) = Fa",
    dominantLabel: "V (Dominant) = Sol", leadingToneLabel: "VII (Sensible) = Si",
    measures: [
      { notes: [{ keys: ["c/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }] },
      { notes: [{ keys: ["f/4"], duration: "h" }, { keys: ["e/4"], duration: "q" }, { keys: ["d/4"], duration: "q" }] },
      { notes: [{ keys: ["b/4"], duration: "q" }, { keys: ["c/5"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["g/4"], duration: "q" }] },
      { notes: [{ keys: ["c/4"], duration: "w" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["c/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["e/4"], duration: "q" },
        { keys: ["g/4"], duration: "q", ...ann("V", D_V) },
        { keys: ["a/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["f/4"], duration: "h", ...ann("IV", D_IV) },
        { keys: ["e/4"], duration: "q" },
        { keys: ["d/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["b/4"], duration: "q", ...ann("VII", D_VII) },
        { keys: ["c/5"], duration: "q", ...ann("I", D_I) },
        { keys: ["a/4"], duration: "q" },
        { keys: ["g/4"], duration: "q", ...ann("V", D_V) },
      ]},
      { notes: [{ keys: ["c/4"], duration: "w", ...ann("I", D_I) }] },
    ],
  },
  // ── Re menor (harmònica), 2/4 ─────────────────────────────────────────────
  {
    keySignature: "F", timeSignature: "2/4",
    meterLabel: "2/4", keyLabel: "Re menor",
    tonicLabel: "I (Tònica) = Re", subdominantLabel: "IV (Subdominant) = Sol",
    dominantLabel: "V (Dominant) = La", leadingToneLabel: "VII (Sensible) = Do#",
    measures: [
      { notes: [{ keys: ["d/4"], duration: "q" }, { keys: ["e/4"], duration: "q" }] },
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["f/4"], duration: "q" }] },
      { notes: [
        { keys: ["a/4"], duration: "q" },
        { keys: ["c#/5"], duration: "q", accidentals: ["#"] },
      ]},
      { notes: [{ keys: ["d/4"], duration: "h" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["d/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["e/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["g/4"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["f/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("V", D_V) },
        { keys: ["c#/5"], duration: "q", accidentals: ["#"], ...ann("VII", D_VII) },
      ]},
      { notes: [{ keys: ["d/4"], duration: "h", ...ann("I", D_I) }] },
    ],
  },
  // ── Sol menor (harmònica), 3/4 ────────────────────────────────────────────
  {
    keySignature: "Bb", timeSignature: "3/4",
    meterLabel: "3/4", keyLabel: "Sol menor",
    tonicLabel: "I (Tònica) = Sol", subdominantLabel: "IV (Subdominant) = Do",
    dominantLabel: "V (Dominant) = Re", leadingToneLabel: "VII (Sensible) = Fa#",
    measures: [
      { notes: [{ keys: ["g/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }, { keys: ["bb/4"], duration: "q" }] },
      { notes: [{ keys: ["c/5"], duration: "q" }, { keys: ["d/5"], duration: "q" }, { keys: ["eb/5"], duration: "q" }] },
      { notes: [
        { keys: ["f#/5"], duration: "q", accidentals: ["#"] },
        { keys: ["d/5"], duration: "q" },
        { keys: ["g/4"], duration: "q" },
      ]},
      { notes: [{ keys: ["g/4"], duration: "h", dots: 1 }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["g/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["a/4"], duration: "q" },
        { keys: ["bb/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["c/5"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["d/5"], duration: "q", ...ann("V", D_V) },
        { keys: ["eb/5"], duration: "q" },
      ]},
      { notes: [
        { keys: ["f#/5"], duration: "q", accidentals: ["#"], ...ann("VII", D_VII) },
        { keys: ["d/5"], duration: "q", ...ann("V", D_V) },
        { keys: ["g/4"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["g/4"], duration: "h", dots: 1, ...ann("I", D_I) }] },
    ],
  },
  // ── La major, 4/4 ─────────────────────────────────────────────────────────
  {
    keySignature: "A", timeSignature: "4/4",
    meterLabel: "4/4", keyLabel: "La major",
    tonicLabel: "I (Tònica) = La", subdominantLabel: "IV (Subdominant) = Re",
    dominantLabel: "V (Dominant) = Mi", leadingToneLabel: "VII (Sensible) = Sol#",
    measures: [
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["b/4"], duration: "q" }, { keys: ["c#/5"], duration: "q" }, { keys: ["d/5"], duration: "q" }] },
      { notes: [{ keys: ["e/5"], duration: "h" }, { keys: ["c#/5"], duration: "h" }] },
      { notes: [{ keys: ["d/5"], duration: "q" }, { keys: ["b/4"], duration: "q" }, { keys: ["g#/4"], duration: "q" }, { keys: ["a/4"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "w" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["b/4"], duration: "q" },
        { keys: ["c#/5"], duration: "q" },
        { keys: ["d/5"], duration: "q", ...ann("IV", D_IV) },
      ]},
      { notes: [
        { keys: ["e/5"], duration: "h", ...ann("V", D_V) },
        { keys: ["c#/5"], duration: "h" },
      ]},
      { notes: [
        { keys: ["d/5"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["b/4"], duration: "q" },
        { keys: ["g#/4"], duration: "q", ...ann("VII", D_VII) },
        { keys: ["a/4"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["a/4"], duration: "w", ...ann("I", D_I) }] },
    ],
  },
  // ── Mi major, 2/4 ─────────────────────────────────────────────────────────
  {
    keySignature: "E", timeSignature: "2/4",
    meterLabel: "2/4", keyLabel: "Mi major",
    tonicLabel: "I (Tònica) = Mi", subdominantLabel: "IV (Subdominant) = La",
    dominantLabel: "V (Dominant) = Si", leadingToneLabel: "VII (Sensible) = Re#",
    measures: [
      { notes: [{ keys: ["e/4"], duration: "q" }, { keys: ["f#/4"], duration: "q" }] },
      { notes: [{ keys: ["a/4"], duration: "q" }, { keys: ["b/4"], duration: "q" }] },
      { notes: [{ keys: ["d#/5"], duration: "q" }, { keys: ["e/5"], duration: "q" }] },
      { notes: [{ keys: ["e/4"], duration: "h" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["e/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["f#/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["b/4"], duration: "q", ...ann("V", D_V) },
      ]},
      { notes: [
        { keys: ["d#/5"], duration: "q", ...ann("VII", D_VII) },
        { keys: ["e/5"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["e/4"], duration: "h", ...ann("I", D_I) }] },
    ],
  },
  // ── Si menor (harmònica), 4/4 ─────────────────────────────────────────────
  {
    keySignature: "D", timeSignature: "4/4",
    meterLabel: "4/4", keyLabel: "Si menor",
    tonicLabel: "I (Tònica) = Si", subdominantLabel: "IV (Subdominant) = Mi",
    dominantLabel: "V (Dominant) = Fa#", leadingToneLabel: "VII (Sensible) = La#",
    measures: [
      { notes: [{ keys: ["b/4"], duration: "q" }, { keys: ["c#/5"], duration: "q" }, { keys: ["d/5"], duration: "q" }, { keys: ["e/5"], duration: "q" }] },
      { notes: [{ keys: ["f#/5"], duration: "h" }, { keys: ["d/5"], duration: "h" }] },
      { notes: [
        { keys: ["e/5"], duration: "q" },
        { keys: ["c#/5"], duration: "q" },
        { keys: ["a#/4"], duration: "q", accidentals: ["#"] },
        { keys: ["b/4"], duration: "q" },
      ]},
      { notes: [{ keys: ["b/4"], duration: "w" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["b/4"], duration: "q", ...ann("I", D_I) },
        { keys: ["c#/5"], duration: "q" },
        { keys: ["d/5"], duration: "q" },
        { keys: ["e/5"], duration: "q", ...ann("IV", D_IV) },
      ]},
      { notes: [
        { keys: ["f#/5"], duration: "h", ...ann("V", D_V) },
        { keys: ["d/5"], duration: "h" },
      ]},
      { notes: [
        { keys: ["e/5"], duration: "q", ...ann("IV", D_IV) },
        { keys: ["c#/5"], duration: "q" },
        { keys: ["a#/4"], duration: "q", accidentals: ["#"], ...ann("VII", D_VII) },
        { keys: ["b/4"], duration: "q", ...ann("I", D_I) },
      ]},
      { notes: [{ keys: ["b/4"], duration: "w", ...ann("I", D_I) }] },
    ],
  },
];

// ── Completar compàs: 6 individual staves, 2 rows × 3 columns ────────────────
// Each item shows the "given" notes (questionNotes) and the expected
// completion (completionNotes, pre-colored for the solution view).

interface CompleteMeasureItem {
  timeSignature: string;
  questionNotes: VexNote[];
  completionNotes: VexNote[];
}

const CC = "#dc2626"; // completion color (red)
function qn(dur: string, x: Partial<VexNote> = {}): VexNote { return { keys: ["b/4"], duration: dur, ...x }; }
function cn(dur: string, x: Partial<VexNote> = {}): VexNote { return { keys: ["b/4"], duration: dur, color: CC, ...x }; }

// Two interchangeable sets of 6 measures (randomly chosen per exam).
// Each questionNotes has exactly ONE figure; student fills the rest.
// Beat counts verified for each time signature.
const COMPLETE_BAR_SETS: CompleteMeasureItem[][] = [
  // ── Set A ─────────────────────────────────────────────────────────────────
  [
    // A1 · 4/4 · given: q. (=1.5 b) · completion: q.+q (=2.5 b)
    { timeSignature: "4/4",
      questionNotes:  [qn("q", { dots: 1 })],
      completionNotes:[cn("q", { dots: 1 }), cn("q")] },

    // A2 · 3/4 · given: q-rest (=1 b) · completion: q.+8 (=2 b)
    { timeSignature: "3/4",
      questionNotes:  [qn("q", { isRest: true })],
      completionNotes:[cn("q", { dots: 1 }), cn("8")] },

    // A3 · 2/4 · given: 8. (=0.75 b) · completion: 16+q (=1.25 b)
    { timeSignature: "2/4",
      questionNotes:  [qn("8", { dots: 1 })],
      completionNotes:[cn("16"), cn("q")] },

    // A4 · 6/8 · given: q (=2 eighths) · completion: 8.+16+q (=4 eighths)
    { timeSignature: "6/8",
      questionNotes:  [qn("q")],
      completionNotes:[cn("8", { dots: 1 }), cn("16"), cn("q")] },

    // A5 · 9/8 · given: q. (=3 eighths) · completion: 8+q.+q (=6 eighths)
    { timeSignature: "9/8",
      questionNotes:  [qn("q", { dots: 1 })],
      completionNotes:[cn("8"), cn("q", { dots: 1 }), cn("q")] },

    // A6 · 6/8 · given: 8-rest (=1 eighth) · completion: q.+q (=5 eighths)
    { timeSignature: "6/8",
      questionNotes:  [qn("8", { isRest: true })],
      completionNotes:[cn("q", { dots: 1 }), cn("q")] },
  ],
  // ── Set B ─────────────────────────────────────────────────────────────────
  [
    // B1 · 4/4 · given: h (=2 b) · completion: q.+8 (=2 b)
    { timeSignature: "4/4",
      questionNotes:  [qn("h")],
      completionNotes:[cn("q", { dots: 1 }), cn("8")] },

    // B2 · 3/4 · given: 8. (=0.75 b) · completion: 16+h (=2.25 b)
    { timeSignature: "3/4",
      questionNotes:  [qn("8", { dots: 1 })],
      completionNotes:[cn("16"), cn("h")] },

    // B3 · 2/4 · given: q (=1 b) · completion: 8.+16 (=1 b)
    { timeSignature: "2/4",
      questionNotes:  [qn("q")],
      completionNotes:[cn("8", { dots: 1 }), cn("16")] },

    // B4 · 6/8 · given: 8. (=1.5 eighths) · completion: 16+q+q (=4.5 eighths)
    { timeSignature: "6/8",
      questionNotes:  [qn("8", { dots: 1 })],
      completionNotes:[cn("16"), cn("q"), cn("q")] },

    // B5 · 9/8 · given: 8-rest (=1 eighth) · completion: q.+q+q. (=8 eighths)
    { timeSignature: "9/8",
      questionNotes:  [qn("8", { isRest: true })],
      completionNotes:[cn("q", { dots: 1 }), cn("q"), cn("q", { dots: 1 })] },

    // B6 · 6/8 · given: q. (=3 eighths) · completion: 8+8+8 (=3 eighths)
    { timeSignature: "6/8",
      questionNotes:  [qn("q", { dots: 1 })],
      completionNotes:[cn("8"), cn("8"), cn("8")] },
  ],
];

// ── Notes estranyes: 4-measure fragments ──────────────────────────────────────
interface NotasExtranyes {
  measures: MeasureData[];
  annotatedMeasures: MeasureData[];  // with labels (for solution)
  timeSignature: string;
  keySignature: string;
  explanations: string[];
}

const NOTAS_EXTRANYAS_FRAGMENTS: NotasExtranyes[] = [
  // ── Fragment 1: Do major, 4/4 — corcheas i semicorchees ─────────────────────
  {
    timeSignature: "4/4", keySignature: "C",
    measures: [
      // M1 · C4(q) D4(8) E4(8) G4(q) E4(q)  [4+2+2+4+4=16 ✓]
      { notes: [
        { keys: ["c/4"], duration: "q" },
        { keys: ["d/4"], duration: "8" },
        { keys: ["e/4"], duration: "8" },
        { keys: ["g/4"], duration: "q" },
        { keys: ["e/4"], duration: "q" },
      ]},
      // M2 · F4(q) E4(16) F4(16) G4(8) F4(q) A4(q)  [4+1+1+2+4+4=16 ✓]
      { notes: [
        { keys: ["f/4"], duration: "q" },
        { keys: ["e/4"], duration: "16" },
        { keys: ["f/4"], duration: "16" },
        { keys: ["g/4"], duration: "8" },
        { keys: ["f/4"], duration: "q" },
        { keys: ["a/4"], duration: "q" },
      ]},
      // M3 · G4(8) A4(16) G4(16) F4(8) E4(q) D4(8) C4(q)  [2+1+1+2+4+2+4=16 ✓]
      { notes: [
        { keys: ["g/4"], duration: "8" },
        { keys: ["a/4"], duration: "16" },
        { keys: ["g/4"], duration: "16" },
        { keys: ["f/4"], duration: "8" },
        { keys: ["e/4"], duration: "q" },
        { keys: ["d/4"], duration: "8" },
        { keys: ["c/4"], duration: "q" },
      ]},
      // M4 · D4(q) C4(hd)  [4+12=16 ✓] — A on downbeat resolving to tonic
      { notes: [
        { keys: ["d/4"], duration: "q" },
        { keys: ["c/4"], duration: "h", dots: 1 },
      ]},
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["c/4"], duration: "q" },
        { keys: ["d/4"], duration: "8", annotations: ["NP"], annotationColors: ["#dc2626"] },
        { keys: ["e/4"], duration: "8" },
        { keys: ["g/4"], duration: "q" },
        { keys: ["e/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["f/4"], duration: "q" },
        { keys: ["e/4"], duration: "16", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["f/4"], duration: "16" },
        { keys: ["g/4"], duration: "8" },
        { keys: ["f/4"], duration: "q" },
        { keys: ["a/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["g/4"], duration: "8" },
        { keys: ["a/4"], duration: "16", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["g/4"], duration: "16" },
        { keys: ["f/4"], duration: "8", annotations: ["NP"], annotationColors: ["#dc2626"] },
        { keys: ["e/4"], duration: "q" },
        { keys: ["d/4"], duration: "8" },
        { keys: ["c/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["d/4"], duration: "q", annotations: ["A"], annotationColors: ["#ea580c"] },
        { keys: ["c/4"], duration: "h", dots: 1 },
      ]},
    ],
    explanations: [
      "NP (nota de pas): Re4 (compàs 1) — connecta Do4 i Mi4 per grau conjunt ascendent",
      "B (bordadura): Mi4 (compàs 2) — grau inferior de Fa4; surt un grau i retorna immediatament",
      "B (bordadura): La4 (compàs 3) — grau superior de Sol4; surt un grau i retorna immediatament",
      "NP (nota de pas): Fa4 (compàs 3) — connecta Sol4 i Mi4 per grau conjunt descendent",
      "A (apoggiatura): Re4 (compàs 4) — cau en temps fort, un grau per sobre de Do4 (tònica); resol per grau conjunt descendent",
    ],
  },

  // ── Fragment 2: Sol major, 3/4 — semicorchees amb bordadures dobles ─────────
  {
    timeSignature: "3/4", keySignature: "G",
    measures: [
      // M1 · G4(q) A4(8) G4(8) B4(q)  [4+2+2+4=12 ✓]
      { notes: [
        { keys: ["g/4"], duration: "q" },
        { keys: ["a/4"], duration: "8" },
        { keys: ["g/4"], duration: "8" },
        { keys: ["b/4"], duration: "q" },
      ]},
      // M2 · D5(q) C5(16) D5(16) E5(8) D5(q)  [4+1+1+2+4=12 ✓]
      { notes: [
        { keys: ["d/5"], duration: "q" },
        { keys: ["c/5"], duration: "16" },
        { keys: ["d/5"], duration: "16" },
        { keys: ["e/5"], duration: "8" },
        { keys: ["d/5"], duration: "q" },
      ]},
      // M3 · B4(8) C5(16) B4(16) A4(8) G4(8) F#4(q)  [2+1+1+2+2+4=12 ✓]
      { notes: [
        { keys: ["b/4"], duration: "8" },
        { keys: ["c/5"], duration: "16" },
        { keys: ["b/4"], duration: "16" },
        { keys: ["a/4"], duration: "8" },
        { keys: ["g/4"], duration: "8" },
        { keys: ["f#/4"], duration: "q" },
      ]},
      // M4 · A4(q) G4(h) — A on downbeat resolving to tonic
      { notes: [
        { keys: ["a/4"], duration: "q" },
        { keys: ["g/4"], duration: "h" },
      ]},
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["g/4"], duration: "q" },
        { keys: ["a/4"], duration: "8", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["g/4"], duration: "8" },
        { keys: ["b/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["d/5"], duration: "q" },
        { keys: ["c/5"], duration: "16", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["d/5"], duration: "16" },
        { keys: ["e/5"], duration: "8", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["d/5"], duration: "q" },
      ]},
      { notes: [
        { keys: ["b/4"], duration: "8" },
        { keys: ["c/5"], duration: "16", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["b/4"], duration: "16" },
        { keys: ["a/4"], duration: "8", annotations: ["NP"], annotationColors: ["#dc2626"] },
        { keys: ["g/4"], duration: "8" },
        { keys: ["f#/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["a/4"], duration: "q", annotations: ["A"], annotationColors: ["#ea580c"] },
        { keys: ["g/4"], duration: "h" },
      ]},
    ],
    explanations: [
      "B (bordadura): La4 (compàs 1) — grau superior de Sol4; surt i retorna immediatament",
      "B (bordadura): Do5 (compàs 2) — grau inferior de Re5; surt i retorna immediatament",
      "B (bordadura): Mi5 (compàs 2) — grau superior de Re5; surt i retorna immediatament",
      "B (bordadura): Do5 (compàs 3) — grau superior de Si4; surt i retorna immediatament",
      "NP (nota de pas): La4 (compàs 3) — connecta Si4 i Sol4 per grau conjunt descendent",
      "A (apoggiatura): La4 (compàs 4) — cau en temps fort, un grau per sobre de Sol4 (tònica); resol per grau conjunt descendent",
    ],
  },

  // ── Fragment 3: Fa major, 4/4 — semicorchees amb doble bordadura ─────────────
  {
    timeSignature: "4/4", keySignature: "F",
    measures: [
      // M1 · F4(q) G4(8) A4(8) Bb4(q) A4(q)  [4+2+2+4+4=16 ✓]
      { notes: [
        { keys: ["f/4"], duration: "q" },
        { keys: ["g/4"], duration: "8" },
        { keys: ["a/4"], duration: "8" },
        { keys: ["bb/4"], duration: "q" },
        { keys: ["a/4"], duration: "q" },
      ]},
      // M2 · C5(h) Bb4(8) A4(8) G4(q)  [8+2+2+4=16 ✓]
      { notes: [
        { keys: ["c/5"], duration: "h" },
        { keys: ["bb/4"], duration: "8" },
        { keys: ["a/4"], duration: "8" },
        { keys: ["g/4"], duration: "q" },
      ]},
      // M3 · F4(q) G4(16) F4(16) E4(16) F4(16) A4(q) C5(q)  [4+1+1+1+1+4+4=16 ✓]
      { notes: [
        { keys: ["f/4"], duration: "q" },
        { keys: ["g/4"], duration: "16" },
        { keys: ["f/4"], duration: "16" },
        { keys: ["e/4"], duration: "16" },
        { keys: ["f/4"], duration: "16" },
        { keys: ["a/4"], duration: "q" },
        { keys: ["c/5"], duration: "q" },
      ]},
      // M4 · F4(w)
      { notes: [{ keys: ["f/4"], duration: "w" }] },
    ],
    annotatedMeasures: [
      { notes: [
        { keys: ["f/4"], duration: "q" },
        { keys: ["g/4"], duration: "8", annotations: ["NP"], annotationColors: ["#dc2626"] },
        { keys: ["a/4"], duration: "8" },
        { keys: ["bb/4"], duration: "q", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["a/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["c/5"], duration: "h" },
        { keys: ["bb/4"], duration: "8", annotations: ["NP"], annotationColors: ["#dc2626"] },
        { keys: ["a/4"], duration: "8" },
        { keys: ["g/4"], duration: "q" },
      ]},
      { notes: [
        { keys: ["f/4"], duration: "q" },
        { keys: ["g/4"], duration: "16", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["f/4"], duration: "16" },
        { keys: ["e/4"], duration: "16", annotations: ["B"], annotationColors: ["#7c3aed"] },
        { keys: ["f/4"], duration: "16" },
        { keys: ["a/4"], duration: "q" },
        { keys: ["c/5"], duration: "q" },
      ]},
      { notes: [{ keys: ["f/4"], duration: "w" }] },
    ],
    explanations: [
      "NP (nota de pas): Sol4 (compàs 1) — connecta Fa4 i La4 per grau conjunt ascendent",
      "B (bordadura): Si♭4 (compàs 1) — grau superior de La4; surt un grau i retorna immediatament",
      "NP (nota de pas): Si♭4 (compàs 2) — connecta Do5 i La4 per grau conjunt descendent",
      "B (bordadura): Sol4 (compàs 3) — grau superior de Fa4; surt un grau i retorna immediatament",
      "B (bordadura): Mi4 (compàs 3) — grau inferior de Fa4; surt un grau i retorna immediatament",
    ],
  },
];

// ── Interval sequences: 9-note chains with 8 consecutive intervals ────────────

interface NoteSeq {
  keys: string[];
  intervals: { label: string; ascending: boolean }[];
}

const INTERVAL_SEQUENCES: NoteSeq[] = [
  // Sol–La–Do–Si–Do5–Sol–Mi–La–Re  (2M↑ 6M↓ 7M↑ 2m↑ 4J↓ 3m↓ 4J↑ 5J↓)
  {
    keys: ["g/4","a/4","c/4","b/4","c/5","g/4","e/4","a/4","d/4"],
    intervals: [
      { label: "2ª major", ascending: true  },
      { label: "6ª major", ascending: false },
      { label: "7ª major", ascending: true  },
      { label: "2ª menor", ascending: true  },
      { label: "4ª justa", ascending: false },
      { label: "3ª menor", ascending: false },
      { label: "4ª justa", ascending: true  },
      { label: "5ª justa", ascending: false },
    ],
  },
  // Mi–Si–Do4–Do5–Mi4–Fa–Re5–La–Sol  (5J↑ 7M↓ 8J↑ 6m↓ 2m↑ 6M↑ 4J↓ 2M↓)
  {
    keys: ["e/4","b/4","c/4","c/5","e/4","f/4","d/5","a/4","g/4"],
    intervals: [
      { label: "5ª justa", ascending: true  },
      { label: "7ª major", ascending: false },
      { label: "8ª justa", ascending: true  },
      { label: "6ª menor", ascending: false },
      { label: "2ª menor", ascending: true  },
      { label: "6ª major", ascending: true  },
      { label: "4ª justa", ascending: false },
      { label: "2ª major", ascending: false },
    ],
  },
  // Sol–Si–Mi–La–Fa5–Mi5–Sol4–Sol5–Fa5  (3M↑ 5J↓ 4J↑ 6m↑ 2m↓ 6M↓ 8J↑ 2M↓)
  {
    keys: ["g/4","b/4","e/4","a/4","f/5","e/5","g/4","g/5","f/5"],
    intervals: [
      { label: "3ª major", ascending: true  },
      { label: "5ª justa", ascending: false },
      { label: "4ª justa", ascending: true  },
      { label: "6ª menor", ascending: true  },
      { label: "2ª menor", ascending: false },
      { label: "6ª major", ascending: false },
      { label: "8ª justa", ascending: true  },
      { label: "2ª major", ascending: false },
    ],
  },
  // Mi–Fa–Mi5–La–Si–Re4–Do5–Sol–Mi  (2m↑ 7M↑ 5J↓ 2M↑ 6M↓ 7m↑ 4J↓ 3m↓)
  {
    keys: ["e/4","f/4","e/5","a/4","b/4","d/4","c/5","g/4","e/4"],
    intervals: [
      { label: "2ª menor", ascending: true  },
      { label: "7ª major", ascending: true  },
      { label: "5ª justa", ascending: false },
      { label: "2ª major", ascending: true  },
      { label: "6ª major", ascending: false },
      { label: "7ª menor", ascending: true  },
      { label: "4ª justa", ascending: false },
      { label: "3ª menor", ascending: false },
    ],
  },
  // Do–Do5–La–Fa5–Sol4–La–Mi5–Do5–Sol  (8J↑ 3m↓ 6m↑ 7m↓ 2M↑ 5J↑ 3M↓ 4J↓)
  {
    keys: ["c/4","c/5","a/4","f/5","g/4","a/4","e/5","c/5","g/4"],
    intervals: [
      { label: "8ª justa", ascending: true  },
      { label: "3ª menor", ascending: false },
      { label: "6ª menor", ascending: true  },
      { label: "7ª menor", ascending: false },
      { label: "2ª major", ascending: true  },
      { label: "5ª justa", ascending: true  },
      { label: "3ª major", ascending: false },
      { label: "4ª justa", ascending: false },
    ],
  },
];

// ── Interval label helpers ────────────────────────────────────────────────────

const INTERVAL_SEMITONES: Record<string, number> = {
  "2ª menor": 1, "2ª major": 2,
  "3ª menor": 3, "3ª major": 4,
  "4ª justa": 5, "4ª aug":   6,
  "5ª dim":   6, "5ª justa": 7,
  "6ª menor": 8, "6ª major": 9,
  "7ª menor": 10, "7ª major": 11,
  "8ª justa": 12,
};

function tonesLabel(label: string): string {
  const st = INTERVAL_SEMITONES[label] ?? 0;
  const t = Math.floor(st / 2);
  const s = st % 2;
  if (t === 0) return `${s}ST`;
  if (s === 0) return `${t}T`;
  return `${t}T + ${s}ST`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SINCOPA_SYMBOL: Record<string, string> = {
  sincopa: ">",
  contratiempo: "+",
};
const SINCOPA_COLOR: Record<string, string> = {
  sincopa: "#7c3aed",
  contratiempo: "#ea580c",
};

function buildSyncopaAnnotatedMeasures(
  measures: MeasureData[],
  beatTypes: string[],
): MeasureData[] {
  let idx = 0;
  return measures.map((m) => ({
    ...m,
    notes: m.notes.map((n) => {
      const bt = beatTypes[idx++] ?? "normal";
      const symbol = SINCOPA_SYMBOL[bt];
      if (!symbol) return n;
      return { ...n, annotations: [symbol], annotationColors: [SINCOPA_COLOR[bt]] };
    }),
  }));
}

// ── Generators ────────────────────────────────────────────────────────────────

function generateSyncopaExercise(num: number, cfg: SyncopaConfig): ExamExercise {
  const pool = filterOrAll(SYNCOPATION_EXERCISES, f =>
    cfg.meters.length === 0 || cfg.meters.includes(f.timeSignature),
  );
  const ex = pickRandom(pool);
  const beatTypes = classifyMeasures(ex.measures, ex.timeSignature);
  // Build annotated measures: top annotations (>/+) then bottom beat-strength labels (F/D/SF)
  const withSymbols = buildSyncopaAnnotatedMeasures(ex.measures, beatTypes);
  const annotatedMeasures = addBeatStrengths(withSymbols, ex.timeSignature);
  return {
    type: "sincopa",
    number: num,
    title: "Síncopa i Contratemps",
    instructions: "Indica sobre cada figura si és: S (síncopa), C (contratemps).",
    data: { measures: ex.measures, keySignature: ex.keySignature, timeSignature: ex.timeSignature },
    solution: {
      measures: annotatedMeasures,
      keySignature: ex.keySignature,
      timeSignature: ex.timeSignature,
    },
  };
}

function generateIntervalExercise(num: number, _cfg: IntervalsConfig): ExamExercise {
  const seq = INTERVAL_SEQUENCES[Math.floor(Math.random() * INTERVAL_SEQUENCES.length)];

  const questionNotes = seq.keys.map(key => ({ keys: [key], duration: "q" }));

  const solutionNotes = seq.keys.map((key, i) => {
    if (i === 0) return { keys: [key], duration: "q" };
    const iv = seq.intervals[i - 1];
    const tLabel = tonesLabel(iv.label);
    const dirLabel = iv.ascending ? "ASC" : "DESC";
    const lines = [iv.label, tLabel, dirLabel];
    if (iv.ascending) {
      return { keys: [key], duration: "q", annotations: lines, annotationColors: ["#1d4ed8", "#1d4ed8", "#1d4ed8"] };
    } else {
      return { keys: [key], duration: "q", bottomAnnotations: lines, bottomAnnotationColors: ["#c2410c", "#c2410c", "#c2410c"] };
    }
  });

  return {
    type: "intervalos",
    number: num,
    title: "Intervals",
    instructions: "Analitza els intervals consecutius entre les notes. Escriu el nom i qualificació de cada interval.",
    data: { notes: questionNotes },
    solution: { notes: solutionNotes },
  };
}

function generateTransportExercise(num: number, tc: TransportConfig): ExamExercise {
  // Pick source fragment
  const fragPool = filterOrAll(TRANSPORT_FRAGMENTS, f =>
    tc.keys.length === 0 || tc.keys.includes(f.keySignature),
  );
  const frag = pickRandom(fragPool);

  // Pick intervals
  const ivPool = tc.intervals.length > 0
    ? TRANSPORT_INTERVALS.filter(iv => tc.intervals.includes(iv.label))
    : TRANSPORT_INTERVALS;

  const count = Math.max(1, Math.min(tc.count, ivPool.length));
  const shuffledIvs = [...ivPool].sort(() => Math.random() - 0.5).slice(0, count);

  const transpositions = shuffledIvs.map(iv => {
    const transposedKs = transposeKeySignature(frag.keySignature, iv);
    return {
      measures: transposeMeasures(frag.measures, iv),
      keySignature: transposedKs,
      timeSignature: frag.timeSignature,
      label: `${frag.keySignature} → ${transposedKs} (${iv.label})`,
    };
  });

  return {
    type: "transporte",
    number: num,
    title: "Transport",
    instructions: "Transporta la melodia a cada un dels intervals indicats.",
    data: {
      measures: frag.measures,
      keySignature: frag.keySignature,
      timeSignature: frag.timeSignature,
      intervals: shuffledIvs.map(iv => iv.label),
    },
    solution: { transpositions },
  };
}

function generateMeterKeyExercise(num: number): ExamExercise {
  const frag = pickRandom(METRIC_TONAL_FRAGMENTS);
  // Flatten all measure notes for student view (no bar lines)
  const flatNotes = frag.measures.flatMap(m => m.notes);
  return {
    type: "compas_tonalidad",
    number: num,
    title: "Anàlisi Mètric-Tonal",
    instructions: "Busca el compàs, posa les línies divisòries, indica la tonalitat i assenyala els graus tonals i la sensible.",
    data: {
      flatNotes,
      keySignature: frag.keySignature,
    },
    solution: {
      measures: frag.annotatedMeasures,
      keySignature: frag.keySignature,
      timeSignature: frag.timeSignature,
      meterLabel: frag.meterLabel,
      keyLabel: frag.keyLabel,
      tonicLabel: frag.tonicLabel,
      subdominantLabel: frag.subdominantLabel,
      dominantLabel: frag.dominantLabel,
      leadingToneLabel: frag.leadingToneLabel,
    },
  };
}

function generateCompleteBarExercise(num: number): ExamExercise {
  const set = COMPLETE_BAR_SETS[Math.floor(Math.random() * COMPLETE_BAR_SETS.length)];
  return {
    type: "completar_compas",
    number: num,
    title: "Completar compàs",
    instructions: "Completa cada compàs afegint les figures que falten. La primera figura és donada.",
    data: { items: set },
    solution: { items: set },
  };
}

// Convert Note[] from buildScale to VexNote[] with correct octave for ascending scale.
// buildScale assigns all notes octave 4 except the final tonic (octave 5).
// Here we recalculate: notes whose diatonic index is below the tonic index wrap to octave 5.
const DIATONIC_ORDER = ["C", "D", "E", "F", "G", "A", "B"];
function scaleToVexNotes(notes: Note[]): VexNote[] {
  const tonicIdx = DIATONIC_ORDER.indexOf(notes[0].name);
  return notes.map((n, i) => {
    const noteIdx = DIATONIC_ORDER.indexOf(n.name);
    const octave = (i === notes.length - 1 || noteIdx < tonicIdx) ? 5 : 4;
    return {
      keys: [`${n.name.toLowerCase()}/${octave}`],
      duration: "q",
      accidentals: n.accidental ? [n.accidental] : undefined,
    } as VexNote;
  });
}

function generateScaleExercise(num: number, cfg: ScalesConfig): ExamExercise {
  const pool = filterOrAll(SCALE_EXERCISES, f => {
    const modeOk = cfg.modes.length === 0 || cfg.modes.includes(f.mode);
    const typeOk = cfg.scaleTypes.length === 0 || cfg.scaleTypes.includes(f.scaleType);
    return modeOk && typeOk;
  });
  const config = pickRandom(pool);
  const notes = buildScale(config.tonic, config.scaleType);
  const noteNames = notes.map(noteToSpanish);
  const vexNotes = scaleToVexNotes(notes);
  return {
    type: "escalas",
    number: num,
    title: "Escala",
    instructions: `Escriu l'escala de ${config.label} en clau de Sol.`,
    data: { config, noteNames },
    solution: { type: config.scaleType, label: config.label, notes: noteNames, vexNotes },
  };
}

const KS_ITEMS = [
  { vexKey: "C",  majorLabel: "Do major",   minorLabel: "La menor",   accidentalType: "none"  as const },
  { vexKey: "G",  majorLabel: "Sol major",  minorLabel: "Mi menor",   accidentalType: "sharp" as const },
  { vexKey: "D",  majorLabel: "Re major",   minorLabel: "Si menor",   accidentalType: "sharp" as const },
  { vexKey: "A",  majorLabel: "La major",   minorLabel: "Fa# menor",  accidentalType: "sharp" as const },
  { vexKey: "E",  majorLabel: "Mi major",   minorLabel: "Do# menor",  accidentalType: "sharp" as const },
  { vexKey: "F",  majorLabel: "Fa major",   minorLabel: "Re menor",   accidentalType: "flat"  as const },
  { vexKey: "Bb", majorLabel: "Si♭ major",  minorLabel: "Sol menor",  accidentalType: "flat"  as const },
  { vexKey: "Eb", majorLabel: "Mi♭ major",  minorLabel: "Do menor",   accidentalType: "flat"  as const },
  { vexKey: "Ab", majorLabel: "La♭ major",  minorLabel: "Fa menor",   accidentalType: "flat"  as const },
];

function generateKeySignatureExercise(num: number, cfg: KeySigConfig): ExamExercise {
  const pool = cfg.accidentalTypes.length > 0
    ? KS_ITEMS.filter(x => cfg.accidentalTypes.includes(x.accidentalType))
    : KS_ITEMS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const items = shuffled.slice(0, Math.min(6, shuffled.length));
  return {
    type: "armadura",
    number: num,
    title: "Armadura",
    instructions: "Per a cada armadura, escriu el nom de la tonalitat major i la seva relativa menor.",
    data: { items },
    solution: { items },
  };
}

function generateNotasExtranyes(num: number): ExamExercise {
  const frag = NOTAS_EXTRANYAS_FRAGMENTS[Math.floor(Math.random() * NOTAS_EXTRANYAS_FRAGMENTS.length)];
  return {
    type: "notas_extranyas",
    number: num,
    title: "Notes estranyes",
    instructions: "Identifica i anomena les notes estranyes (notes de pas NP, bordadures B, etc.) del fragment.",
    data: { measures: frag.measures, timeSignature: frag.timeSignature, keySignature: frag.keySignature },
    solution: {
      measures: frag.annotatedMeasures,
      timeSignature: frag.timeSignature,
      keySignature: frag.keySignature,
      explanations: frag.explanations,
    },
  };
}

const DEFAULT_EXERCISE_ORDER = [
  "sincopa", "transporte", "compas_tonalidad", "intervalos",
  "completar_compas", "escalas", "armadura", "notas_extranyas",
];

export function generateExam(config: ExamConfig): ExamData {
  const tc: TransportConfig = config.transportConfig ?? { count: 2, keys: [], intervals: [] };
  const sc: SyncopaConfig = config.syncopaConfig ?? { meters: [] };
  const ic: IntervalsConfig = config.intervalsConfig ?? { qualities: [] };
  const scl: ScalesConfig = config.scalesConfig ?? { modes: [], scaleTypes: [] };
  const ksc: KeySigConfig = config.keySigConfig ?? { modes: [], accidentalTypes: [] };

  const exercises: ExamExercise[] = DEFAULT_EXERCISE_ORDER.map((type, i) => {
    const n = i + 1;
    switch (type) {
      case "sincopa":          return generateSyncopaExercise(n, sc);
      case "transporte":       return generateTransportExercise(n, tc);
      case "compas_tonalidad": return generateMeterKeyExercise(n);
      case "intervalos":       return generateIntervalExercise(n, ic);
      case "completar_compas": return generateCompleteBarExercise(n);
      case "escalas":          return generateScaleExercise(n, scl);
      case "armadura":         return generateKeySignatureExercise(n, ksc);
      case "notas_extranyas":  return generateNotasExtranyes(n);
      default:                 return generateNotasExtranyes(n);
    }
  });
  return { config, exercises, generatedAt: new Date().toISOString() };
}
