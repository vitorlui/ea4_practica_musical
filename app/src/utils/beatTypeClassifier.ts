import type { MeasureData } from "../components/music/MultiMeasureRenderer";

export type BeatType = "normal" | "sincopa" | "contratiempo" | "silencio";

const EPS = 0.02;

function durationInBeats(duration: string, dots: number = 0): number {
  const base: Record<string, number> = { "16": 0.25, "8": 0.5, q: 1, h: 2, w: 4 };
  let beats = base[duration] ?? 1;
  if (dots === 1) beats *= 1.5;
  return beats;
}

function isAtIntegerBeat(pos: number): boolean {
  return Math.abs(pos - Math.round(pos)) < EPS;
}

/**
 * Classify a single note.
 *
 * Rules (in priority order):
 *  1. isRest                            → silencio
 *  2. pos is an integer beat            → normal
 *  3. pos + effectiveDur crosses nextBeat → sincopa  (onset at subdivision, extends past next beat)
 *  4. prevBeatIsRest === true           → contratiempo (onset at subdivision, prev beat = REST)
 *  5. otherwise                         → normal
 */
export function classifyNote(
  pos: number,
  effectiveDur: number,
  isRest: boolean,
  prevBeatIsRest: boolean | null,
): BeatType {
  if (isRest) return "silencio";
  if (isAtIntegerBeat(pos)) return "normal";
  const nextBeat = Math.ceil(pos + EPS);
  if (pos + effectiveDur > nextBeat + EPS) return "sincopa";
  if (prevBeatIsRest === true) return "contratiempo";
  return "normal";
}

/**
 * Classify every note across all measures.
 *
 * prevBeatIsRest logic:
 *  - null  → no note/rest starts at the preceding integer beat (beat is covered by an
 *            ongoing note from earlier) → treated as "not a rest" → normal
 *  - false → a sounding note starts at the preceding integer beat → normal
 *  - true  → a rest starts at the preceding integer beat → contratiempo (if no síncopa)
 */
export function classifyMeasures(
  measures: MeasureData[],
  _timeSignature: string,
): BeatType[] {
  const result: BeatType[] = [];

  for (let mIdx = 0; mIdx < measures.length; mIdx++) {
    const measure = measures[mIdx];
    const nextMeasure = measures[mIdx + 1];

    // beatOnsets: integer beat position → isRest
    const beatOnsets = new Map<number, boolean>();
    let pos = 0;
    for (const note of measure.notes) {
      if (isAtIntegerBeat(pos)) {
        beatOnsets.set(Math.round(pos), note.isRest === true);
      }
      pos += durationInBeats(note.duration, note.dots);
    }

    pos = 0;
    for (let i = 0; i < measure.notes.length; i++) {
      const note = measure.notes[i];
      const ownDur = durationInBeats(note.duration, note.dots);

      // Extend duration via tie (within-measure or cross-barline, same pitch only)
      let effectiveDur = ownDur;
      if (note.tieToNext && !note.isRest) {
        const nextNote =
          i < measure.notes.length - 1
            ? measure.notes[i + 1]
            : nextMeasure?.notes?.[0];
        if (
          nextNote &&
          !nextNote.isRest &&
          nextNote.keys[0] === note.keys[0]
        ) {
          effectiveDur += durationInBeats(nextNote.duration, nextNote.dots);
        }
      }

      let prevBeatIsRest: boolean | null = null;
      if (!isAtIntegerBeat(pos)) {
        const prevBeat = Math.floor(pos + EPS);
        const entry = beatOnsets.get(prevBeat);
        if (entry !== undefined) prevBeatIsRest = entry;
      }

      result.push(classifyNote(pos, effectiveDur, note.isRest === true, prevBeatIsRest));
      pos += ownDur;
    }
  }

  return result;
}
