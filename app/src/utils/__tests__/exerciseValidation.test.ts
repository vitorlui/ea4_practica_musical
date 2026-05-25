import { describe, it, expect } from "vitest";
import { SYNCOPATION_EXERCISES } from "../../data/syncopationExercises";
import { classifyMeasures } from "../beatTypeClassifier";

describe("all exercises have ≥3 síncopes and ≥3 contratiempos", () => {
  for (const ex of SYNCOPATION_EXERCISES) {
    it(ex.id, () => {
      const types = classifyMeasures(ex.measures, ex.timeSignature);
      const s = types.filter((t) => t === "sincopa").length;
      const c = types.filter((t) => t === "contratiempo").length;
      expect(s, `${ex.id}: only ${s} síncopes`).toBeGreaterThanOrEqual(3);
      expect(c, `${ex.id}: only ${c} contratiempos`).toBeGreaterThanOrEqual(3);
    });
  }
});
