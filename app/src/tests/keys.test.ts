import { describe, it, expect } from "vitest";
import { getKeySignature, getRelativeKey } from "../theory/keys";

describe("getKeySignature", () => {
  it("C major has no accidentals", () => {
    const ks = getKeySignature("C", "major");
    expect(ks.numAccidentals).toBe(0);
    expect(ks.accidentalType).toBe("none");
    expect(ks.accidentals).toEqual([]);
  });

  it("G major has 1 sharp (F#)", () => {
    const ks = getKeySignature("G", "major");
    expect(ks.numAccidentals).toBe(1);
    expect(ks.accidentalType).toBe("sharp");
    expect(ks.accidentals).toEqual(["F#"]);
  });

  it("D major has 2 sharps (F#, C#)", () => {
    const ks = getKeySignature("D", "major");
    expect(ks.accidentals).toEqual(["F#", "C#"]);
  });

  it("F major has 1 flat (Bb)", () => {
    const ks = getKeySignature("F", "major");
    expect(ks.numAccidentals).toBe(1);
    expect(ks.accidentalType).toBe("flat");
    expect(ks.accidentals).toEqual(["Bb"]);
  });

  it("Bb major has 2 flats (Bb, Eb)", () => {
    const ks = getKeySignature("Bb", "major");
    expect(ks.accidentals).toEqual(["Bb", "Eb"]);
  });

  it("A minor has no accidentals (relative of C major)", () => {
    const ks = getKeySignature("A", "minor");
    expect(ks.numAccidentals).toBe(0);
    expect(ks.mode).toBe("minor");
  });

  it("E minor has 1 sharp (relative of G major)", () => {
    const ks = getKeySignature("E", "minor");
    expect(ks.numAccidentals).toBe(1);
    expect(ks.accidentalType).toBe("sharp");
  });

  it("D minor has 1 flat (relative of F major)", () => {
    const ks = getKeySignature("D", "minor");
    expect(ks.numAccidentals).toBe(1);
    expect(ks.accidentalType).toBe("flat");
  });
});

describe("getRelativeKey", () => {
  it("C major relative is A minor", () => {
    const rel = getRelativeKey("C", "major");
    expect(rel.tonic).toBe("A");
    expect(rel.mode).toBe("minor");
  });

  it("A minor relative is C major", () => {
    const rel = getRelativeKey("A", "minor");
    expect(rel.tonic).toBe("C");
    expect(rel.mode).toBe("major");
  });

  it("G major relative is E minor", () => {
    const rel = getRelativeKey("G", "major");
    expect(rel.tonic).toBe("E");
    expect(rel.mode).toBe("minor");
  });
});
