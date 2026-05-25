import type { MeasureData } from "../components/music/MultiMeasureRenderer";
import type { VexNote } from "../components/music/VexFlowRenderer";

const BEAT_STRENGTH_MAP: Record<number, string[]> = {
  2: ["F", "D"],
  3: ["F", "D", "D"],
  4: ["F", "D", "SF", "D"],
};

const BEAT_STRENGTH_COLOR: Record<string, string> = {
  F:  "#1d4ed8",
  SF: "#7c3aed",
  D:  "#6b7280",
  d:  "#cbd5e1",
};

function noteDurationInBeats(n: VexNote): number {
  const durs: Record<string, number> = { "16": 0.25, "8": 0.5, "q": 1, "h": 2, "w": 4 };
  let beats = durs[n.duration] ?? 1;
  if (n.dots === 1) beats *= 1.5;
  return beats;
}

function getBeatLabel(
  pos: number,
  dur: number,
  numBeats: number,
): { label: string; color: string } {
  const EPS = 0.02;
  const strengths = BEAT_STRENGTH_MAP[numBeats] ?? ["F"];

  // Starts exactly on a main beat
  for (let b = 0; b < numBeats; b++) {
    if (Math.abs(pos - b) < EPS) {
      const lbl = strengths[b];
      return { label: lbl, color: BEAT_STRENGTH_COLOR[lbl] };
    }
  }

  // Spans over a main beat (síncopa: off-beat note that crosses a strong beat)
  for (let b = 1; b < numBeats; b++) {
    if (pos < b - EPS && pos + dur > b + EPS) {
      const lbl = strengths[b];
      return { label: lbl, color: BEAT_STRENGTH_COLOR[lbl] };
    }
  }

  // Half-beat subdivision ("and" positions)
  for (let b = 0; b < numBeats; b++) {
    if (Math.abs(pos - (b + 0.5)) < EPS) {
      return { label: "d", color: BEAT_STRENGTH_COLOR["d"] };
    }
  }

  // 16th-note subdivisions
  for (let b = 0; b < numBeats; b++) {
    for (const frac of [0.25, 0.75]) {
      if (Math.abs(pos - (b + frac)) < EPS) {
        return { label: "d", color: BEAT_STRENGTH_COLOR["d"] };
      }
    }
  }

  return { label: "", color: "" };
}

export function addBeatStrengths(measures: MeasureData[], timeSignature: string): MeasureData[] {
  const [numStr] = timeSignature.split("/");
  const numBeats = parseInt(numStr ?? "4");

  return measures.map((m) => {
    let pos = 0;
    const notes = m.notes.map((n) => {
      const dur = noteDurationInBeats(n);
      const { label, color } = getBeatLabel(pos, dur, numBeats);
      pos += dur;
      if (!label) return n;
      return { ...n, bottomAnnotations: [label], bottomAnnotationColors: [color] };
    });
    return { ...m, notes };
  });
}
