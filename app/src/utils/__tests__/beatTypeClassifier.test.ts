import { describe, it, expect } from "vitest";
import { classifyNote, classifyMeasures } from "../beatTypeClassifier";
import type { MeasureData } from "../../components/music/MultiMeasureRenderer";

describe("classifyNote", () => {
  it("eighth + eighth on beat: both normal (no mark)", () => {
    // 8@0: integer → normal; 8@0.5: prev beat = note → normal
    expect(classifyNote(0, 0.5, false, null)).toBe("normal");
    expect(classifyNote(0.5, 0.5, false, false)).toBe("normal");
  });

  it("eighth rest + eighth → silencio + contratiempo", () => {
    expect(classifyNote(0, 0.5, true, null)).toBe("silencio");
    // 8@0.5: doesn't cross beat 1 (0.5+0.5=1.0), prev beat = rest → contratiempo
    expect(classifyNote(0.5, 0.5, false, true)).toBe("contratiempo");
  });

  it("weak eighth with effectiveDur=1.0 crosses next beat → síncopa", () => {
    // 8@0.5 tied to 8@1 (same pitch): effectiveDur=1.0, 0.5+1.0=1.5 > 1.02 → síncopa
    expect(classifyNote(0.5, 1.0, false, false)).toBe("sincopa");
  });

  it("half note at beat 2 (SF position) in 4/4 → normal", () => {
    // pos=2 is an integer beat → always normal, regardless of duration
    expect(classifyNote(2, 2, false, null)).toBe("normal");
  });
});

describe("classifyMeasures", () => {
  it("eighth + eighth: no mark — both normal", () => {
    const measures: MeasureData[] = [
      {
        notes: [
          { keys: ["c/4"], duration: "8" },
          { keys: ["d/4"], duration: "8" },
          { keys: ["e/4"], duration: "q" },
          { keys: ["f/4"], duration: "q" },
        ],
      },
    ];
    const result = classifyMeasures(measures, "4/4");
    expect(result[0]).toBe("normal"); // c/4@0: integer
    expect(result[1]).toBe("normal"); // d/4@0.5: prev beat=note → not contratiempo
  });

  it("eighth rest + eighth → contratiempo", () => {
    const measures: MeasureData[] = [
      {
        notes: [
          { keys: ["b/4"], duration: "8", isRest: true },
          { keys: ["c/4"], duration: "8" },
          { keys: ["d/4"], duration: "q" },
          { keys: ["e/4"], duration: "q" },
        ],
      },
    ];
    const result = classifyMeasures(measures, "4/4");
    expect(result[0]).toBe("silencio");
    expect(result[1]).toBe("contratiempo"); // 8@0.5: prev beat=rest
  });

  it("weak eighth tied to same pitch → síncopa", () => {
    // c/4@1.5 tieToNext c/4@2: effectiveDur=1.0, 1.5+1.0=2.5 > 2.02 → síncopa
    const measures: MeasureData[] = [
      {
        notes: [
          { keys: ["c/4"], duration: "q" },
          { keys: ["c/4"], duration: "8" },
          { keys: ["c/4"], duration: "8", tieToNext: true },
          { keys: ["c/4"], duration: "8" },
        ],
      },
    ];
    const result = classifyMeasures(measures, "4/4");
    expect(result[2]).toBe("sincopa");
  });

  it("half note at beat 2 (SF) in 4/4 → normal", () => {
    const measures: MeasureData[] = [
      {
        notes: [
          { keys: ["c/4"], duration: "q" },
          { keys: ["d/4"], duration: "q" },
          { keys: ["e/4"], duration: "h" },
        ],
      },
    ];
    const result = classifyMeasures(measures, "4/4");
    expect(result[2]).toBe("normal"); // h@2: integer beat
  });

  it("cross-barline tie creates síncopa", () => {
    // 8@1.5_tieToNext in M1, M2 starts with same pitch q
    const measures: MeasureData[] = [
      {
        notes: [
          { keys: ["g/4"], duration: "8" },
          { keys: ["a/4"], duration: "q" },
          { keys: ["g/4"], duration: "8", tieToNext: true }, // g/4@1.5 → ties to M2[0]
        ],
      },
      {
        notes: [
          { keys: ["g/4"], duration: "q" }, // same pitch → effectiveDur=0.5+1=1.5
          { keys: ["f/4"], duration: "q" },
        ],
      },
    ];
    const result = classifyMeasures(measures, "2/4");
    // g/4@1.5: effectiveDur=1.5, nextBeat=2, 1.5+1.5=3.0>2.02 → síncopa
    expect(result[2]).toBe("sincopa");
    // g/4@0 in M2: integer beat → normal
    expect(result[3]).toBe("normal");
  });

  it("note after síncopa is normal (beat covered, not a rest)", () => {
    // q@0.5 síncopa, then 8@1.5: beat 1 covered by q → null prevBeatIsRest → normal
    const measures: MeasureData[] = [
      {
        notes: [
          { keys: ["c/4"], duration: "8" },
          { keys: ["d/4"], duration: "q" }, // síncopa: crosses beat 1
          { keys: ["c/4"], duration: "8" }, // pos=1.5, prev beat covered → normal
          { keys: ["b/3"], duration: "q" },
        ],
      },
    ];
    const result = classifyMeasures(measures, "2/4");
    expect(result[1]).toBe("sincopa");
    expect(result[2]).toBe("normal"); // NOT contratiempo
  });
});
