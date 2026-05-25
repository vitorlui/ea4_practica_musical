import { describe, it, expect } from "vitest";
import { buildScale, noteToSpanish } from "../theory/scales";

describe("buildScale - major", () => {
  it("C major has no accidentals", () => {
    const notes = buildScale("C", "major");
    expect(notes.map((n) => n.name + n.accidental)).toEqual(["C", "D", "E", "F", "G", "A", "B", "C"]);
  });

  it("G major has F#", () => {
    const notes = buildScale("G", "major");
    const noteStrs = notes.map((n) => n.name + n.accidental);
    expect(noteStrs).toContain("F#");
    expect(noteStrs[0]).toBe("G");
  });

  it("F major has Bb", () => {
    const notes = buildScale("F", "major");
    const noteStrs = notes.map((n) => n.name + n.accidental);
    expect(noteStrs).toContain("Bb");
  });

  it("D major has 2 sharps: F# and C#", () => {
    const notes = buildScale("D", "major");
    const noteStrs = notes.map((n) => n.name + n.accidental);
    expect(noteStrs).toContain("F#");
    expect(noteStrs).toContain("C#");
  });

  it("scale has 8 notes (tonic repeated at octave)", () => {
    const notes = buildScale("C", "major");
    expect(notes.length).toBe(8);
    expect(notes[0].name).toBe(notes[7].name);
  });
});

describe("buildScale - natural minor", () => {
  it("A natural minor has no accidentals", () => {
    const notes = buildScale("A", "natural_minor");
    expect(notes.map((n) => n.name + n.accidental)).toEqual(["A", "B", "C", "D", "E", "F", "G", "A"]);
  });

  it("E natural minor has F#", () => {
    const notes = buildScale("E", "natural_minor");
    const noteStrs = notes.map((n) => n.name + n.accidental);
    expect(noteStrs).toContain("F#");
  });
});

describe("buildScale - harmonic minor", () => {
  it("A harmonic minor raises 7th (G#)", () => {
    const notes = buildScale("A", "harmonic_minor");
    const noteStrs = notes.map((n) => n.name + n.accidental);
    expect(noteStrs).toContain("G#");
    expect(noteStrs).not.toContain("G");
  });
});

describe("noteToSpanish", () => {
  it("C → Do", () => {
    expect(noteToSpanish({ name: "C", accidental: "", octave: 4 })).toBe("Do");
  });
  it("F# → Fa♯", () => {
    expect(noteToSpanish({ name: "F", accidental: "#", octave: 4 })).toBe("Fa♯");
  });
  it("Bb → Si♭", () => {
    expect(noteToSpanish({ name: "B", accidental: "b", octave: 4 })).toBe("Si♭");
  });
});
