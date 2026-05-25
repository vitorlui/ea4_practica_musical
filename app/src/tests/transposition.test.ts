import { describe, it, expect } from "vitest";
import { transposeNote, transposeNotes } from "../theory/transposition";
import type { Note } from "../theory/types";

function note(name: "C"|"D"|"E"|"F"|"G"|"A"|"B", acc: ""|"#"|"b"|"##"|"bb", oct: 4|5): Note {
  return { name, accidental: acc, octave: oct };
}

describe("transposeNote", () => {
  it("C4 up 2 semitones → D4", () => {
    const r = transposeNote(note("C", "", 4), 2);
    expect(r.name).toBe("D");
    expect(r.accidental).toBe("");
    expect(r.octave).toBe(4);
  });

  it("C4 up 1 semitone → C#4 (or Db4 with flats)", () => {
    const r = transposeNote(note("C", "", 4), 1);
    expect(r.octave).toBe(4);
    // Should have an accidental
    expect(r.accidental).not.toBe("");
  });

  it("B4 up 1 semitone → C5", () => {
    const r = transposeNote(note("B", "", 4), 1);
    expect(r.name).toBe("C");
    expect(r.octave).toBe(5);
  });

  it("D4 down 2 semitones → C4", () => {
    const r = transposeNote(note("D", "", 4), -2);
    expect(r.name).toBe("C");
    expect(r.octave).toBe(4);
  });

  it("G4 up 5 semitones → C5", () => {
    const r = transposeNote(note("G", "", 4), 5);
    expect(r.name).toBe("C");
    expect(r.octave).toBe(5);
  });

  it("E4 up 2 semitones → F#4", () => {
    const r = transposeNote(note("E", "", 4), 2);
    expect(r.name).toBe("F");
    expect(r.accidental).toBe("#");
  });
});

describe("transposeNotes", () => {
  it("transposes array of notes by same interval", () => {
    const notes: Note[] = [note("C", "", 4), note("E", "", 4), note("G", "", 4)];
    const result = transposeNotes(notes, 2);
    expect(result[0].name).toBe("D");
    expect(result[1].name).toBe("F");
    expect(result[2].name).toBe("A");
  });
});
