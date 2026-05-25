import { describe, it, expect } from "vitest";
import { figureDuration, measureTotalBeats, classifyBeat, validateMeasure, correspondingSimpleCompound } from "../theory/rhythm";
import type { RhythmicFigure, Meter, RhythmicEvent } from "../theory/types";

const q: RhythmicFigure = { duration: "q", dots: 0, isRest: false };
const h: RhythmicFigure = { duration: "h", dots: 0, isRest: false };
const e: RhythmicFigure = { duration: "8", dots: 0, isRest: false };
const eq: RhythmicFigure = { duration: "q", dots: 0, isRest: true };
const dh: RhythmicFigure = { duration: "h", dots: 1, isRest: false };

const m24: Meter = { numerator: 2, denominator: 4 };
const m34: Meter = { numerator: 3, denominator: 4 };
const m44: Meter = { numerator: 4, denominator: 4 };
const m68: Meter = { numerator: 6, denominator: 8 };

describe("figureDuration", () => {
  it("quarter = 1", () => expect(figureDuration(q)).toBe(1));
  it("half = 2", () => expect(figureDuration(h)).toBe(2));
  it("eighth = 0.5", () => expect(figureDuration(e)).toBe(0.5));
  it("dotted half = 3", () => expect(figureDuration(dh)).toBe(3));
});

describe("measureTotalBeats", () => {
  it("2/4 = 2", () => expect(measureTotalBeats(m24)).toBe(2));
  it("3/4 = 3", () => expect(measureTotalBeats(m34)).toBe(3));
  it("4/4 = 4", () => expect(measureTotalBeats(m44)).toBe(4));
  it("6/8 = 3", () => expect(measureTotalBeats(m68)).toBe(3));
});

describe("validateMeasure", () => {
  it("2 quarters fill 2/4", () => expect(validateMeasure([q, q], m24)).toBe(true));
  it("1 quarter does not fill 2/4", () => expect(validateMeasure([q], m24)).toBe(false));
  it("dotted half fills 3/4", () => expect(validateMeasure([dh], m34)).toBe(true));
});

describe("classifyBeat", () => {
  it("quarter on beat 0 is normal", () => {
    const ev: RhythmicEvent = { figure: q, beatPosition: 0 };
    expect(classifyBeat(ev, m24)).toBe("normal");
  });

  it("rest is silencio", () => {
    const ev: RhythmicEvent = { figure: eq, beatPosition: 0 };
    expect(classifyBeat(ev, m24)).toBe("silencio");
  });

  it("eighth starting on off-beat 0.5 that doesn't cross beat 1 is contratiempo", () => {
    const ev: RhythmicEvent = { figure: e, beatPosition: 0.5 };
    expect(classifyBeat(ev, m24)).toBe("contratiempo");
  });

  it("quarter starting on off-beat 0.5 crosses beat 1: sincopa", () => {
    const ev: RhythmicEvent = { figure: q, beatPosition: 0.5 };
    expect(classifyBeat(ev, m24)).toBe("sincopa");
  });
});

describe("correspondingSimpleCompound", () => {
  it("2/4 → 6/8", () => {
    const r = correspondingSimpleCompound(m24);
    expect(r).toEqual({ numerator: 6, denominator: 8 });
  });
  it("6/8 → 2/4", () => {
    const r = correspondingSimpleCompound(m68);
    expect(r).toEqual({ numerator: 2, denominator: 4 });
  });
  it("3/4 → 9/8", () => {
    const r = correspondingSimpleCompound(m34);
    expect(r).toEqual({ numerator: 9, denominator: 8 });
  });
});
