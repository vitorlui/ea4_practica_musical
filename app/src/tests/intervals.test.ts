import { describe, it, expect } from "vitest";
import { calcInterval } from "../theory/intervals";
import type { Note } from "../theory/types";

function note(name: "C"|"D"|"E"|"F"|"G"|"A"|"B", acc: ""| "#"|"b"|"##"|"bb", oct: 4|5): Note {
  return { name, accidental: acc, octave: oct };
}

describe("calcInterval", () => {
  it("C4-C4 is unísono justa", () => {
    const r = calcInterval(note("C", "", 4), note("C", "", 4));
    expect(r.number).toBe(1);
    expect(r.quality).toBe("justa");
  });

  it("C4-D4 is 2ª mayor (2 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("D", "", 4));
    expect(r.number).toBe(2);
    expect(r.quality).toBe("mayor");
    expect(r.semitones).toBe(2);
  });

  it("C4-E4 is 3ª mayor (4 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("E", "", 4));
    expect(r.number).toBe(3);
    expect(r.quality).toBe("mayor");
    expect(r.semitones).toBe(4);
  });

  it("C4-Eb4 is 3ª menor (3 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("E", "b", 4));
    expect(r.number).toBe(3);
    expect(r.quality).toBe("menor");
    expect(r.semitones).toBe(3);
  });

  it("C4-F4 is 4ª justa (5 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("F", "", 4));
    expect(r.number).toBe(4);
    expect(r.quality).toBe("justa");
    expect(r.semitones).toBe(5);
  });

  it("C4-F#4 is 4ª aumentada (6 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("F", "#", 4));
    expect(r.number).toBe(4);
    expect(r.quality).toBe("aumentada");
    expect(r.semitones).toBe(6);
  });

  it("C4-G4 is 5ª justa (7 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("G", "", 4));
    expect(r.number).toBe(5);
    expect(r.quality).toBe("justa");
    expect(r.semitones).toBe(7);
  });

  it("C4-A4 is 6ª mayor (9 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("A", "", 4));
    expect(r.number).toBe(6);
    expect(r.quality).toBe("mayor");
    expect(r.semitones).toBe(9);
  });

  it("C4-B4 is 7ª mayor (11 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("B", "", 4));
    expect(r.number).toBe(7);
    expect(r.quality).toBe("mayor");
    expect(r.semitones).toBe(11);
  });

  it("C4-C5 is 8ª justa (12 semitones)", () => {
    const r = calcInterval(note("C", "", 4), note("C", "", 5));
    expect(r.number).toBe(8);
    expect(r.quality).toBe("justa");
    expect(r.semitones).toBe(12);
  });

  it("label is formatted correctly", () => {
    const r = calcInterval(note("C", "", 4), note("G", "", 4));
    expect(r.label).toBe("5ª justa");
  });
});
