import type { Duration, RhythmicFigure, Meter, BeatType, RhythmicEvent } from "./types";

// Duration in beats (quarter note = 1 beat)
const DURATION_BEATS: Record<Duration, number> = {
  w: 4,
  h: 2,
  q: 1,
  "8": 0.5,
  "16": 0.25,
};

export function figureDuration(fig: RhythmicFigure): number {
  const base = DURATION_BEATS[fig.duration];
  return fig.dots === 1 ? base * 1.5 : base;
}

export function measureTotalBeats(meter: Meter): number {
  // denominator=4 → quarter note gets the beat; denominator=8 → eighth note gets the beat
  const beatValue = 4 / meter.denominator;
  return meter.numerator * beatValue;
}

// A syncopa: note starts on a weak beat and ties across a strong beat
// A contratiempo: note starts on an off-beat (weak part) and doesn't cross a strong beat
export function classifyBeat(
  event: RhythmicEvent,
  meter: Meter
): BeatType {
  if (event.figure.isRest) return "silencio";

  const beatPos = event.beatPosition;
  const denom = meter.denominator;

  // Strong beats in simple time (2/4, 3/4, 4/4): integer beat positions (0, 1, 2, 3)
  // Weak beats: 0.5, 1.5, etc.
  const isOnBeat = Number.isInteger(beatPos) || (denom === 8 && (beatPos * 2) % 1 === 0);
  const duration = figureDuration(event.figure);

  if (!isOnBeat) {
    // Off-beat start: check if it ties across a strong beat (sincopa)
    const nextStrongBeat = Math.ceil(beatPos);
    if (duration > nextStrongBeat - beatPos) {
      return "sincopa";
    }
    return "contratiempo";
  }

  return "normal";
}

export function validateMeasure(events: RhythmicFigure[], meter: Meter): boolean {
  const total = events.reduce((acc, fig) => acc + figureDuration(fig), 0);
  return Math.abs(total - measureTotalBeats(meter)) < 0.001;
}

export function durationLabel(fig: RhythmicFigure): string {
  const names: Record<Duration, string> = {
    w: "redonda",
    h: "blanca",
    q: "negra",
    "8": "corchea",
    "16": "semicorchea",
  };
  const base = names[fig.duration];
  const dotted = fig.dots === 1 ? " con puntillo" : "";
  const rest = fig.isRest ? " (silencio)" : "";
  return base + dotted + rest;
}

// Simple meter: denominator is 4; compound meter: denominator is 8
export function isCompoundMeter(meter: Meter): boolean {
  return meter.denominator === 8;
}

export function correspondingSimpleCompound(meter: Meter): Meter {
  if (isCompoundMeter(meter)) {
    // 6/8 → 2/4, 9/8 → 3/4, 12/8 → 4/4
    return { numerator: meter.numerator / 3, denominator: 4 };
  } else {
    // 2/4 → 6/8, 3/4 → 9/8, 4/4 → 12/8
    return { numerator: meter.numerator * 3, denominator: 8 };
  }
}
