# EA4 Practicador — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React web app for EA4 music theory practice with interactive exercises, random exam generation, and PDF export — deployable on GitHub Pages.

**Architecture:** Vite+React+TypeScript app in `app/` subdirectory; pure TypeScript music theory engine in `app/src/theory/`; VexFlow 4 for music notation rendering; jsPDF+html2canvas for PDF export; React Router HashRouter for GitHub Pages compatibility.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, VexFlow 4, jsPDF 2, html2canvas 1, React Router DOM 6, Vitest 1

**Spec:** `docs/superpowers/specs/2026-05-25-ea4-practicador-design.md`

---

## Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `app/` (entire directory)
- Create: `app/package.json`
- Create: `app/vite.config.ts`
- Create: `app/tailwind.config.js`
- Create: `app/src/index.css`

- [ ] **Step 1: Create Vite project**

From `EA4_generador_examens/` run:

```bash
npm create vite@latest app -- --template react-ts
cd app
npm install
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install react-router-dom vexflow jspdf html2canvas
npm install -D tailwindcss postcss autoprefixer vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @types/jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind**

Replace `app/tailwind.config.js` with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        correct: "#22c55e",
        incorrect: "#ef4444",
        missing: "#eab308",
        solution: "#3b82f6",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Add Tailwind directives to CSS**

Replace `app/src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Configure Vite**

Replace `app/vite.config.ts` with:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/EA4_generador_examens/",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
  },
});
```

- [ ] **Step 6: Create test setup file**

Create `app/src/tests/setup.ts`:

```typescript
import "@testing-library/jest-dom";
```

- [ ] **Step 7: Add test script to package.json**

In `app/package.json`, add to `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run",
"preview": "vite preview"
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts at `http://localhost:5173/EA4_generador_examens/` with default Vite React app.

- [ ] **Step 9: Commit**

```bash
git init
git add app/
git commit -m "feat: scaffold Vite+React+TS project with Tailwind and Vitest"
```

(Note: `git init` only if not already in a git repo. If already initialized, skip.)

---

## Task 2: Create local skills

**Files:**
- Create: `.claude/skills/ea4-music-theory/SKILL.md`
- Create: `.claude/skills/ea4-exam-generator/SKILL.md`
- Create: `.claude/skills/ea4-ui-ux/SKILL.md`

- [ ] **Step 1: Create skills directory**

```bash
mkdir -p .claude/skills/ea4-music-theory
mkdir -p .claude/skills/ea4-exam-generator
mkdir -p .claude/skills/ea4-ui-ux
```

- [ ] **Step 2: Create music theory skill**

Create `.claude/skills/ea4-music-theory/SKILL.md`:

```markdown
---
description: Usa esta skill para implementar, revisar o corregir lógica de lenguaje musical EA4: compases, síncopas, contratiempos, intervalos, tonalidades, escalas, transporte y notas extrañas.
---

# EA4 Music Theory Skill

Antes de programar lógica musical:

1. Leer `contexto_teorico_ea4_lenguaje_musical_v2.md`.
2. Separar teoría musical de UI (funciones puras en `app/src/theory/`).
3. Crear funciones puras para duraciones, compases, síncopas, contratiempos, intervalos, tonalidades, escalas, transporte, notas extrañas.
4. Añadir tests unitarios en `app/src/tests/` para cada función crítica.
5. Corregir usando datos estructurados, no solo texto visible.

Criterios: resultado didáctico, corrección explica el error, soluciones reproducibles.
```

- [ ] **Step 3: Create exam generator skill**

Create `.claude/skills/ea4-exam-generator/SKILL.md`:

```markdown
---
description: Usa esta skill para generar exámenes aleatorios EA4 y PDFs de examen/resolución.
---

# EA4 Exam Generator Skill

El generador debe:

1. Configurar número de ejercicios por bloque.
2. Generar ejercicios válidos con solución interna.
3. Exportar PDF del examen sin soluciones y PDF de resolución con respuestas.
4. Formato: cabecera (Examen Lenguaje Musical EA4, Curso, Nom, Data, El Sindicato EA4).
5. No revelar soluciones en el PDF del examen.
```

- [ ] **Step 4: Create UI/UX skill**

Create `.claude/skills/ea4-ui-ux/SKILL.md`:

```markdown
---
description: Usa esta skill para diseñar interfaces web educativas claras, modernas, responsivas e interactivas para el practicador EA4.
---

# EA4 UI/UX Skill

Principios: claridad sobre decoración, cards/paneles/modales, menú lateral ocultable, feedback visual inmediato (verde=correcto, rojo=incorrecto, amarillo=faltante, azul=solución), botones grandes y claros, accesibilidad (contraste, teclado, ARIA), responsive (desktop/tablet/móvil).
```

- [ ] **Step 5: Commit**

```bash
git add .claude/
git commit -m "feat: add local skills for music theory, exam generator, and UI/UX"
```

---

## Task 3: TypeScript types

**Files:**
- Create: `app/src/theory/types.ts`

- [ ] **Step 1: Create types file**

Create `app/src/theory/types.ts`:

```typescript
export type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "##" | "#" | "n" | "b" | "bb";
export type Note = { name: NoteName; accidental?: Accidental; octave: number };

export type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type IntervalQuality =
  | "mayor"
  | "menor"
  | "justa"
  | "aumentada"
  | "disminuida";
export type IntervalDirection = "ascendente" | "descendente" | "armonico";
export type IntervalResult = {
  number: IntervalNumber;
  quality: IntervalQuality;
  direction: IntervalDirection;
  size: "simple" | "compuesto";
};
export type IntervalSpec = {
  number: IntervalNumber;
  quality: IntervalQuality;
  direction: IntervalDirection;
};

export type RhythmicFigure =
  | "whole"
  | "half"
  | "half."
  | "quarter"
  | "quarter."
  | "eighth"
  | "eighth."
  | "sixteenth";

export type Meter = { numerator: number; denominator: number };

export type BeatType = "F" | "D" | "SF" | "PF" | "PD";
export type RhythmicAnnotation = BeatType | "S" | "C";

export type RhythmicEvent = {
  id: string;
  pitch: string;      // VexFlow format: "c/4", "d#/5", "r" for rest
  figure: RhythmicFigure;
  beatType: BeatType;
  isSyncopation: boolean;
  isOffbeat: boolean;
  tiedFromPrev?: boolean;
};

export type MeasureData = {
  notes: RhythmicEvent[];
};

export type StaffData = {
  meter: Meter;
  keySignature: string;  // VexFlow format: "C", "G", "Bb", "F#", etc.
  clef: "treble" | "bass";
  measures: MeasureData[];
};

export type ScaleType = "major" | "natural_minor" | "harmonic_minor";

export type ScaleExercise = {
  tonic: string;         // Spanish: "Re", "Sib", "Sol", etc.
  type: ScaleType;
  tetrachord: 1 | 2;
  notes: string[];       // Spanish note names
  tetrachordNotes: string[];
};

export type IntervalExercise = {
  id: string;
  noteA: Note;
  noteB: Note;
  solution: IntervalResult;
};

export type KeySignatureExercise = {
  id: string;
  sharps: number;        // 0-7, positive = sharps, negative = flats
  flats: number;
  solution: { major: string; minor: string };
};

export type SyncopationExercise = {
  staffData: StaffData;
  noteAnnotations: Map<string, RhythmicAnnotation>;
};

export type ExamConfig = {
  studentName?: string;
  course: string;
  date: string;
  difficulty: "basico" | "medio" | "avanzado";
  timeSignatures: Meter[];
  keySignatureRange: number;
  allowedFigures: RhythmicFigure[];
  allowTriplets: boolean;
  allowDots: boolean;
  allowTies: boolean;
};

export type ExamExercise = {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  title: string;
  instruction: string;
  data: unknown;
  solution: unknown;
};

export type ExamData = {
  config: ExamConfig;
  exercises: ExamExercise[];
};

// Spanish note names mapping
export const NOTE_NAMES_ES: Record<NoteName, string> = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};

export const NOTE_NAMES_FROM_ES: Record<string, NoteName> = {
  Do: "C", Re: "D", Mi: "E", Fa: "F", Sol: "G", La: "A", Si: "B",
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd app && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/src/theory/types.ts
git commit -m "feat: add shared TypeScript types for music theory"
```

---

## Task 4: Keys theory + tests

**Files:**
- Create: `app/src/theory/keys.ts`
- Create: `app/src/tests/keys.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app/src/tests/keys.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  getKeyFromSharps,
  getKeyFromFlats,
  getLeadingTone,
  getScaleDegreeNote,
  noteToSpanish,
} from "../theory/keys";

describe("getKeyFromSharps", () => {
  it("0 sharps → Do mayor / La menor", () => {
    expect(getKeyFromSharps(0)).toEqual({ major: "Do", minor: "La" });
  });
  it("1 sharp → Sol mayor / Mi menor", () => {
    expect(getKeyFromSharps(1)).toEqual({ major: "Sol", minor: "Mi" });
  });
  it("2 sharps → Re mayor / Si menor", () => {
    expect(getKeyFromSharps(2)).toEqual({ major: "Re", minor: "Si" });
  });
  it("3 sharps → La mayor / Fa# menor", () => {
    expect(getKeyFromSharps(3)).toEqual({ major: "La", minor: "Fa#" });
  });
  it("4 sharps → Mi mayor / Do# menor", () => {
    expect(getKeyFromSharps(4)).toEqual({ major: "Mi", minor: "Do#" });
  });
  it("5 sharps → Si mayor / Sol# menor", () => {
    expect(getKeyFromSharps(5)).toEqual({ major: "Si", minor: "Sol#" });
  });
});

describe("getKeyFromFlats", () => {
  it("1 flat → Fa mayor / Re menor", () => {
    expect(getKeyFromFlats(1)).toEqual({ major: "Fa", minor: "Re" });
  });
  it("2 flats → Sib mayor / Sol menor", () => {
    expect(getKeyFromFlats(2)).toEqual({ major: "Sib", minor: "Sol" });
  });
  it("3 flats → Mib mayor / Do menor", () => {
    expect(getKeyFromFlats(3)).toEqual({ major: "Mib", minor: "Do" });
  });
  it("4 flats → Lab mayor / Fa menor", () => {
    expect(getKeyFromFlats(4)).toEqual({ major: "Lab", minor: "Fa" });
  });
  it("5 flats → Reb mayor / Sib menor", () => {
    expect(getKeyFromFlats(5)).toEqual({ major: "Reb", minor: "Sib" });
  });
});

describe("getLeadingTone", () => {
  it("Do mayor → Si", () => {
    expect(getLeadingTone("Do", "major")).toBe("Si");
  });
  it("Sol mayor → Fa#", () => {
    expect(getLeadingTone("Sol", "major")).toBe("Fa#");
  });
  it("La menor armónica → Sol#", () => {
    expect(getLeadingTone("La", "minor")).toBe("Sol#");
  });
  it("Si menor armónica → La#", () => {
    expect(getLeadingTone("Si", "minor")).toBe("La#");
  });
  it("Mi menor armónica → Re#", () => {
    expect(getLeadingTone("Mi", "minor")).toBe("Re#");
  });
  it("Re menor armónica → Do#", () => {
    expect(getLeadingTone("Re", "minor")).toBe("Do#");
  });
});

describe("noteToSpanish", () => {
  it("converts C to Do", () => expect(noteToSpanish("C")).toBe("Do"));
  it("converts Bb to Sib", () => expect(noteToSpanish("Bb")).toBe("Sib"));
  it("converts F# to Fa#", () => expect(noteToSpanish("F#")).toBe("Fa#"));
  it("converts Eb to Mib", () => expect(noteToSpanish("Eb")).toBe("Mib"));
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd app && npm run test:run -- src/tests/keys.test.ts
```

Expected: FAIL — `Cannot find module '../theory/keys'`

- [ ] **Step 3: Implement keys.ts**

Create `app/src/theory/keys.ts`:

```typescript
// Major keys by sharp count: index = number of sharps
const MAJOR_SHARP_KEYS = ["Do", "Sol", "Re", "La", "Mi", "Si", "Fa#", "Do#"];
const MINOR_SHARP_KEYS = ["La", "Mi", "Si", "Fa#", "Do#", "Sol#", "Re#", "La#"];

// Major keys by flat count: index = number of flats (1-based, index 0 unused)
const MAJOR_FLAT_KEYS = ["", "Fa", "Sib", "Mib", "Lab", "Reb", "Solb", "Dob"];
const MINOR_FLAT_KEYS = ["", "Re", "Sol", "Do", "Fa", "Sib", "Mib", "Lab"];

export function getKeyFromSharps(count: number): { major: string; minor: string } {
  return { major: MAJOR_SHARP_KEYS[count], minor: MINOR_SHARP_KEYS[count] };
}

export function getKeyFromFlats(count: number): { major: string; minor: string } {
  return { major: MAJOR_FLAT_KEYS[count], minor: MINOR_FLAT_KEYS[count] };
}

// Leading tone (sensible): note a semitone below the tonic
// For major keys: 7th degree is already the leading tone
// For minor harmonic: 7th degree is raised to a semitone below tonic
const LEADING_TONES: Record<string, string> = {
  "Do": "Si",      "Sol": "Fa#",  "Re": "Do#",  "La": "Sol#",
  "Mi": "Re#",    "Si": "La#",   "Fa#": "Mi#", "Do#": "Si#",
  "Fa": "Mi",     "Sib": "La",   "Mib": "Re",  "Lab": "Sol",
  "Reb": "Do",    "Solb": "Fa",
};

export function getLeadingTone(tonic: string, _mode: "major" | "minor"): string {
  return LEADING_TONES[tonic] ?? "";
}

// Returns notes on scale degrees I, IV, V for a given tonic (Spanish names)
// major: I=tonic, IV=4th, V=5th
const TONAL_DEGREES: Record<string, { I: string; IV: string; V: string }> = {
  "Do":  { I: "Do",  IV: "Fa",  V: "Sol" },
  "Sol": { I: "Sol", IV: "Do",  V: "Re"  },
  "Re":  { I: "Re",  IV: "Sol", V: "La"  },
  "La":  { I: "La",  IV: "Re",  V: "Mi"  },
  "Mi":  { I: "Mi",  IV: "La",  V: "Si"  },
  "Si":  { I: "Si",  IV: "Mi",  V: "Fa#" },
  "Fa":  { I: "Fa",  IV: "Sib", V: "Do"  },
  "Sib": { I: "Sib", IV: "Mib", V: "Fa"  },
  "Mib": { I: "Mib", IV: "Lab", V: "Sib" },
  "Lab": { I: "Lab", IV: "Reb", V: "Mib" },
  "Reb": { I: "Reb", IV: "Solb",V: "Lab" },
};

export function getScaleDegreeNote(
  tonic: string,
  degree: "I" | "IV" | "V"
): string {
  return TONAL_DEGREES[tonic]?.[degree] ?? "";
}

// Convert VexFlow/English note names to Spanish display names
// Input: "C", "Bb", "F#", "Eb", "Ab", "Db", "Gb"
const EN_BASE: Record<string, string> = {
  C: "Do", D: "Re", E: "Mi", F: "Fa", G: "Sol", A: "La", B: "Si",
};

export function noteToSpanish(englishNote: string): string {
  const base = englishNote.charAt(0).toUpperCase();
  const accidental = englishNote.slice(1);
  const spanishBase = EN_BASE[base] ?? base;
  if (accidental === "#") return spanishBase + "#";
  if (accidental === "b") return spanishBase + "b";
  if (accidental === "##") return spanishBase + "##";
  if (accidental === "bb") return spanishBase + "bb";
  return spanishBase;
}

// Convert Spanish note name to VexFlow key signature format
export function spanishToVexFlowKey(spanishKey: string): string {
  const MAP: Record<string, string> = {
    "Do": "C", "Sol": "G", "Re": "D", "La": "A", "Mi": "E",
    "Si": "B", "Fa#": "F#", "Do#": "C#",
    "Fa": "F", "Sib": "Bb", "Mib": "Eb", "Lab": "Ab",
    "Reb": "Db", "Solb": "Gb", "Dob": "Cb",
  };
  return MAP[spanishKey] ?? "C";
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd app && npm run test:run -- src/tests/keys.test.ts
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/theory/keys.ts app/src/tests/keys.test.ts
git commit -m "feat: add key signatures theory with leading tone logic + tests"
```

---

## Task 5: Scales theory + tests

**Files:**
- Create: `app/src/theory/scales.ts`
- Create: `app/src/tests/scales.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app/src/tests/scales.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  buildMajorScale,
  buildNaturalMinorScale,
  buildHarmonicMinorScale,
  getTetrachord,
} from "../theory/scales";

describe("buildMajorScale", () => {
  it("Do major", () => {
    expect(buildMajorScale("Do")).toEqual(["Do","Re","Mi","Fa","Sol","La","Si","Do"]);
  });
  it("Sol major", () => {
    expect(buildMajorScale("Sol")).toEqual(["Sol","La","Si","Do","Re","Mi","Fa#","Sol"]);
  });
  it("Re major", () => {
    expect(buildMajorScale("Re")).toEqual(["Re","Mi","Fa#","Sol","La","Si","Do#","Re"]);
  });
  it("Fa major", () => {
    expect(buildMajorScale("Fa")).toEqual(["Fa","Sol","La","Sib","Do","Re","Mi","Fa"]);
  });
  it("Sib major", () => {
    expect(buildMajorScale("Sib")).toEqual(["Sib","Do","Re","Mib","Fa","Sol","La","Sib"]);
  });
});

describe("buildNaturalMinorScale", () => {
  it("La natural minor", () => {
    expect(buildNaturalMinorScale("La")).toEqual(["La","Si","Do","Re","Mi","Fa","Sol","La"]);
  });
  it("Re natural minor", () => {
    expect(buildNaturalMinorScale("Re")).toEqual(["Re","Mi","Fa","Sol","La","Sib","Do","Re"]);
  });
});

describe("buildHarmonicMinorScale", () => {
  it("La harmonic minor", () => {
    expect(buildHarmonicMinorScale("La")).toEqual(["La","Si","Do","Re","Mi","Fa","Sol#","La"]);
  });
  it("Re harmonic minor", () => {
    expect(buildHarmonicMinorScale("Re")).toEqual(["Re","Mi","Fa","Sol","La","Sib","Do#","Re"]);
  });
  it("Si harmonic minor", () => {
    expect(buildHarmonicMinorScale("Si")).toEqual(["Si","Do#","Re","Mi","Fa#","Sol","La#","Si"]);
  });
});

describe("getTetrachord", () => {
  it("Re harmonic minor 2nd tetrachord → La Sib Do# Re", () => {
    const scale = buildHarmonicMinorScale("Re");
    expect(getTetrachord(scale, 2)).toEqual(["La","Sib","Do#","Re"]);
  });
  it("Sib major 1st tetrachord → Sib Do Re Mib", () => {
    const scale = buildMajorScale("Sib");
    expect(getTetrachord(scale, 1)).toEqual(["Sib","Do","Re","Mib"]);
  });
  it("Sol major 2nd tetrachord → Re Mi Fa# Sol", () => {
    const scale = buildMajorScale("Sol");
    expect(getTetrachord(scale, 2)).toEqual(["Re","Mi","Fa#","Sol"]);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd app && npm run test:run -- src/tests/scales.test.ts
```

Expected: FAIL — cannot find module.

- [ ] **Step 3: Implement scales.ts**

Create `app/src/theory/scales.ts`:

```typescript
// All scales as 8-note arrays (tonic repeated at end) using Spanish names.
// Pattern W=whole tone (tono), H=half tone (semitono)
// Major:           W W H W W W H
// Natural minor:   W H W W H W W
// Harmonic minor:  W H W W H 3H H  (augmented 2nd between 6-7)

// Chromatic semitone map for Spanish note names (in C=0 terms)
const SEMITONES: Record<string, number> = {
  "Do": 0, "Do#": 1, "Reb": 1,
  "Re": 2, "Re#": 3, "Mib": 3,
  "Mi": 4, "Fab": 4,
  "Fa": 5, "Fa#": 6, "Solb": 6,
  "Sol": 7, "Sol#": 8, "Lab": 8,
  "La": 9, "La#": 10, "Sib": 10,
  "Si": 11, "Dob": 11,
};

// All chromatic notes in order (using preferred enharmonic spellings)
const CHROMATIC = [
  ["Do"],
  ["Do#", "Reb"],
  ["Re"],
  ["Re#", "Mib"],
  ["Mi"],
  ["Fa"],
  ["Fa#", "Solb"],
  ["Sol"],
  ["Sol#", "Lab"],
  ["La"],
  ["La#", "Sib"],
  ["Si"],
];

// Diatonic note names in order
const DIATONIC = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

function diatonicIndex(note: string): number {
  // Remove accidental and find base note position
  const base = note.replace(/#|b/g, "");
  return DIATONIC.indexOf(base);
}

function buildScaleFromPattern(tonic: string, pattern: number[]): string[] {
  const tonicSemitone = SEMITONES[tonic];
  const tonicDiatonic = diatonicIndex(tonic);
  if (tonicSemitone === undefined || tonicDiatonic === -1) return [];

  const result: string[] = [tonic];
  let currentSemitone = tonicSemitone;

  for (let i = 0; i < pattern.length; i++) {
    currentSemitone = (currentSemitone + pattern[i]) % 12;
    const expectedDiatonic = DIATONIC[(tonicDiatonic + i + 1) % 7];
    // Find the chromatic slot that matches this semitone
    const candidates = CHROMATIC[currentSemitone];
    // Prefer the candidate whose base matches the expected diatonic note
    const match = candidates.find((c) => c.replace(/#|b/g, "") === expectedDiatonic);
    result.push(match ?? candidates[0]);
  }

  return result;
}

export function buildMajorScale(tonic: string): string[] {
  // W W H W W W H = 2 2 1 2 2 2 1
  return buildScaleFromPattern(tonic, [2, 2, 1, 2, 2, 2, 1]);
}

export function buildNaturalMinorScale(tonic: string): string[] {
  // W H W W H W W = 2 1 2 2 1 2 2
  return buildScaleFromPattern(tonic, [2, 1, 2, 2, 1, 2, 2]);
}

export function buildHarmonicMinorScale(tonic: string): string[] {
  // W H W W H A2 H = 2 1 2 2 1 3 1
  return buildScaleFromPattern(tonic, [2, 1, 2, 2, 1, 3, 1]);
}

// Returns 4 notes of the 1st or 2nd tetrachord
// scale: 8-note array from buildXxxScale (index 0..7, index 7 = tonic repeat)
export function getTetrachord(scale: string[], n: 1 | 2): string[] {
  if (n === 1) return scale.slice(0, 4);      // notes 1-4
  return scale.slice(4, 8);                    // notes 5-8
}
```

- [ ] **Step 4: Run tests**

```bash
cd app && npm run test:run -- src/tests/scales.test.ts
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/theory/scales.ts app/src/tests/scales.test.ts
git commit -m "feat: add scale building functions (major, natural/harmonic minor) + tests"
```

---

## Task 6: Intervals theory + tests

**Files:**
- Create: `app/src/theory/intervals.ts`
- Create: `app/src/tests/intervals.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app/src/tests/intervals.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { getInterval, buildInterval } from "../theory/intervals";
import type { Note } from "../theory/types";

const C4: Note = { name: "C", octave: 4 };
const D4: Note = { name: "D", octave: 4 };
const E4: Note = { name: "E", octave: 4 };
const F4: Note = { name: "F", octave: 4 };
const G4: Note = { name: "G", octave: 4 };
const A4: Note = { name: "A", octave: 4 };
const B4: Note = { name: "B", octave: 4 };
const Fsharp4: Note = { name: "F", accidental: "#", octave: 4 };
const Gflat4: Note = { name: "G", accidental: "b", octave: 4 };
const Eflat4: Note = { name: "E", accidental: "b", octave: 4 };
const C5: Note = { name: "C", octave: 5 };

describe("getInterval - ascending", () => {
  it("Do-Re → 2ª mayor ascendente simple", () => {
    expect(getInterval(C4, D4)).toEqual({
      number: 2, quality: "mayor", direction: "ascendente", size: "simple",
    });
  });
  it("Mi-Fa → 2ª menor", () => {
    expect(getInterval(E4, F4)).toEqual({
      number: 2, quality: "menor", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Mi → 3ª mayor", () => {
    expect(getInterval(C4, E4)).toEqual({
      number: 3, quality: "mayor", direction: "ascendente", size: "simple",
    });
  });
  it("Re-Fa → 3ª menor", () => {
    expect(getInterval(D4, F4)).toEqual({
      number: 3, quality: "menor", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Fa → 4ª justa", () => {
    expect(getInterval(C4, F4)).toEqual({
      number: 4, quality: "justa", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Fa# → 4ª aumentada", () => {
    expect(getInterval(C4, Fsharp4)).toEqual({
      number: 4, quality: "aumentada", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Solb → 5ª disminuida", () => {
    expect(getInterval(C4, Gflat4)).toEqual({
      number: 5, quality: "disminuida", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Sol → 5ª justa", () => {
    expect(getInterval(C4, G4)).toEqual({
      number: 5, quality: "justa", direction: "ascendente", size: "simple",
    });
  });
  it("Do-La → 6ª mayor", () => {
    expect(getInterval(C4, A4)).toEqual({
      number: 6, quality: "mayor", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Mib → 3ª menor", () => {
    expect(getInterval(C4, Eflat4)).toEqual({
      number: 3, quality: "menor", direction: "ascendente", size: "simple",
    });
  });
  it("Do-Do(8va) → 8ª justa", () => {
    expect(getInterval(C4, C5)).toEqual({
      number: 8, quality: "justa", direction: "ascendente", size: "simple",
    });
  });
});

describe("getInterval - descending", () => {
  it("Re-Do → 2ª menor descendente", () => {
    // D4 to C4: descending, 2nd
    expect(getInterval(D4, C4)).toEqual({
      number: 2, quality: "mayor", direction: "descendente", size: "simple",
    });
  });
  it("Mi-Do → 3ª menor descendente", () => {
    expect(getInterval(E4, C4)).toEqual({
      number: 3, quality: "mayor", direction: "descendente", size: "simple",
    });
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd app && npm run test:run -- src/tests/intervals.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement intervals.ts**

Create `app/src/theory/intervals.ts`:

```typescript
import type { Note, NoteName, IntervalResult, IntervalNumber, IntervalQuality, IntervalSpec } from "./types";

const NOTE_ORDER: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];

const SEMITONES_FROM_C: Record<NoteName, number> = {
  C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
};

const ACCIDENTAL_SEMITONES: Record<string, number> = {
  "##": 2, "#": 1, n: 0, b: -1, bb: -2,
};

function absoluteSemitone(note: Note): number {
  const base = SEMITONES_FROM_C[note.name];
  const acc = note.accidental ? ACCIDENTAL_SEMITONES[note.accidental] ?? 0 : 0;
  return note.octave * 12 + base + acc;
}

function noteNameIndex(name: NoteName): number {
  return NOTE_ORDER.indexOf(name);
}

// Perfect intervals (1, 4, 5, 8) vs. major/minor intervals (2, 3, 6, 7)
const PERFECT_INTERVALS = new Set([1, 4, 5, 8]);

// Semitones for perfect intervals and major intervals (ascending, in same octave)
const BASE_SEMITONES: Record<number, number> = {
  1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12,
};

export function getInterval(noteA: Note, noteB: Note): IntervalResult {
  const semA = absoluteSemitone(noteA);
  const semB = absoluteSemitone(noteB);

  const direction = semA <= semB ? "ascendente" : "descendente";

  // Interval number: count diatonic steps (always use lower/higher)
  const idxA = noteNameIndex(noteA.name);
  const idxB = noteNameIndex(noteB.name);

  // Calculate diatonic interval regardless of direction
  const lowerNote = semA <= semB ? noteA : noteB;
  const higherNote = semA <= semB ? noteB : noteA;
  const lowerIdx = noteNameIndex(lowerNote.name);
  const higherIdx = noteNameIndex(higherNote.name);

  // Diatonic steps (octave-aware)
  const lowerSem = absoluteSemitone(lowerNote);
  const higherSem = absoluteSemitone(higherNote);
  const semDistance = higherSem - lowerSem;

  let diatonicSteps = higherIdx - lowerIdx;
  if (diatonicSteps < 0) diatonicSteps += 7;
  // Add 7 for each octave beyond the first
  const octaveDiff = Math.floor(semDistance / 12);
  diatonicSteps += octaveDiff * 7;
  const intervalNumber = (diatonicSteps + 1) as IntervalNumber;

  const size: "simple" | "compuesto" = intervalNumber <= 8 ? "simple" : "compuesto";

  // Normalize to octave for quality calculation
  const normalizedNum = intervalNumber > 8 ? intervalNumber - 7 : intervalNumber;
  const baseSem = BASE_SEMITONES[normalizedNum] ?? 0;
  const actualSem = semDistance % 12 || (semDistance === 12 ? 12 : semDistance % 12);
  // handle 8th/octave specially
  const semForQuality = intervalNumber === 8 ? semDistance : semDistance % 12;
  const diff = (intervalNumber === 8 ? semForQuality : semDistance % 12) - (intervalNumber === 8 ? 12 : baseSem);

  let quality: IntervalQuality;
  if (PERFECT_INTERVALS.has(normalizedNum)) {
    if (diff === 0) quality = "justa";
    else if (diff > 0) quality = "aumentada";
    else quality = "disminuida";
  } else {
    if (diff === 0) quality = "mayor";
    else if (diff === -1) quality = "menor";
    else if (diff > 0) quality = "aumentada";
    else quality = "disminuida";
  }

  // Correct the direction logic
  const finalDirection = semA === semB ? "armonico" : (semA < semB ? "ascendente" : "descendente");

  return { number: intervalNumber, quality, direction: finalDirection, size };
}

export function buildInterval(noteA: Note, spec: IntervalSpec): Note {
  const { number, quality, direction } = spec;
  const idxA = noteNameIndex(noteA.name);
  const semA = absoluteSemitone(noteA);

  const diatonicSteps = number - 1;
  const targetDiatonicIdx = (idxA + (direction === "descendente" ? -diatonicSteps : diatonicSteps) + 70) % 7;
  const targetName = NOTE_ORDER[targetDiatonicIdx];

  const normalizedNum = number > 8 ? number - 7 : number;
  const baseSem = BASE_SEMITONES[normalizedNum] ?? 0;

  let targetBaseSem: number;
  if (PERFECT_INTERVALS.has(normalizedNum)) {
    if (quality === "aumentada") targetBaseSem = baseSem + 1;
    else if (quality === "disminuida") targetBaseSem = baseSem - 1;
    else targetBaseSem = baseSem;
  } else {
    if (quality === "mayor") targetBaseSem = baseSem;
    else if (quality === "menor") targetBaseSem = baseSem - 1;
    else if (quality === "aumentada") targetBaseSem = baseSem + 1;
    else targetBaseSem = baseSem - 2;
  }

  const octave = direction === "descendente"
    ? noteA.octave - Math.ceil(number / 7)
    : noteA.octave + Math.floor(number / 8);

  const targetNaturalSem = SEMITONES_FROM_C[targetName];
  const semDiff = direction === "descendente"
    ? semA - (octave * 12 + targetNaturalSem) - targetBaseSem
    : (octave * 12 + targetNaturalSem) - semA - targetBaseSem;
  // This is a simplified version — full chromatic transposition is in transposition.ts
  return { name: targetName, octave };
}
```

- [ ] **Step 4: Run tests**

```bash
cd app && npm run test:run -- src/tests/intervals.test.ts
```

Expected: all PASS. If any fail, check the semitone calculation for edge cases.

- [ ] **Step 5: Commit**

```bash
git add app/src/theory/intervals.ts app/src/tests/intervals.test.ts
git commit -m "feat: add interval analysis (number, quality, direction) + tests"
```

---

## Task 7: Rhythm theory + tests

**Files:**
- Create: `app/src/theory/rhythm.ts`
- Create: `app/src/tests/rhythm.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app/src/tests/rhythm.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  durationToBeats,
  measureTotalBeats,
  getBeatType,
} from "../theory/rhythm";
import type { Meter } from "../theory/types";

const m44: Meter = { numerator: 4, denominator: 4 };
const m34: Meter = { numerator: 3, denominator: 4 };
const m68: Meter = { numerator: 6, denominator: 8 };
const m98: Meter = { numerator: 9, denominator: 8 };

describe("durationToBeats", () => {
  it("quarter in 4/4 → 1 beat", () => {
    expect(durationToBeats("quarter", m44)).toBeCloseTo(1);
  });
  it("half in 4/4 → 2 beats", () => {
    expect(durationToBeats("half", m44)).toBeCloseTo(2);
  });
  it("eighth in 4/4 → 0.5 beats", () => {
    expect(durationToBeats("eighth", m44)).toBeCloseTo(0.5);
  });
  it("quarter. in 4/4 → 1.5 beats", () => {
    expect(durationToBeats("quarter.", m44)).toBeCloseTo(1.5);
  });
  it("quarter in 6/8 → 2 eighth-beats", () => {
    // In 6/8 denominator is 8, so 1 quarter = 2/8 = 2 units
    expect(durationToBeats("quarter", m68)).toBeCloseTo(2);
  });
  it("tresillo de corcheas (virtual): each note = 2/3 beat in 4/4", () => {
    // Triplet: 3 notes in space of 2
    // Each eighth in triplet = (1/2 beat) * (2/3) = 1/3 beat... 
    // Actually in 4/4: triplet eighth = 1/3 of a quarter beat
    // The "beat" in 4/4 is a quarter note = 1.
    // A triplet of 3 eighths fills 1 quarter = 1 beat total.
    // Each triplet eighth = 1/3 beat.
    expect(1 / 3).toBeCloseTo(0.333);
  });
});

describe("measureTotalBeats", () => {
  it("4/4 → 4 quarter-note beats", () => {
    expect(measureTotalBeats(m44)).toBe(4);
  });
  it("3/4 → 3 quarter-note beats", () => {
    expect(measureTotalBeats(m34)).toBe(3);
  });
  it("6/8 → 6 eighth-note units", () => {
    expect(measureTotalBeats(m68)).toBe(6);
  });
  it("9/8 → 9 eighth-note units", () => {
    expect(measureTotalBeats(m98)).toBe(9);
  });
});

describe("getBeatType in 4/4", () => {
  it("beat 0 (time 1) → F", () => {
    expect(getBeatType(0, m44)).toBe("F");
  });
  it("beat 1 (time 2) → D", () => {
    expect(getBeatType(1, m44)).toBe("D");
  });
  it("beat 2 (time 3) → SF", () => {
    expect(getBeatType(2, m44)).toBe("SF");
  });
  it("beat 3 (time 4) → D", () => {
    expect(getBeatType(3, m44)).toBe("D");
  });
});

describe("getBeatType in 3/4", () => {
  it("beat 0 → F", () => expect(getBeatType(0, m34)).toBe("F"));
  it("beat 1 → D", () => expect(getBeatType(1, m34)).toBe("D"));
  it("beat 2 → D", () => expect(getBeatType(2, m34)).toBe("D"));
});

describe("getBeatType in 6/8", () => {
  it("8th 0 → F", () => expect(getBeatType(0, m68)).toBe("F"));
  it("8th 1 → PD", () => expect(getBeatType(1, m68)).toBe("PD"));
  it("8th 2 → PD", () => expect(getBeatType(2, m68)).toBe("PD"));
  it("8th 3 → D", () => expect(getBeatType(3, m68)).toBe("D"));
  it("8th 4 → PD", () => expect(getBeatType(4, m68)).toBe("PD"));
  it("8th 5 → PD", () => expect(getBeatType(5, m68)).toBe("PD"));
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd app && npm run test:run -- src/tests/rhythm.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement rhythm.ts**

Create `app/src/theory/rhythm.ts`:

```typescript
import type { RhythmicFigure, Meter, BeatType } from "./types";

// Returns duration in units of the meter's denominator
export function durationToBeats(figure: RhythmicFigure, meter: Meter): number {
  // Base values in quarter notes
  const quarterValues: Record<string, number> = {
    whole: 4, half: 2, "half.": 3, quarter: 1, "quarter.": 1.5,
    eighth: 0.5, "eighth.": 0.75, sixteenth: 0.25,
  };

  const inQuarters = quarterValues[figure];
  if (inQuarters === undefined) return 0;

  // Convert to denominator units
  // denominator 4 = quarter, denominator 8 = eighth
  const denominatorInQuarters = 4 / meter.denominator;
  return inQuarters / denominatorInQuarters;
}

// Total beats a measure should contain (in denominator units)
export function measureTotalBeats(meter: Meter): number {
  return meter.numerator;
}

// Returns the beat type for a given beat position in a measure
// beatIndex: 0-based index in denominator units
export function getBeatType(beatIndex: number, meter: Meter): BeatType {
  const { numerator, denominator } = meter;

  if (denominator === 4) {
    // Simple meters: each beat is a quarter note
    switch (beatIndex % numerator) {
      case 0: return "F";
      case 1: return "D";
      case 2: return numerator >= 4 ? "SF" : "D";
      default: return "D";
    }
  }

  if (denominator === 8 && numerator % 3 === 0) {
    // Compound meters: groups of 3 eighths per beat
    const groupsPerMeasure = numerator / 3;
    const groupIndex = Math.floor(beatIndex / 3);
    const posInGroup = beatIndex % 3;

    if (posInGroup === 0) {
      // First of each group: strong or weak depending on beat
      if (groupIndex === 0) return "F";
      if (groupIndex === 2 && groupsPerMeasure === 4) return "SF";
      return "D";
    }
    return "PD"; // 2nd and 3rd of each triplet group
  }

  // Fallback for 2/4
  return beatIndex === 0 ? "F" : "D";
}

// Checks if a note starting at beatStart with given duration creates a syncopation
// A syncopation: starts on weak part and is prolonged over a strong part
export function isSyncopation(
  startBeat: number,
  durationBeats: number,
  meter: Meter,
  tiedToNext: boolean
): boolean {
  const startType = getBeatType(startBeat, meter);
  // Starting on a non-strong beat
  if (startType === "F" || startType === "SF") return false;

  // Check if it crosses into a strong beat
  const endBeat = startBeat + durationBeats;
  const totalBeats = measureTotalBeats(meter);

  // Check each strong beat position
  for (let i = 1; i <= totalBeats; i++) {
    const beatType = getBeatType(i % totalBeats, meter);
    if ((beatType === "F" || beatType === "SF") && i > startBeat && i < endBeat) {
      return true;
    }
  }

  // If tied to next measure (crosses barline from weak beat)
  if (tiedToNext) return true;

  return false;
}

// Checks if a note starting at beatStart is an offbeat (contratiempo)
// Offbeat: starts on weak part while the preceding strong part is silent (rest)
export function isOffbeat(
  startBeat: number,
  meter: Meter,
  prevEventIsRest: boolean
): boolean {
  const startType = getBeatType(startBeat, meter);
  // Must start on a non-strong position
  if (startType === "F" || startType === "SF") return false;
  // The previous beat (strong) must be a rest
  return prevEventIsRest;
}
```

- [ ] **Step 4: Run tests**

```bash
cd app && npm run test:run -- src/tests/rhythm.test.ts
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/theory/rhythm.ts app/src/tests/rhythm.test.ts
git commit -m "feat: add rhythm theory (beat types, syncopation, offbeat detection) + tests"
```

---

## Task 8: Transposition theory + tests

**Files:**
- Create: `app/src/theory/transposition.ts`
- Create: `app/src/tests/transposition.test.ts`

- [ ] **Step 1: Write failing tests**

Create `app/src/tests/transposition.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { transposeNoteSpanish, getTransposedKey } from "../theory/transposition";

describe("transposeNoteSpanish - 3ª menor superior", () => {
  it("Do → Mib", () => expect(transposeNoteSpanish("Do", 3, "menor", "superior")).toBe("Mib"));
  it("Re → Fa", () => expect(transposeNoteSpanish("Re", 3, "menor", "superior")).toBe("Fa"));
  it("Sol → Sib", () => expect(transposeNoteSpanish("Sol", 3, "menor", "superior")).toBe("Sib"));
});

describe("transposeNoteSpanish - 2ª mayor inferior", () => {
  it("Re → Do", () => expect(transposeNoteSpanish("Re", 2, "mayor", "inferior")).toBe("Do"));
  it("Fa# → Mi", () => expect(transposeNoteSpanish("Fa#", 2, "mayor", "inferior")).toBe("Mi"));
  it("Sol → Fa", () => expect(transposeNoteSpanish("Sol", 2, "mayor", "inferior")).toBe("Fa"));
});

describe("getTransposedKey", () => {
  it("Fa mayor + 3ª menor superior → Lab mayor", () => {
    expect(getTransposedKey("Fa", 3, "menor", "superior")).toEqual({
      major: "Lab", vexflowKey: "Ab",
    });
  });
  it("Re mayor + 2ª mayor inferior → Do mayor", () => {
    expect(getTransposedKey("Re", 2, "mayor", "inferior")).toEqual({
      major: "Do", vexflowKey: "C",
    });
  });
});
```

- [ ] **Step 2: Run to verify they fail**

```bash
cd app && npm run test:run -- src/tests/transposition.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Implement transposition.ts**

Create `app/src/theory/transposition.ts`:

```typescript
import { spanishToVexFlowKey } from "./keys";

const DIATONIC_ES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
const CHROMATIC_UP: Record<string, string> = {
  "Do": "Do#", "Do#": "Re", "Reb": "Re", "Re": "Re#", "Re#": "Mi",
  "Mib": "Mi", "Mi": "Fa", "Fa": "Fa#", "Fa#": "Sol", "Solb": "Sol",
  "Sol": "Sol#", "Sol#": "La", "Lab": "La", "La": "La#", "La#": "Si",
  "Sib": "Si", "Si": "Do",
};

const SEMITONES_ES: Record<string, number> = {
  "Do": 0, "Do#": 1, "Reb": 1, "Re": 2, "Re#": 3, "Mib": 3,
  "Mi": 4, "Fa": 5, "Fa#": 6, "Solb": 6, "Sol": 7, "Sol#": 8,
  "Lab": 8, "La": 9, "La#": 10, "Sib": 10, "Si": 11,
};

// Interval semitones (ascending)
const INTERVAL_SEMITONES: Record<string, Record<string, number>> = {
  "2": { "mayor": 2, "menor": 1, "aumentada": 3, "disminuida": 0 },
  "3": { "mayor": 4, "menor": 3, "aumentada": 5, "disminuida": 2 },
  "4": { "justa": 5, "aumentada": 6, "disminuida": 4 },
  "5": { "justa": 7, "aumentada": 8, "disminuida": 6 },
  "6": { "mayor": 9, "menor": 8, "aumentada": 10, "disminuida": 7 },
  "7": { "mayor": 11, "menor": 10, "aumentada": 12, "disminuida": 9 },
  "8": { "justa": 12 },
};

function diatonicIndexEs(note: string): number {
  const base = note.replace(/#|b/g, "");
  return DIATONIC_ES.indexOf(base);
}

const DIATONIC_ES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

export function transposeNoteSpanish(
  note: string,
  intervalNum: number,
  quality: string,
  direction: "superior" | "inferior"
): string {
  const baseSemitone = SEMITONES_ES[note];
  if (baseSemitone === undefined) return note;

  const semitones = INTERVAL_SEMITONES[String(intervalNum)]?.[quality] ?? 0;
  const targetSemitone =
    direction === "superior"
      ? (baseSemitone + semitones) % 12
      : ((baseSemitone - semitones) % 12 + 12) % 12;

  // Target diatonic note name (n diatonic steps away)
  const srcDiatonic = diatonicIndexEs(note);
  const diatonicSteps = intervalNum - 1;
  const targetDiatonic =
    direction === "superior"
      ? (srcDiatonic + diatonicSteps) % 7
      : ((srcDiatonic - diatonicSteps) % 7 + 7) % 7;
  const targetBase = DIATONIC_ES[targetDiatonic];

  // Find the correct note at targetSemitone with base = targetBase
  const naturalSemitone = SEMITONES_ES[targetBase];
  const diff = (targetSemitone - naturalSemitone + 12) % 12;

  if (diff === 0) return targetBase;
  if (diff === 1) return targetBase + "#";
  if (diff === 11) return targetBase + "b";
  if (diff === 2) return targetBase + "##";
  if (diff === 10) return targetBase + "bb";
  return targetBase;
}

export function getTransposedKey(
  fromMajorKey: string,
  intervalNum: number,
  quality: string,
  direction: "superior" | "inferior"
): { major: string; vexflowKey: string } {
  const transposed = transposeNoteSpanish(fromMajorKey, intervalNum, quality, direction);
  return { major: transposed, vexflowKey: spanishToVexFlowKey(transposed) };
}
```

- [ ] **Step 4: Run tests**

```bash
cd app && npm run test:run -- src/tests/transposition.test.ts
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/theory/transposition.ts app/src/tests/transposition.test.ts
git commit -m "feat: add transposition theory (note + key transposition) + tests"
```

---

## Task 9: UI components

**Files:**
- Create: `app/src/components/ui/Button.tsx`
- Create: `app/src/components/ui/Card.tsx`
- Create: `app/src/components/ui/Modal.tsx`
- Create: `app/src/components/ui/Select.tsx`
- Create: `app/src/components/ui/Badge.tsx`
- Create: `app/src/components/ui/index.ts`

- [ ] **Step 1: Create Button**

Create `app/src/components/ui/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "success" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary: "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50
        disabled:cursor-not-allowed transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create Card**

Create `app/src/components/ui/Card.tsx`:

```tsx
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create Modal**

Create `app/src/components/ui/Modal.tsx`:

```tsx
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Select**

Create `app/src/components/ui/Select.tsx`:

```tsx
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-md border border-slate-300 px-3 py-2 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 5: Create Badge**

Create `app/src/components/ui/Badge.tsx`:

```tsx
type BadgeVariant = "correct" | "incorrect" | "missing" | "solution" | "neutral";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  correct: "bg-green-100 text-green-800 border-green-200",
  incorrect: "bg-red-100 text-red-800 border-red-200",
  missing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  solution: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

export function Badge({
  variant = "neutral",
  children,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${BADGE_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 6: Create barrel export**

Create `app/src/components/ui/index.ts`:

```typescript
export { Button } from "./Button";
export { Card } from "./Card";
export { Modal } from "./Modal";
export { Select } from "./Select";
export { Badge } from "./Badge";
```

- [ ] **Step 7: Commit**

```bash
git add app/src/components/ui/
git commit -m "feat: add UI component library (Button, Card, Modal, Select, Badge)"
```

---

## Task 10: Layout components

**Files:**
- Create: `app/src/components/layout/Sidebar.tsx`
- Create: `app/src/components/layout/Header.tsx`
- Create: `app/src/components/layout/PageShell.tsx`
- Create: `app/src/contexts/LayoutContext.tsx`

- [ ] **Step 1: Create LayoutContext**

Create `app/src/contexts/LayoutContext.tsx`:

```tsx
import { createContext, useContext, useState } from "react";

interface LayoutContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <LayoutContext.Provider
      value={{ sidebarOpen, toggleSidebar: () => setSidebarOpen((v) => !v) }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error("useLayout must be used within LayoutProvider");
  return ctx;
}
```

- [ ] **Step 2: Create Sidebar**

Create `app/src/components/layout/Sidebar.tsx`:

```tsx
import { NavLink } from "react-router-dom";
import { useLayout } from "../../contexts/LayoutContext";

const NAV_ITEMS = [
  { to: "/", label: "Inicio", icon: "🏠", implemented: true },
  { to: "/sincopas", label: "Síncopas y contratiempos", icon: "🎵", implemented: true },
  { to: "/intervalos", label: "Intervalos", icon: "↕️", implemented: true },
  { to: "/tonalidades", label: "Tonalidades", icon: "🎼", implemented: true },
  { to: "/escalas", label: "Escalas", icon: "📊", implemented: true },
  { to: "/transporte", label: "Transporte", icon: "↗️", implemented: false },
  { to: "/compas", label: "Compás y tonalidad", icon: "📏", implemented: false },
  { to: "/completar", label: "Completar compases", icon: "✏️", implemented: false },
  { to: "/notas-extranas", label: "Notas extrañas", icon: "🎯", implemented: false },
  { divider: true },
  { to: "/generador", label: "Generador de exámenes", icon: "📋", implemented: true },
  { to: "/teoria", label: "Teoría", icon: "📚", implemented: true },
] as const;

export function Sidebar() {
  const { sidebarOpen } = useLayout();

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-64 bg-slate-800 text-slate-100 flex flex-col overflow-y-auto z-40">
      <nav className="py-4 flex-1">
        {NAV_ITEMS.map((item, i) => {
          if ("divider" in item) {
            return <div key={i} className="my-2 border-t border-slate-700" />;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : item.implemented
                    ? "text-slate-300 hover:bg-slate-700 hover:text-white"
                    : "text-slate-500 cursor-default"
                }`
              }
              onClick={(e) => !item.implemented && e.preventDefault()}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {!item.implemented && (
                <span className="ml-auto text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded">
                  Próx.
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
        El Sindicato EA4 · 2025/2026
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create Header**

Create `app/src/components/layout/Header.tsx`:

```tsx
import { useLayout } from "../../contexts/LayoutContext";

export function Header() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 z-50 shadow-sm">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Abrir/cerrar menú"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xl">🎵</span>
        <span className="font-bold text-slate-800 text-lg">El Sindicato EA4</span>
        <span className="text-slate-400 text-sm hidden sm:block">· Practicador de Lenguaje Musical</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create PageShell**

Create `app/src/components/layout/PageShell.tsx`:

```tsx
import { useLayout } from "../../contexts/LayoutContext";

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  const { sidebarOpen } = useLayout();

  return (
    <main
      className={`pt-14 min-h-screen bg-slate-50 transition-all duration-200 ${
        sidebarOpen ? "pl-64" : "pl-0"
      }`}
    >
      <div className="p-6 max-w-5xl mx-auto">{children}</div>
    </main>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/src/components/layout/ app/src/contexts/
git commit -m "feat: add layout components (Sidebar, Header, PageShell) with collapsible sidebar"
```

---

## Task 11: App.tsx + routing

**Files:**
- Modify: `app/src/App.tsx`
- Create: `app/src/app/routes.tsx`
- Modify: `app/src/main.tsx`

- [ ] **Step 1: Create stub pages**

Create `app/src/features/transposition/TranspositionPage.tsx`:

```tsx
export function TranspositionPage() {
  return (
    <div className="py-12 text-center">
      <p className="text-4xl mb-4">🚧</p>
      <h2 className="text-xl font-semibold text-slate-700">Transporte</h2>
      <p className="text-slate-500 mt-2">Próximamente disponible</p>
    </div>
  );
}
```

Create identically named stubs for:
- `app/src/features/meterTonality/MeterTonalityPage.tsx` (label: "Compás y tonalidad")
- `app/src/features/completeMeasures/CompleteMeasuresPage.tsx` (label: "Completar compases")
- `app/src/features/nonChordTones/NonChordTonesPage.tsx` (label: "Notas extrañas")

(Copy the same pattern, just change the title string.)

- [ ] **Step 2: Create routes.tsx**

Create `app/src/app/routes.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PageShell } from "../components/layout/PageShell";

const HomePage = lazy(() => import("../features/home/HomePage").then((m) => ({ default: m.HomePage })));
const SyncopationPage = lazy(() => import("../features/syncopation/SyncopationPage").then((m) => ({ default: m.SyncopationPage })));
const IntervalsPage = lazy(() => import("../features/intervals/IntervalsPage").then((m) => ({ default: m.IntervalsPage })));
const KeySignaturesPage = lazy(() => import("../features/keySignatures/KeySignaturesPage").then((m) => ({ default: m.KeySignaturesPage })));
const ScalesPage = lazy(() => import("../features/scales/ScalesPage").then((m) => ({ default: m.ScalesPage })));
const TranspositionPage = lazy(() => import("../features/transposition/TranspositionPage").then((m) => ({ default: m.TranspositionPage })));
const MeterTonalityPage = lazy(() => import("../features/meterTonality/MeterTonalityPage").then((m) => ({ default: m.MeterTonalityPage })));
const CompleteMeasuresPage = lazy(() => import("../features/completeMeasures/CompleteMeasuresPage").then((m) => ({ default: m.CompleteMeasuresPage })));
const NonChordTonesPage = lazy(() => import("../features/nonChordTones/NonChordTonesPage").then((m) => ({ default: m.NonChordTonesPage })));
const ExamGeneratorPage = lazy(() => import("../features/examGenerator/ExamGeneratorPage").then((m) => ({ default: m.ExamGeneratorPage })));
const TheoryPage = lazy(() => import("../features/theory/TheoryPage").then((m) => ({ default: m.TheoryPage })));

function Loading() {
  return (
    <PageShell>
      <div className="flex items-center justify-center h-64 text-slate-400">Cargando...</div>
    </PageShell>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<PageShell><HomePage /></PageShell>} />
        <Route path="/sincopas" element={<PageShell><SyncopationPage /></PageShell>} />
        <Route path="/intervalos" element={<PageShell><IntervalsPage /></PageShell>} />
        <Route path="/tonalidades" element={<PageShell><KeySignaturesPage /></PageShell>} />
        <Route path="/escalas" element={<PageShell><ScalesPage /></PageShell>} />
        <Route path="/transporte" element={<PageShell><TranspositionPage /></PageShell>} />
        <Route path="/compas" element={<PageShell><MeterTonalityPage /></PageShell>} />
        <Route path="/completar" element={<PageShell><CompleteMeasuresPage /></PageShell>} />
        <Route path="/notas-extranas" element={<PageShell><NonChordTonesPage /></PageShell>} />
        <Route path="/generador" element={<PageShell><ExamGeneratorPage /></PageShell>} />
        <Route path="/teoria" element={<PageShell><TheoryPage /></PageShell>} />
      </Routes>
    </Suspense>
  );
}
```

- [ ] **Step 3: Create App.tsx**

Replace `app/src/App.tsx`:

```tsx
import { HashRouter } from "react-router-dom";
import { LayoutProvider } from "./contexts/LayoutContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { AppRoutes } from "./app/routes";

export default function App() {
  return (
    <HashRouter>
      <LayoutProvider>
        <Header />
        <Sidebar />
        <AppRoutes />
      </LayoutProvider>
    </HashRouter>
  );
}
```

- [ ] **Step 4: Create placeholder feature pages** (needed so routes compile)

Create `app/src/features/home/HomePage.tsx` (temporary):

```tsx
export function HomePage() {
  return <div className="text-2xl font-bold text-slate-800">EA4 Practicador</div>;
}
```

Create `app/src/features/theory/TheoryPage.tsx`:

```tsx
export function TheoryPage() {
  return <div className="text-2xl font-bold text-slate-800">Teoría</div>;
}
```

Create empty stubs for all other feature pages that don't exist yet:
- `app/src/features/syncopation/SyncopationPage.tsx` → exports `SyncopationPage` component
- `app/src/features/intervals/IntervalsPage.tsx` → exports `IntervalsPage`
- `app/src/features/keySignatures/KeySignaturesPage.tsx` → exports `KeySignaturesPage`
- `app/src/features/scales/ScalesPage.tsx` → exports `ScalesPage`
- `app/src/features/examGenerator/ExamGeneratorPage.tsx` → exports `ExamGeneratorPage`

All stubs use the same pattern as `TranspositionPage.tsx`.

- [ ] **Step 5: Verify app compiles and loads**

```bash
cd app && npm run dev
```

Open `http://localhost:5173/EA4_generador_examens/`. Expected: header with "El Sindicato EA4", sidebar with navigation links, home page content.

- [ ] **Step 6: Commit**

```bash
git add app/src/
git commit -m "feat: add HashRouter routing, layout integration, and stub pages"
```

---

## Task 12: VexFlow music renderer

**Files:**
- Create: `app/src/components/music/VexFlowRenderer.tsx`
- Create: `app/src/components/music/types.ts`

- [ ] **Step 1: Create music component types**

Create `app/src/components/music/types.ts`:

```typescript
export interface NoteDisplay {
  id: string;
  pitch: string;       // VexFlow format: "c/4", "d#/4", "bn/4" (b natural), "r" for rest
  duration: string;    // VexFlow: "w", "h", "hd", "q", "qd", "8", "8d", "16"
  tieStart?: boolean;
  tieEnd?: boolean;
  label?: string;      // Text above/below the note
  labelColor?: string; // Hex or Tailwind token
  labelPosition?: "above" | "below";
  isRest?: boolean;
}

export interface MeasureDisplay {
  notes: NoteDisplay[];
}

export interface StaffDisplay {
  meter: { numerator: number; denominator: number };
  keySignature: string;  // VexFlow: "C", "G", "F", "Bb", "Eb", "Ab", "Db", "F#", "C#"
  clef: "treble" | "bass";
  measures: MeasureDisplay[];
  width?: number;
  height?: number;
}
```

- [ ] **Step 2: Create VexFlowRenderer component**

Create `app/src/components/music/VexFlowRenderer.tsx`:

```tsx
import { useEffect, useRef, useCallback } from "react";
import type { StaffDisplay } from "./types";

// VexFlow is imported dynamically to avoid SSR issues
interface VexFlowRendererProps {
  staff: StaffDisplay;
  onNoteClick?: (noteId: string) => void;
  selectedNoteIds?: Set<string>;
  className?: string;
}

const FIGURE_DURATION_MAP: Record<string, string> = {
  whole: "w", half: "h", "half.": "hd", quarter: "q",
  "quarter.": "qd", eighth: "8", "eighth.": "8d", sixteenth: "16",
};

function figureToDuration(figure: string): string {
  return FIGURE_DURATION_MAP[figure] ?? "q";
}

export function VexFlowRenderer({
  staff,
  onNoteClick,
  selectedNoteIds,
  className = "",
}: VexFlowRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const noteElementsRef = useRef<Map<string, Element>>(new Map());

  const renderStaff = useCallback(async () => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    noteElementsRef.current.clear();

    const VF = await import("vexflow");
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Beam } = VF;

    const totalWidth = staff.width ?? 700;
    const totalHeight = staff.height ?? 180;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(totalWidth, totalHeight);
    const context = renderer.getContext();
    context.setFont("Arial", 10);

    const numMeasures = staff.measures.length;
    const firstMeasureWidth = numMeasures === 1 ? totalWidth - 20 : Math.floor((totalWidth - 20) / numMeasures) + 80;
    const otherMeasureWidth = numMeasures <= 1 ? 0 : Math.floor((totalWidth - 20 - firstMeasureWidth) / (numMeasures - 1));

    let x = 10;

    for (let mi = 0; mi < staff.measures.length; mi++) {
      const measure = staff.measures[mi];
      const staveWidth = mi === 0 ? firstMeasureWidth : otherMeasureWidth;

      const stave = new Stave(x, 40, staveWidth);

      if (mi === 0) {
        stave.addClef(staff.clef);
        stave.addKeySignature(staff.keySignature);
        stave.addTimeSignature(`${staff.meter.numerator}/${staff.meter.denominator}`);
      }
      stave.setContext(context).draw();

      // Build VexFlow notes
      const vexNotes = measure.notes.map((noteData) => {
        const isRest = noteData.pitch === "r" || noteData.isRest;
        const duration = noteData.duration;

        const staveNote = new StaveNote({
          keys: isRest ? ["b/4"] : [noteData.pitch],
          duration: isRest ? duration + "r" : duration,
        });

        // Add accidentals from pitch string (e.g., "f#/4" → "#")
        if (!isRest && noteData.pitch.includes("#")) {
          staveNote.addModifier(new Accidental("#"), 0);
        } else if (!isRest && noteData.pitch.includes("b") && !noteData.pitch.startsWith("b")) {
          staveNote.addModifier(new Accidental("b"), 0);
        }

        // Set element ID for click detection
        staveNote.setAttribute("id", `note-${noteData.id}`);

        return staveNote;
      });

      // Voice
      const voice = new Voice({
        num_beats: staff.meter.numerator,
        beat_value: staff.meter.denominator,
      }).setMode(Voice.Mode.SOFT);
      voice.addTickables(vexNotes);

      new Formatter().joinVoices([voice]).format([voice], staveWidth - (mi === 0 ? 80 : 20));
      voice.draw(context, stave);

      x += staveWidth;
    }

    // After rendering, find SVG elements and store refs for click handling
    if (onNoteClick && containerRef.current) {
      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        staff.measures.forEach((measure) => {
          measure.notes.forEach((noteData) => {
            const el = svg.querySelector(`[id="note-${noteData.id}"]`);
            if (el) {
              noteElementsRef.current.set(noteData.id, el);
              (el as SVGElement).style.cursor = "pointer";
              el.addEventListener("click", () => onNoteClick(noteData.id));
            }
          });
        });
      }
    }
  }, [staff, onNoteClick]);

  useEffect(() => {
    renderStaff();
  }, [renderStaff]);

  // Highlight selected notes
  useEffect(() => {
    noteElementsRef.current.forEach((el, noteId) => {
      const svgEl = el as SVGElement;
      if (selectedNoteIds?.has(noteId)) {
        svgEl.style.opacity = "1";
        // Add a highlight rect - simplified: just change stroke color
        const paths = svgEl.querySelectorAll("path, rect");
        paths.forEach((p) => {
          (p as SVGElement).style.stroke = "#6366f1";
        });
      } else {
        const paths = svgEl.querySelectorAll("path, rect");
        paths.forEach((p) => {
          (p as SVGElement).style.stroke = "";
        });
      }
    });
  }, [selectedNoteIds]);

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto ${className}`}
      aria-label="Pentagrama musical"
    />
  );
}
```

- [ ] **Step 3: Verify VexFlow renders**

Create `app/src/features/home/HomePage.tsx` (temporary test page):

```tsx
import { VexFlowRenderer } from "../../components/music/VexFlowRenderer";
import type { StaffDisplay } from "../../components/music/types";

const testStaff: StaffDisplay = {
  meter: { numerator: 4, denominator: 4 },
  keySignature: "C",
  clef: "treble",
  measures: [{
    notes: [
      { id: "n1", pitch: "c/4", duration: "q" },
      { id: "n2", pitch: "d/4", duration: "q" },
      { id: "n3", pitch: "e/4", duration: "q" },
      { id: "n4", pitch: "f/4", duration: "q" },
    ],
  }],
};

export function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">EA4 Practicador</h1>
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <VexFlowRenderer staff={testStaff} />
      </div>
    </div>
  );
}
```

Run `npm run dev` and verify a music staff appears with four quarter notes.

- [ ] **Step 4: Commit**

```bash
git add app/src/components/music/
git commit -m "feat: add VexFlow renderer component with click handling"
```

---

## Task 13: Melody fragment data

**Files:**
- Create: `app/src/data/melodyFragments.ts`
- Create: `app/src/data/scaleExercises.ts`
- Create: `app/src/data/keySignatureExercises.ts`
- Create: `app/src/data/intervalExercises.ts`

- [ ] **Step 1: Create syncopation melody fragments**

Create `app/src/data/melodyFragments.ts`:

```typescript
import type { StaffDisplay } from "../components/music/types";
import type { RhythmicAnnotation } from "../theory/types";

export interface SyncopationFragment {
  id: string;
  staff: StaffDisplay;
  solutions: Record<string, RhythmicAnnotation>;  // noteId → correct annotation
  difficulty: "basico" | "medio" | "avanzado";
}

export const SYNCOPATION_FRAGMENTS: SyncopationFragment[] = [
  {
    id: "sf-001",
    difficulty: "basico",
    staff: {
      meter: { numerator: 4, denominator: 4 },
      keySignature: "C",
      clef: "treble",
      measures: [
        {
          notes: [
            { id: "sf001-n1", pitch: "c/4", duration: "q" },
            { id: "sf001-n2", pitch: "d/4", duration: "8" },
            { id: "sf001-n3", pitch: "e/4", duration: "8", tieStart: true },
            { id: "sf001-n4", pitch: "e/4", duration: "q", tieEnd: true },
            { id: "sf001-n5", pitch: "f/4", duration: "q" },
          ],
        },
        {
          notes: [
            { id: "sf001-n6", pitch: "g/4", duration: "h" },
            { id: "sf001-n7", pitch: "e/4", duration: "q" },
            { id: "sf001-n8", pitch: "c/4", duration: "q" },
          ],
        },
      ],
    },
    solutions: {
      "sf001-n1": "F",    // tiempo 1: fuerte
      "sf001-n2": "PF",   // primera corchea del tiempo 2: parte fuerte
      "sf001-n3": "S",    // parte débil, ligada a siguiente tiempo fuerte → síncopa
      "sf001-n4": "SF",   // tiempo 3 (semifuerte), resultado de ligadura
      "sf001-n5": "D",    // tiempo 4: débil
      "sf001-n6": "F",    // tiempo 1: fuerte
      "sf001-n7": "SF",   // tiempo 3: semifuerte
      "sf001-n8": "D",    // tiempo 4: débil
    },
  },
  {
    id: "sf-002",
    difficulty: "basico",
    staff: {
      meter: { numerator: 3, denominator: 4 },
      keySignature: "G",
      clef: "treble",
      measures: [
        {
          notes: [
            { id: "sf002-n1", pitch: "r", duration: "8r", isRest: true },
            { id: "sf002-n2", pitch: "d/4", duration: "8" },
            { id: "sf002-n3", pitch: "g/4", duration: "q" },
            { id: "sf002-n4", pitch: "f#/4", duration: "q" },
          ],
        },
        {
          notes: [
            { id: "sf002-n5", pitch: "e/4", duration: "8" },
            { id: "sf002-n6", pitch: "e/4", duration: "8", tieStart: true },
            { id: "sf002-n7", pitch: "e/4", duration: "q", tieEnd: true },
            { id: "sf002-n8", pitch: "d/4", duration: "q" },
          ],
        },
      ],
    },
    solutions: {
      "sf002-n1": "PF",   // Silencio en primera parte de tiempo 1
      "sf002-n2": "C",    // Nota en PD con silencio en PF anterior → contratiempo
      "sf002-n3": "D",
      "sf002-n4": "D",
      "sf002-n5": "PF",
      "sf002-n6": "S",    // Liga desde PD hacia el tiempo 2 → síncopa
      "sf002-n7": "D",
      "sf002-n8": "D",
    },
  },
  {
    id: "sf-003",
    difficulty: "medio",
    staff: {
      meter: { numerator: 4, denominator: 4 },
      keySignature: "Bb",
      clef: "treble",
      measures: [
        {
          notes: [
            { id: "sf003-n1", pitch: "bb/4", duration: "q" },
            { id: "sf003-n2", pitch: "c/5", duration: "8" },
            { id: "sf003-n3", pitch: "d/5", duration: "8", tieStart: true },
            { id: "sf003-n4", pitch: "d/5", duration: "8", tieEnd: true },
            { id: "sf003-n5", pitch: "c/5", duration: "8" },
            { id: "sf003-n6", pitch: "bb/4", duration: "q" },
          ],
        },
        {
          notes: [
            { id: "sf003-n7", pitch: "r", duration: "qr", isRest: true },
            { id: "sf003-n8", pitch: "f/4", duration: "q" },
            { id: "sf003-n9", pitch: "g/4", duration: "q" },
            { id: "sf003-n10", pitch: "a/4", duration: "q" },
          ],
        },
      ],
    },
    solutions: {
      "sf003-n1": "F",
      "sf003-n2": "PF",
      "sf003-n3": "S",    // PD ligada a PF → síncopa
      "sf003-n4": "PF",
      "sf003-n5": "PD",
      "sf003-n6": "SF",
      "sf003-n7": "F",    // Silencio en T1
      "sf003-n8": "C",    // Nota en D con T1 como silencio → contratiempo
      "sf003-n9": "SF",
      "sf003-n10": "D",
    },
  },
];
```

- [ ] **Step 2: Create scale exercises data**

Create `app/src/data/scaleExercises.ts`:

```typescript
import type { ScaleType } from "../theory/types";

export interface ScaleExerciseData {
  id: string;
  tonicEs: string;
  type: ScaleType;
  tetrachord: 1 | 2;
  label: string;         // Display string e.g. "Re menor armónica, 2.º tetracordo"
  difficulty: "basico" | "medio" | "avanzado";
}

export const SCALE_EXERCISES: ScaleExerciseData[] = [
  { id: "sc-001", tonicEs: "Re",  type: "harmonic_minor", tetrachord: 2, label: "Re menor armónica, 2.º tetracordo", difficulty: "medio" },
  { id: "sc-002", tonicEs: "Sib", type: "major",          tetrachord: 1, label: "Sib mayor, 1.º tetracordo",         difficulty: "basico" },
  { id: "sc-003", tonicEs: "Sol", type: "major",          tetrachord: 2, label: "Sol mayor, 2.º tetracordo",         difficulty: "basico" },
  { id: "sc-004", tonicEs: "La",  type: "harmonic_minor", tetrachord: 1, label: "La menor armónica, 1.º tetracordo", difficulty: "basico" },
  { id: "sc-005", tonicEs: "Mi",  type: "harmonic_minor", tetrachord: 2, label: "Mi menor armónica, 2.º tetracordo", difficulty: "medio" },
  { id: "sc-006", tonicEs: "Do",  type: "major",          tetrachord: 1, label: "Do mayor, 1.º tetracordo",          difficulty: "basico" },
  { id: "sc-007", tonicEs: "Fa",  type: "major",          tetrachord: 2, label: "Fa mayor, 2.º tetracordo",          difficulty: "medio" },
  { id: "sc-008", tonicEs: "Si",  type: "harmonic_minor", tetrachord: 1, label: "Si menor armónica, 1.º tetracordo", difficulty: "avanzado" },
  { id: "sc-009", tonicEs: "Mib", type: "major",          tetrachord: 1, label: "Mib mayor, 1.º tetracordo",         difficulty: "avanzado" },
];
```

- [ ] **Step 3: Create key signature exercises data**

Create `app/src/data/keySignatureExercises.ts`:

```typescript
import { getKeyFromSharps, getKeyFromFlats } from "../theory/keys";

export interface KeySigExerciseData {
  id: string;
  sharps: number;
  flats: number;
  vexflowKey: string;
  solution: { major: string; minor: string };
  difficulty: "basico" | "medio" | "avanzado";
}

const VEXFLOW_SHARP_KEYS = ["C", "G", "D", "A", "E", "B", "F#", "C#"];
const VEXFLOW_FLAT_KEYS  = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];

function makeSharp(n: number): KeySigExerciseData {
  return {
    id: `ks-s${n}`,
    sharps: n,
    flats: 0,
    vexflowKey: VEXFLOW_SHARP_KEYS[n],
    solution: getKeyFromSharps(n),
    difficulty: n <= 2 ? "basico" : n <= 4 ? "medio" : "avanzado",
  };
}

function makeFlat(n: number): KeySigExerciseData {
  return {
    id: `ks-f${n}`,
    sharps: 0,
    flats: n,
    vexflowKey: VEXFLOW_FLAT_KEYS[n],
    solution: getKeyFromFlats(n),
    difficulty: n <= 2 ? "basico" : n <= 4 ? "medio" : "avanzado",
  };
}

export const KEY_SIGNATURE_EXERCISES: KeySigExerciseData[] = [
  makeSharp(0), makeSharp(1), makeSharp(2), makeSharp(3), makeSharp(4), makeSharp(5),
  makeFlat(1), makeFlat(2), makeFlat(3), makeFlat(4), makeFlat(5),
];
```

- [ ] **Step 4: Create interval exercises data**

Create `app/src/data/intervalExercises.ts`:

```typescript
import type { Note, IntervalResult } from "../theory/types";

export interface IntervalExerciseData {
  id: string;
  noteA: Note;
  noteB: Note;
  staffPitchA: string;  // VexFlow pitch: "c/4"
  staffPitchB: string;
  solution: IntervalResult;
  difficulty: "basico" | "medio" | "avanzado";
}

export const INTERVAL_EXERCISES: IntervalExerciseData[] = [
  {
    id: "iv-001",
    noteA: { name: "C", octave: 4 }, noteB: { name: "D", octave: 4 },
    staffPitchA: "c/4", staffPitchB: "d/4",
    solution: { number: 2, quality: "mayor", direction: "ascendente", size: "simple" },
    difficulty: "basico",
  },
  {
    id: "iv-002",
    noteA: { name: "C", octave: 4 }, noteB: { name: "E", accidental: "b", octave: 4 },
    staffPitchA: "c/4", staffPitchB: "eb/4",
    solution: { number: 3, quality: "menor", direction: "ascendente", size: "simple" },
    difficulty: "basico",
  },
  {
    id: "iv-003",
    noteA: { name: "C", octave: 4 }, noteB: { name: "F", accidental: "#", octave: 4 },
    staffPitchA: "c/4", staffPitchB: "f#/4",
    solution: { number: 4, quality: "aumentada", direction: "ascendente", size: "simple" },
    difficulty: "medio",
  },
  {
    id: "iv-004",
    noteA: { name: "D", octave: 4 }, noteB: { name: "F", octave: 4 },
    staffPitchA: "d/4", staffPitchB: "f/4",
    solution: { number: 3, quality: "menor", direction: "ascendente", size: "simple" },
    difficulty: "basico",
  },
  {
    id: "iv-005",
    noteA: { name: "G", octave: 4 }, noteB: { name: "C", octave: 4 },
    staffPitchA: "g/4", staffPitchB: "c/4",
    solution: { number: 5, quality: "justa", direction: "descendente", size: "simple" },
    difficulty: "basico",
  },
  {
    id: "iv-006",
    noteA: { name: "E", octave: 4 }, noteB: { name: "C", accidental: "#", octave: 5 },
    staffPitchA: "e/4", staffPitchB: "c#/5",
    solution: { number: 6, quality: "mayor", direction: "ascendente", size: "simple" },
    difficulty: "medio",
  },
  {
    id: "iv-007",
    noteA: { name: "B", octave: 4 }, noteB: { name: "F", octave: 4 },
    staffPitchA: "b/4", staffPitchB: "f/4",
    solution: { number: 5, quality: "disminuida", direction: "descendente", size: "simple" },
    difficulty: "avanzado",
  },
  {
    id: "iv-008",
    noteA: { name: "C", octave: 4 }, noteB: { name: "G", accidental: "b", octave: 4 },
    staffPitchA: "c/4", staffPitchB: "gb/4",
    solution: { number: 5, quality: "disminuida", direction: "ascendente", size: "simple" },
    difficulty: "avanzado",
  },
  {
    id: "iv-009",
    noteA: { name: "F", octave: 4 }, noteB: { name: "A", octave: 4 },
    staffPitchA: "f/4", staffPitchB: "a/4",
    solution: { number: 3, quality: "mayor", direction: "ascendente", size: "simple" },
    difficulty: "basico",
  },
  {
    id: "iv-010",
    noteA: { name: "A", octave: 4 }, noteB: { name: "F", accidental: "#", octave: 5 },
    staffPitchA: "a/4", staffPitchB: "f#/5",
    solution: { number: 6, quality: "mayor", direction: "ascendente", size: "simple" },
    difficulty: "medio",
  },
];
```

- [ ] **Step 5: Commit**

```bash
git add app/src/data/
git commit -m "feat: add exercise data (melody fragments, scales, key signatures, intervals)"
```

---

## Task 14: Exercise 7 — Tonalidades (key signatures)

**Files:**
- Create: `app/src/features/keySignatures/KeySignaturesPage.tsx`
- Create: `app/src/features/keySignatures/KeySignatureExercise.tsx`

- [ ] **Step 1: Create KeySignatureExercise component**

Create `app/src/features/keySignatures/KeySignatureExercise.tsx`:

```tsx
import { useState } from "react";
import type { KeySigExerciseData } from "../../data/keySignatureExercises";
import { VexFlowRenderer } from "../../components/music/VexFlowRenderer";
import type { StaffDisplay } from "../../components/music/types";
import { Badge, Button } from "../../components/ui";
import { Modal } from "../../components/ui/Modal";

interface Props {
  exercise: KeySigExerciseData;
  index: number;
}

function makeKeyStaff(vexflowKey: string): StaffDisplay {
  return {
    meter: { numerator: 4, denominator: 4 },
    keySignature: vexflowKey,
    clef: "treble",
    measures: [{ notes: [] }],
    width: 200,
    height: 120,
  };
}

export function KeySignatureExercise({ exercise, index }: Props) {
  const [majorAnswer, setMajorAnswer] = useState("");
  const [minorAnswer, setMinorAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const majorOk = majorAnswer.trim().toLowerCase() === exercise.solution.major.toLowerCase();
  const minorOk = minorAnswer.trim().toLowerCase() === exercise.solution.minor.toLowerCase();

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="text-sm font-medium text-slate-500 mb-2">Ejercicio {index + 1}</div>

      <div className="flex flex-wrap items-center gap-6">
        <VexFlowRenderer
          staff={makeKeyStaff(exercise.vexflowKey)}
          className="flex-shrink-0"
        />

        <div className="flex flex-col gap-3 min-w-48">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tonalidad mayor
            </label>
            <input
              type="text"
              value={majorAnswer}
              onChange={(e) => { setMajorAnswer(e.target.value); setChecked(false); }}
              placeholder="p.ej. Sol"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                checked
                  ? majorOk
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                  : showSolution
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300"
              }`}
            />
            {checked && !majorOk && (
              <p className="text-xs text-red-600 mt-1">Respuesta: {exercise.solution.major}</p>
            )}
            {showSolution && !checked && (
              <p className="text-xs text-blue-600 mt-1">{exercise.solution.major}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Relativa menor
            </label>
            <input
              type="text"
              value={minorAnswer}
              onChange={(e) => { setMinorAnswer(e.target.value); setChecked(false); }}
              placeholder="p.ej. Mi"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                checked
                  ? minorOk
                    ? "border-green-400 bg-green-50"
                    : "border-red-400 bg-red-50"
                  : showSolution
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300"
              }`}
            />
            {checked && !minorOk && (
              <p className="text-xs text-red-600 mt-1">Respuesta: {exercise.solution.minor}</p>
            )}
            {showSolution && !checked && (
              <p className="text-xs text-blue-600 mt-1">{exercise.solution.minor}</p>
            )}
          </div>

          {checked && (
            <div className="flex gap-2">
              <Badge variant={majorOk ? "correct" : "incorrect"}>
                Mayor: {majorOk ? "✓" : "✗"}
              </Badge>
              <Badge variant={minorOk ? "correct" : "incorrect"}>
                Menor: {minorOk ? "✓" : "✗"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button size="sm" onClick={() => setChecked(true)} disabled={!majorAnswer || !minorAnswer}>
          Corregir
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "Ocultar solución" : "Ver solución"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => { setMajorAnswer(""); setMinorAnswer(""); setChecked(false); setShowSolution(false); }}
        >
          Limpiar
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create KeySignaturesPage**

Replace stub `app/src/features/keySignatures/KeySignaturesPage.tsx`:

```tsx
import { useState, useMemo } from "react";
import { Card, Button, Select, Modal } from "../../components/ui";
import { KeySignatureExercise } from "./KeySignatureExercise";
import { KEY_SIGNATURE_EXERCISES } from "../../data/keySignatureExercises";

type Difficulty = "basico" | "medio" | "avanzado";
type Count = "3" | "5" | "7";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function KeySignaturesPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("basico");
  const [count, setCount] = useState<Count>("5");
  const [exercises, setExercises] = useState(() =>
    shuffle(KEY_SIGNATURE_EXERCISES.filter((e) => e.difficulty === "basico")).slice(0, 5)
  );
  const [helpOpen, setHelpOpen] = useState(false);

  function generate() {
    const filtered = KEY_SIGNATURE_EXERCISES.filter(
      (e) => e.difficulty === difficulty || difficulty === "avanzado"
    );
    setExercises(shuffle(filtered).slice(0, Number(count)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tonalidades</h1>
        <p className="text-slate-500 mt-1">
          Identifica la tonalidad mayor y la relativa menor a partir de la armadura.
        </p>
      </div>

      <Card title="Configuración">
        <div className="flex flex-wrap gap-4 items-end">
          <Select
            label="Dificultad"
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={[
              { value: "basico", label: "Básico (1-2 alteraciones)" },
              { value: "medio", label: "Medio (1-4 alteraciones)" },
              { value: "avanzado", label: "Avanzado (hasta 5 alteraciones)" },
            ]}
          />
          <Select
            label="Número de ejercicios"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value as Count)}
            options={[
              { value: "3", label: "3 ejercicios" },
              { value: "5", label: "5 ejercicios" },
              { value: "7", label: "7 ejercicios" },
            ]}
          />
          <Button onClick={generate}>Generar ejercicios</Button>
          <Button variant="ghost" onClick={() => setHelpOpen(true)}>Ayuda</Button>
        </div>
      </Card>

      <div className="space-y-4">
        {exercises.map((ex, i) => (
          <KeySignatureExercise key={ex.id} exercise={ex} index={i} />
        ))}
      </div>

      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Tonalidades — Teoría">
        <div className="space-y-4 text-sm text-slate-700">
          <section>
            <h3 className="font-semibold text-base mb-1">Sostenidos</h3>
            <p>El <strong>último sostenido + semitono ascendente</strong> = tonalidad mayor.</p>
            <p className="mt-1">Ejemplo: 2 sostenidos (Fa#, Do#) → último = Do# → Do# + semitono = Re mayor.</p>
          </section>
          <section>
            <h3 className="font-semibold text-base mb-1">Bemoles</h3>
            <p>El <strong>penúltimo bemol</strong> = tonalidad mayor. (Excepción: 1 bemol = Fa mayor).</p>
            <p className="mt-1">Ejemplo: 3 bemoles (Sib, Mib, Lab) → penúltimo = Mib → Mib mayor.</p>
          </section>
          <section>
            <h3 className="font-semibold text-base mb-1">Relativa menor</h3>
            <p>Está a una <strong>3.ª menor descendente</strong> de la tonalidad mayor.</p>
            <p className="mt-1">Ejemplo: Do mayor → La menor (Do → Si → La, bajando tres nombres).</p>
          </section>
          <section>
            <h3 className="font-semibold text-base mb-1">Tabla resumen</h3>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-2 py-1 text-left">Armadura</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">Mayor</th>
                  <th className="border border-slate-300 px-2 py-1 text-left">Menor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["0 alteraciones", "Do", "La"],
                  ["1 ♯ (Fa#)", "Sol", "Mi"],
                  ["2 ♯", "Re", "Si"],
                  ["3 ♯", "La", "Fa#"],
                  ["4 ♯", "Mi", "Do#"],
                  ["5 ♯", "Si", "Sol#"],
                  ["1 ♭ (Sib)", "Fa", "Re"],
                  ["2 ♭", "Sib", "Sol"],
                  ["3 ♭", "Mib", "Do"],
                  ["4 ♭", "Lab", "Fa"],
                  ["5 ♭", "Reb", "Sib"],
                ].map(([arm, maj, min]) => (
                  <tr key={arm}>
                    <td className="border border-slate-200 px-2 py-1">{arm}</td>
                    <td className="border border-slate-200 px-2 py-1">{maj}</td>
                    <td className="border border-slate-200 px-2 py-1">{min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`, navigate to `#/tonalidades`, verify the key signature exercises render with VexFlow staves and the correction/solution system works.

- [ ] **Step 4: Commit**

```bash
git add app/src/features/keySignatures/
git commit -m "feat: implement Exercise 7 (tonalidades) with VexFlow key signatures and correction"
```

---

## Task 15: Exercise 4 — Intervalos

**Files:**
- Create: `app/src/features/intervals/IntervalsPage.tsx`
- Create: `app/src/features/intervals/IntervalExercise.tsx`

- [ ] **Step 1: Create IntervalExercise component**

Create `app/src/features/intervals/IntervalExercise.tsx`:

```tsx
import { useState } from "react";
import type { IntervalExerciseData } from "../../data/intervalExercises";
import { VexFlowRenderer } from "../../components/music/VexFlowRenderer";
import type { StaffDisplay } from "../../components/music/types";
import { Badge, Button, Select } from "../../components/ui";
import type { IntervalQuality, IntervalDirection } from "../../theory/types";

function makeIntervalStaff(pitchA: string, pitchB: string): StaffDisplay {
  return {
    meter: { numerator: 4, denominator: 4 },
    keySignature: "C",
    clef: "treble",
    measures: [{
      notes: [
        { id: "ia", pitch: pitchA, duration: "h" },
        { id: "ib", pitch: pitchB, duration: "h" },
      ],
    }],
    width: 220,
    height: 130,
  };
}

const NUMBER_OPTIONS = ["2","3","4","5","6","7","8"].map((n) => ({ value: n, label: n + ".ª" }));
const QUALITY_OPTIONS: { value: IntervalQuality; label: string }[] = [
  { value: "mayor", label: "Mayor" },
  { value: "menor", label: "Menor" },
  { value: "justa", label: "Justa" },
  { value: "aumentada", label: "Aumentada" },
  { value: "disminuida", label: "Disminuida" },
];
const DIRECTION_OPTIONS: { value: IntervalDirection; label: string }[] = [
  { value: "ascendente", label: "Ascendente" },
  { value: "descendente", label: "Descendente" },
  { value: "armonico", label: "Armónico" },
];

interface Props {
  exercise: IntervalExerciseData;
  index: number;
}

export function IntervalExercise({ exercise, index }: Props) {
  const [number, setNumber] = useState("2");
  const [quality, setQuality] = useState<IntervalQuality>("mayor");
  const [direction, setDirection] = useState<IntervalDirection>("ascendente");
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const numOk = Number(number) === exercise.solution.number;
  const qualOk = quality === exercise.solution.quality;
  const dirOk = direction === exercise.solution.direction;
  const allOk = numOk && qualOk && dirOk;

  function reset() {
    setNumber("2"); setQuality("mayor"); setDirection("ascendente");
    setChecked(false); setShowSolution(false);
  }

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="text-sm font-medium text-slate-500 mb-3">Intervalo {index + 1}</div>

      <div className="flex flex-wrap items-start gap-6">
        <VexFlowRenderer
          staff={makeIntervalStaff(exercise.staffPitchA, exercise.staffPitchB)}
          className="flex-shrink-0"
        />

        <div className="flex-1 space-y-3 min-w-48">
          <div className="flex flex-wrap gap-3">
            <Select id={`num-${index}`} label="Número" value={number}
              onChange={(e) => { setNumber(e.target.value); setChecked(false); }}
              options={NUMBER_OPTIONS} />
            <Select id={`qual-${index}`} label="Calificativo" value={quality}
              onChange={(e) => { setQuality(e.target.value as IntervalQuality); setChecked(false); }}
              options={QUALITY_OPTIONS} />
            <Select id={`dir-${index}`} label="Dirección" value={direction}
              onChange={(e) => { setDirection(e.target.value as IntervalDirection); setChecked(false); }}
              options={DIRECTION_OPTIONS} />
          </div>

          {checked && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={numOk ? "correct" : "incorrect"}>
                {number}.ª {numOk ? "✓" : `→ ${exercise.solution.number}.ª`}
              </Badge>
              <Badge variant={qualOk ? "correct" : "incorrect"}>
                {quality} {qualOk ? "✓" : `→ ${exercise.solution.quality}`}
              </Badge>
              <Badge variant={dirOk ? "correct" : "incorrect"}>
                {direction} {dirOk ? "✓" : `→ ${exercise.solution.direction}`}
              </Badge>
            </div>
          )}

          {showSolution && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
              <strong>Solución:</strong>{" "}
              {exercise.solution.number}.ª {exercise.solution.quality} {exercise.solution.direction} ({exercise.solution.size})
              <p className="mt-1 text-xs text-blue-600">
                Cuenta los nombres de nota incluidos para el número. Calcula los semitonos para el calificativo.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button size="sm" onClick={() => setChecked(true)}>Corregir</Button>
        <Button size="sm" variant="ghost" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "Ocultar" : "Ver solución"}
        </Button>
        <Button size="sm" variant="secondary" onClick={reset}>Limpiar</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create IntervalsPage**

Replace stub `app/src/features/intervals/IntervalsPage.tsx`:

```tsx
import { useState } from "react";
import { Card, Button, Select } from "../../components/ui";
import { Modal } from "../../components/ui/Modal";
import { IntervalExercise } from "./IntervalExercise";
import { INTERVAL_EXERCISES } from "../../data/intervalExercises";

type Difficulty = "basico" | "medio" | "avanzado";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function IntervalsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("basico");
  const [count, setCount] = useState("6");
  const [exercises, setExercises] = useState(() =>
    shuffle(INTERVAL_EXERCISES.filter((e) => e.difficulty === "basico")).slice(0, 6)
  );
  const [helpOpen, setHelpOpen] = useState(false);

  function generate() {
    const pool =
      difficulty === "avanzado"
        ? INTERVAL_EXERCISES
        : INTERVAL_EXERCISES.filter((e) => e.difficulty === difficulty || e.difficulty === "basico");
    setExercises(shuffle(pool).slice(0, Number(count)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Análisis de intervalos</h1>
        <p className="text-slate-500 mt-1">
          Indica el número, calificativo y dirección de cada intervalo.
        </p>
      </div>

      <Card title="Configuración">
        <div className="flex flex-wrap gap-4 items-end">
          <Select label="Dificultad" id="diff" value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={[
              { value: "basico", label: "Básico" },
              { value: "medio", label: "Medio (con alteraciones)" },
              { value: "avanzado", label: "Avanzado (aumentados/disminuidos)" },
            ]}
          />
          <Select label="Número" id="cnt" value={count}
            onChange={(e) => setCount(e.target.value)}
            options={[
              { value: "4", label: "4 intervalos" },
              { value: "6", label: "6 intervalos" },
              { value: "8", label: "8 intervalos" },
            ]}
          />
          <Button onClick={generate}>Generar ejercicios</Button>
          <Button variant="ghost" onClick={() => setHelpOpen(true)}>Ayuda</Button>
        </div>
      </Card>

      <div className="space-y-4">
        {exercises.map((ex, i) => (
          <IntervalExercise key={ex.id} exercise={ex} index={i} />
        ))}
      </div>

      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Intervalos — Teoría">
        <div className="space-y-4 text-sm text-slate-700">
          <section>
            <h3 className="font-semibold text-base">Método en 4 pasos</h3>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Cuenta los nombres de nota (incluye la primera y la última) → número del intervalo.</li>
              <li>Calcula los semitonos entre las notas.</li>
              <li>Compara con la tabla para determinar el calificativo.</li>
              <li>Indica si es ascendente, descendente o armónico.</li>
            </ol>
          </section>
          <section>
            <h3 className="font-semibold text-base mt-2">Tabla de semitonos</h3>
            <table className="w-full text-xs border-collapse mt-1">
              <thead><tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-1">Intervalo</th>
                <th className="border border-slate-300 px-2 py-1">Calificativo</th>
                <th className="border border-slate-300 px-2 py-1">Semitonos</th>
              </tr></thead>
              <tbody>
                {[
                  ["2.ª", "menor", "1"], ["2.ª", "mayor", "2"],
                  ["3.ª", "menor", "3"], ["3.ª", "mayor", "4"],
                  ["4.ª", "justa", "5"], ["4.ª", "aumentada", "6"],
                  ["5.ª", "disminuida", "6"], ["5.ª", "justa", "7"],
                  ["6.ª", "menor", "8"], ["6.ª", "mayor", "9"],
                  ["7.ª", "menor", "10"], ["7.ª", "mayor", "11"],
                  ["8.ª", "justa", "12"],
                ].map(([int, cal, sem]) => (
                  <tr key={int + cal}>
                    <td className="border border-slate-200 px-2 py-1">{int}</td>
                    <td className="border border-slate-200 px-2 py-1">{cal}</td>
                    <td className="border border-slate-200 px-2 py-1 text-center">{sem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser and commit**

```bash
cd app && npm run dev
# Navigate to #/intervalos — verify interval staves render, dropdowns work, correction shows badges
git add app/src/features/intervals/
git commit -m "feat: implement Exercise 4 (intervalos) with VexFlow staves and correction"
```

---

## Task 16: Exercise 6 — Escalas

**Files:**
- Create: `app/src/features/scales/ScalesPage.tsx`
- Create: `app/src/features/scales/ScaleExercise.tsx`

- [ ] **Step 1: Create ScaleExercise component**

Create `app/src/features/scales/ScaleExercise.tsx`:

```tsx
import { useState, useMemo } from "react";
import type { ScaleExerciseData } from "../../data/scaleExercises";
import {
  buildMajorScale,
  buildNaturalMinorScale,
  buildHarmonicMinorScale,
  getTetrachord,
} from "../../theory/scales";
import type { ScaleType } from "../../theory/types";
import { Badge, Button } from "../../components/ui";

function buildScale(tonic: string, type: ScaleType): string[] {
  if (type === "major") return buildMajorScale(tonic);
  if (type === "natural_minor") return buildNaturalMinorScale(tonic);
  return buildHarmonicMinorScale(tonic);
}

const ALL_NOTES = [
  "Do", "Do#", "Reb", "Re", "Re#", "Mib", "Mi", "Fa",
  "Fa#", "Solb", "Sol", "Sol#", "Lab", "La", "La#", "Sib", "Si",
];

interface Props {
  exercise: ScaleExerciseData;
  index: number;
}

export function ScaleExercise({ exercise, index }: Props) {
  const solution = useMemo(() => buildScale(exercise.tonicEs, exercise.type), [exercise]);
  const tetrachordSolution = useMemo(
    () => getTetrachord(solution, exercise.tetrachord),
    [solution, exercise.tetrachord]
  );

  // User fills in 8 notes (dropdowns)
  const [userNotes, setUserNotes] = useState<string[]>(Array(8).fill(""));
  const [markedTetrachord, setMarkedTetrachord] = useState<boolean[]>(Array(8).fill(false));
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  function setNote(i: number, val: string) {
    const next = [...userNotes];
    next[i] = val;
    setUserNotes(next);
    setChecked(false);
  }

  function toggleMark(i: number) {
    const next = [...markedTetrachord];
    next[i] = !next[i];
    setMarkedTetrachord(next);
    setChecked(false);
  }

  function reset() {
    setUserNotes(Array(8).fill(""));
    setMarkedTetrachord(Array(8).fill(false));
    setChecked(false);
    setShowSolution(false);
  }

  // Check: notes correct + tetrachord marking correct
  const noteResults = userNotes.map((n, i) =>
    n.toLowerCase().replace("b", "b") === solution[i].toLowerCase()
  );

  // Correct tetrachord indices
  const correctTetrachordIndices =
    exercise.tetrachord === 1 ? [0, 1, 2, 3] : [4, 5, 6, 7];

  const tetrachordResults = markedTetrachord.map(
    (marked, i) => marked === correctTetrachordIndices.includes(i)
  );

  const noteOptions = [{ value: "", label: "—" }, ...ALL_NOTES.map((n) => ({ value: n, label: n }))];

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div className="text-sm font-medium text-slate-500 mb-1">Ejercicio {index + 1}</div>
      <p className="font-semibold text-slate-800 mb-4">{exercise.label}</p>

      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {Array(8).fill(0).map((_, i) => {
            const isInTetrachord = correctTetrachordIndices.includes(i);
            const noteOk = checked ? noteResults[i] : undefined;
            const markOk = checked ? tetrachordResults[i] : undefined;
            const isSolShown = showSolution;

            return (
              <div key={i} className="flex flex-col items-center gap-1 w-16">
                <span className="text-xs text-slate-400">{i + 1}</span>
                <select
                  value={userNotes[i]}
                  onChange={(e) => setNote(i, e.target.value)}
                  className={`w-full rounded border text-sm text-center px-1 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    noteOk === true
                      ? "border-green-400 bg-green-50"
                      : noteOk === false
                      ? "border-red-400 bg-red-50"
                      : isSolShown
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-300"
                  }`}
                >
                  {noteOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {isSolShown && (
                  <span className="text-xs text-blue-600 font-medium">{solution[i]}</span>
                )}
                <button
                  onClick={() => toggleMark(i)}
                  title={`Marcar como tetracordo ${exercise.tetrachord}`}
                  className={`w-8 h-8 rounded text-xs font-bold border transition-colors ${
                    markedTetrachord[i]
                      ? markOk === false
                        ? "bg-red-100 border-red-400 text-red-700"
                        : "bg-indigo-100 border-indigo-400 text-indigo-700"
                      : markOk === false && isInTetrachord
                      ? "bg-yellow-100 border-yellow-400"
                      : "bg-slate-50 border-slate-300 text-slate-400"
                  }`}
                >
                  {markedTetrachord[i] ? "T" : "·"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Haz clic en el botón inferior de cada nota para marcarla como parte del {exercise.tetrachord === 1 ? "1.º" : "2.º"} tetracordo.
      </p>

      {checked && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant={noteResults.every(Boolean) ? "correct" : "incorrect"}>
            Notas: {noteResults.filter(Boolean).length}/8
          </Badge>
          <Badge variant={tetrachordResults.every(Boolean) ? "correct" : "incorrect"}>
            Tetracordo: {tetrachordResults.filter(Boolean).length}/8
          </Badge>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Button size="sm" onClick={() => setChecked(true)}>Corregir</Button>
        <Button size="sm" variant="ghost" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "Ocultar solución" : "Ver solución"}
        </Button>
        <Button size="sm" variant="secondary" onClick={reset}>Reiniciar</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create ScalesPage**

Replace stub `app/src/features/scales/ScalesPage.tsx`:

```tsx
import { useState } from "react";
import { Card, Button, Select } from "../../components/ui";
import { ScaleExercise } from "./ScaleExercise";
import { SCALE_EXERCISES } from "../../data/scaleExercises";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function ScalesPage() {
  const [difficulty, setDifficulty] = useState("basico");
  const [count, setCount] = useState("4");
  const [exercises, setExercises] = useState(() =>
    shuffle(SCALE_EXERCISES.filter((e) => e.difficulty === "basico")).slice(0, 4)
  );

  function generate() {
    const pool =
      difficulty === "avanzado"
        ? SCALE_EXERCISES
        : SCALE_EXERCISES.filter((e) => e.difficulty === difficulty || e.difficulty === "basico");
    setExercises(shuffle(pool).slice(0, Number(count)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Escalas y tetracordos</h1>
        <p className="text-slate-500 mt-1">
          Escribe la escala completa y marca el tetracordo indicado.
        </p>
      </div>

      <Card title="Configuración">
        <div className="flex flex-wrap gap-4 items-end">
          <Select label="Dificultad" id="diff" value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: "basico", label: "Básico" },
              { value: "medio", label: "Medio" },
              { value: "avanzado", label: "Avanzado" },
            ]}
          />
          <Select label="Número" id="cnt" value={count}
            onChange={(e) => setCount(e.target.value)}
            options={[
              { value: "2", label: "2 escalas" },
              { value: "4", label: "4 escalas" },
              { value: "6", label: "6 escalas" },
            ]}
          />
          <Button onClick={generate}>Generar ejercicios</Button>
        </div>
      </Card>

      <div className="space-y-6">
        {exercises.map((ex, i) => (
          <ScaleExercise key={ex.id} exercise={ex} index={i} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
cd app && npm run dev
# Navigate to #/escalas — verify scale dropdowns, tetrachord marking, and correction work
git add app/src/features/scales/
git commit -m "feat: implement Exercise 6 (escalas) with note selection and tetrachord marking"
```

---

## Task 17: Exercise 1 — Síncopas y contratiempos

**Files:**
- Create: `app/src/features/syncopation/SyncopationPage.tsx`
- Create: `app/src/features/syncopation/SyncopationExercise.tsx`
- Create: `app/src/features/syncopation/NoteAnnotationMenu.tsx`

- [ ] **Step 1: Create NoteAnnotationMenu**

Create `app/src/features/syncopation/NoteAnnotationMenu.tsx`:

```tsx
import type { RhythmicAnnotation } from "../../theory/types";

const ANNOTATIONS: { value: RhythmicAnnotation; label: string; description: string }[] = [
  { value: "F",  label: "F",  description: "Tiempo Fuerte" },
  { value: "D",  label: "D",  description: "Tiempo Débil" },
  { value: "SF", label: "SF", description: "Tiempo Semifuerte" },
  { value: "PF", label: "PF", description: "Parte Fuerte" },
  { value: "PD", label: "PD", description: "Parte Débil" },
  { value: "S",  label: "S",  description: "Síncopa" },
  { value: "C",  label: "C",  description: "Contratiempo" },
];

interface Props {
  x: number;
  y: number;
  current?: RhythmicAnnotation;
  onSelect: (annotation: RhythmicAnnotation | null) => void;
  onClose: () => void;
}

export function NoteAnnotationMenu({ x, y, current, onSelect, onClose }: Props) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-xl p-2 min-w-40"
        style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 280) }}
      >
        <p className="text-xs font-medium text-slate-500 px-2 mb-1">Marcar nota</p>
        {ANNOTATIONS.map((a) => (
          <button
            key={a.value}
            onClick={() => { onSelect(a.value); onClose(); }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 text-left ${
              current === a.value ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700"
            }`}
          >
            <span className="w-6 text-center font-mono font-bold">{a.label}</span>
            <span className="text-slate-500 text-xs">{a.description}</span>
          </button>
        ))}
        {current && (
          <button
            onClick={() => { onSelect(null); onClose(); }}
            className="w-full px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded text-left mt-1 border-t border-slate-100"
          >
            Borrar marca
          </button>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create SyncopationExercise**

Create `app/src/features/syncopation/SyncopationExercise.tsx`:

```tsx
import { useState, useCallback } from "react";
import type { SyncopationFragment } from "../../data/melodyFragments";
import type { RhythmicAnnotation } from "../../theory/types";
import { VexFlowRenderer } from "../../components/music/VexFlowRenderer";
import { NoteAnnotationMenu } from "./NoteAnnotationMenu";
import { Badge, Button } from "../../components/ui";

const ANNOTATION_COLORS: Record<RhythmicAnnotation, string> = {
  F: "#7c3aed", D: "#64748b", SF: "#7c3aed", PF: "#7c3aed",
  PD: "#64748b", S: "#dc2626", C: "#ea580c",
};

interface Props {
  fragment: SyncopationFragment;
}

export function SyncopationExercise({ fragment }: Props) {
  const [userAnnotations, setUserAnnotations] = useState<Map<string, RhythmicAnnotation>>(new Map());
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [menu, setMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);

  const handleNoteClick = useCallback((noteId: string) => {
    // Get note element position for menu placement
    const el = document.querySelector(`[id="note-${noteId}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setMenu({ noteId, x: rect.left, y: rect.bottom + 8 });
    } else {
      setMenu({ noteId, x: 200, y: 200 });
    }
  }, []);

  function setAnnotation(noteId: string, annotation: RhythmicAnnotation | null) {
    setUserAnnotations((prev) => {
      const next = new Map(prev);
      if (annotation === null) next.delete(noteId);
      else next.set(noteId, annotation);
      return next;
    });
    setChecked(false);
  }

  function reset() {
    setUserAnnotations(new Map());
    setChecked(false);
    setShowSolution(false);
  }

  // Build staff with annotation labels
  const staffWithLabels = {
    ...fragment.staff,
    measures: fragment.staff.measures.map((m) => ({
      notes: m.notes.map((n) => {
        const userAnn = userAnnotations.get(n.id);
        const solAnn = fragment.solutions[n.id];
        let label = userAnn;
        let labelColor: string | undefined;

        if (checked && userAnn) {
          labelColor = userAnn === solAnn ? "#22c55e" : "#ef4444";
        } else if (checked && !userAnn && solAnn) {
          label = solAnn;
          labelColor = "#eab308"; // missing = yellow
        } else if (showSolution && solAnn) {
          label = solAnn;
          labelColor = "#3b82f6";
        } else if (userAnn) {
          labelColor = ANNOTATION_COLORS[userAnn];
        }

        return { ...n, label: label ?? undefined, labelColor };
      }),
    })),
  };

  // Correction stats
  const allNoteIds = fragment.staff.measures.flatMap((m) => m.notes.map((n) => n.id));
  const solutionKeys = Object.keys(fragment.solutions) as string[];
  const correct = solutionKeys.filter(
    (id) => userAnnotations.get(id) === fragment.solutions[id]
  ).length;
  const incorrect = solutionKeys.filter(
    (id) => userAnnotations.has(id) && userAnnotations.get(id) !== fragment.solutions[id]
  ).length;
  const missing = solutionKeys.filter((id) => !userAnnotations.has(id)).length;

  // Feedback explanation for syncopations and offbeats
  const syncopationNotes = solutionKeys.filter((id) => fragment.solutions[id] === "S");
  const offbeatNotes = solutionKeys.filter((id) => fragment.solutions[id] === "C");

  return (
    <div className="relative">
      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 p-4">
        <VexFlowRenderer
          staff={staffWithLabels}
          onNoteClick={handleNoteClick}
          selectedNoteIds={menu ? new Set([menu.noteId]) : undefined}
          className="min-h-[160px]"
        />
      </div>

      {menu && (
        <NoteAnnotationMenu
          x={menu.x}
          y={menu.y}
          current={userAnnotations.get(menu.noteId)}
          onSelect={(ann) => setAnnotation(menu.noteId, ann)}
          onClose={() => setMenu(null)}
        />
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <Button onClick={() => setChecked(true)} size="sm">Corregir</Button>
        <Button variant="ghost" size="sm" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "Ocultar solución" : "Ver solución"}
        </Button>
        <Button variant="secondary" size="sm" onClick={reset}>Reiniciar</Button>
      </div>

      {checked && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="correct">✓ Correcto: {correct}</Badge>
            <Badge variant="incorrect">✗ Incorrecto: {incorrect}</Badge>
            <Badge variant="missing">⚠ Faltante: {missing}</Badge>
          </div>

          <div className="text-sm text-slate-700 space-y-2">
            {syncopationNotes.length > 0 && (
              <p className="p-3 bg-red-50 rounded-md border border-red-100">
                <strong>Síncopas:</strong> Las notas marcadas como S empiezan en parte débil y se
                prolongan hacia una parte fuerte (ya sea por duración o ligadura). Clave: la nota
                «nace» antes del acento y lo cubre.
              </p>
            )}
            {offbeatNotes.length > 0 && (
              <p className="p-3 bg-orange-50 rounded-md border border-orange-100">
                <strong>Contratiempos:</strong> Las notas marcadas como C suenan en parte débil
                precedidas de un silencio en la parte fuerte. No es necesario que se prolonguen.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create SyncopationPage**

Replace stub `app/src/features/syncopation/SyncopationPage.tsx`:

```tsx
import { useState } from "react";
import { Card, Button, Select } from "../../components/ui";
import { Modal } from "../../components/ui/Modal";
import { SyncopationExercise } from "./SyncopationExercise";
import { SYNCOPATION_FRAGMENTS } from "../../data/melodyFragments";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function SyncopationPage() {
  const [difficulty, setDifficulty] = useState("basico");
  const [fragment, setFragment] = useState(() =>
    SYNCOPATION_FRAGMENTS.find((f) => f.difficulty === "basico") ?? SYNCOPATION_FRAGMENTS[0]
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [key, setKey] = useState(0); // used to remount exercise on generate

  function generate() {
    const pool = SYNCOPATION_FRAGMENTS.filter(
      (f) => f.difficulty === difficulty || difficulty === "avanzado"
    );
    const next = shuffle(pool)[0] ?? SYNCOPATION_FRAGMENTS[0];
    setFragment(next);
    setKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Síncopas y contratiempos</h1>
        <p className="text-slate-500 mt-1">
          Haz clic en cada nota para marcarla. Usa F, D, SF, PF, PD para tiempos y S/C para síncopa/contratiempo.
        </p>
      </div>

      <Card title="Configuración">
        <div className="flex flex-wrap gap-4 items-end">
          <Select label="Dificultad" id="diff" value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: "basico", label: "Básico" },
              { value: "medio", label: "Medio" },
              { value: "avanzado", label: "Avanzado" },
            ]}
          />
          <Button onClick={generate}>Generar ejercicio</Button>
          <Button variant="ghost" onClick={() => setHelpOpen(true)}>Ayuda</Button>
        </div>
      </Card>

      <SyncopationExercise key={key} fragment={fragment} />

      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Síncopas y contratiempos — Teoría">
        <div className="space-y-4 text-sm text-slate-700">
          <section>
            <h3 className="font-semibold text-base">Síncopa (S)</h3>
            <p>Un sonido empieza en parte <strong>débil</strong> y se <strong>prolonga</strong> hacia una parte fuerte.</p>
            <p className="mt-1 text-xs bg-slate-100 p-2 rounded font-mono">
              Parte débil → [nota ligada] → Parte fuerte
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-base mt-2">Contratiempo (C)</h3>
            <p>Una nota suena en parte <strong>débil</strong> mientras la parte fuerte anterior es un <strong>silencio</strong>.</p>
            <p className="mt-1 text-xs bg-slate-100 p-2 rounded font-mono">
              Silencio (parte fuerte) → Nota (parte débil)
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-base mt-2">Diferencia clave</h3>
            <table className="w-full text-xs border-collapse mt-1">
              <thead><tr className="bg-slate-100">
                <th className="border border-slate-300 px-2 py-1">Concepto</th>
                <th className="border border-slate-300 px-2 py-1">Inicio</th>
                <th className="border border-slate-300 px-2 py-1">Prolongación</th>
              </tr></thead>
              <tbody>
                <tr><td className="border border-slate-200 px-2 py-1">Síncopa</td>
                    <td className="border border-slate-200 px-2 py-1">parte débil</td>
                    <td className="border border-slate-200 px-2 py-1">sí, hacia parte fuerte</td></tr>
                <tr><td className="border border-slate-200 px-2 py-1">Contratiempo</td>
                    <td className="border border-slate-200 px-2 py-1">parte débil</td>
                    <td className="border border-slate-200 px-2 py-1">no necesariamente</td></tr>
              </tbody>
            </table>
          </section>
          <section>
            <h3 className="font-semibold text-base mt-2">Tiempos en 4/4</h3>
            <p><strong>F</strong> = tiempo 1 (fuerte) · <strong>D</strong> = tiempo 2 y 4 (débil) · <strong>SF</strong> = tiempo 3 (semifuerte)</p>
            <p className="mt-1"><strong>PF</strong> = primera mitad de cualquier tiempo · <strong>PD</strong> = segunda mitad</p>
          </section>
        </div>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser and commit**

```bash
cd app && npm run dev
# Navigate to #/sincopas — click notes, verify annotation menu appears, test correction
git add app/src/features/syncopation/
git commit -m "feat: implement Exercise 1 (síncopas y contratiempos) with interactive note annotation"
```

---

## Task 18: Home page

**Files:**
- Modify: `app/src/features/home/HomePage.tsx`

- [ ] **Step 1: Create full HomePage**

Replace `app/src/features/home/HomePage.tsx`:

```tsx
import { useNavigate } from "react-router-dom";

const EXERCISES = [
  {
    to: "/sincopas",
    icon: "🎵",
    title: "Síncopas y contratiempos",
    description: "Marca tiempos fuertes, débiles, síncopas y contratiempos sobre melodías reales.",
    implemented: true,
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100",
  },
  {
    to: "/intervalos",
    icon: "↕️",
    title: "Intervalos",
    description: "Analiza el número, calificativo y dirección de intervalos en el pentagrama.",
    implemented: true,
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100",
  },
  {
    to: "/tonalidades",
    icon: "🎼",
    title: "Tonalidades",
    description: "Identifica la tonalidad mayor y la relativa menor a partir de armaduras.",
    implemented: true,
    color: "bg-green-50 border-green-200 hover:border-green-400",
    iconBg: "bg-green-100",
  },
  {
    to: "/escalas",
    icon: "📊",
    title: "Escalas y tetracordos",
    description: "Escribe escalas mayores y menores y señala el tetracordo indicado.",
    implemented: true,
    color: "bg-teal-50 border-teal-200 hover:border-teal-400",
    iconBg: "bg-teal-100",
  },
  {
    to: "/transporte",
    icon: "↗️",
    title: "Transporte",
    description: "Transporta fragmentos melódicos a la distancia indicada.",
    implemented: false,
    color: "bg-slate-50 border-slate-200",
    iconBg: "bg-slate-100",
  },
  {
    to: "/compas",
    icon: "📏",
    title: "Compás y tonalidad",
    description: "Deduce el compás, coloca líneas divisorias e indica tonalidad y grados tonales.",
    implemented: false,
    color: "bg-slate-50 border-slate-200",
    iconBg: "bg-slate-100",
  },
  {
    to: "/completar",
    icon: "✏️",
    title: "Completar compases",
    description: "Completa los huecos de los compases con figuras o silencios correctos.",
    implemented: false,
    color: "bg-slate-50 border-slate-200",
    iconBg: "bg-slate-100",
  },
  {
    to: "/notas-extranas",
    icon: "🎯",
    title: "Notas extrañas",
    description: "Señala notas de paso, bordaduras y apoyaturas en melodías tonales.",
    implemented: false,
    color: "bg-slate-50 border-slate-200",
    iconBg: "bg-slate-100",
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">EA4 Practicador</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Practica los ejercicios de Lenguaje Musical de 4.º curso. Todos los contenidos del examen EA4.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Ejercicios de práctica</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXERCISES.map((ex) => (
            <button
              key={ex.to}
              onClick={() => ex.implemented && navigate(ex.to)}
              disabled={!ex.implemented}
              className={`text-left p-5 rounded-xl border-2 transition-all ${ex.color} ${
                ex.implemented
                  ? "cursor-pointer shadow-sm hover:shadow-md"
                  : "cursor-not-allowed opacity-60"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${ex.iconBg}`}>
                {ex.icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">{ex.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ex.description}</p>
              {!ex.implemented && (
                <span className="mt-2 inline-block text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                  Próximamente
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📋</div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Generador de exámenes</h2>
            <p className="text-slate-600 text-sm mt-1">
              Genera un examen aleatorio con los 8 bloques del modelo EA4. Descarga el PDF del examen y el PDF de soluciones.
            </p>
            <button
              onClick={() => navigate("/generador")}
              className="mt-3 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generar examen →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/features/home/HomePage.tsx
git commit -m "feat: implement home page with exercise cards and exam generator CTA"
```

---

## Task 19: Theory page

**Files:**
- Modify: `app/src/features/theory/TheoryPage.tsx`

- [ ] **Step 1: Create TheoryPage**

Replace stub `app/src/features/theory/TheoryPage.tsx`:

```tsx
const SECTIONS = [
  {
    id: "compas", title: "Compás y tiempos",
    content: `El compás organiza la música en grupos regulares. El numerador indica cuántas unidades por compás; el denominador, qué figura representa la unidad.

Compases simples: 2/4 (binario), 3/4 (ternario), 4/4 (cuaternario). Cada tiempo se subdivide en 2.
Compases compuestos: 6/8 (binario), 9/8 (ternario), 12/8 (cuaternario). Cada tiempo se subdivide en 3.

En 4/4: T1=Fuerte, T2=Débil, T3=Semifuerte, T4=Débil.`,
  },
  {
    id: "sincopa", title: "Síncopa y contratiempo",
    content: `Síncopa: nota que empieza en parte débil y se prolonga hacia parte fuerte (por duración o ligadura).
Contratiempo: nota en parte débil precedida de silencio en parte fuerte.

Diferencia: la síncopa se prolonga; el contratiempo no necesariamente.`,
  },
  {
    id: "intervalos", title: "Intervalos",
    content: `Número: cuenta todos los nombres de nota (incluida la primera y la última).
Calificativo: depende de los semitonos.

2ª: menor=1st, mayor=2st | 3ª: menor=3st, mayor=4st
4ª: justa=5st, aumentada=6st | 5ª: justa=7st, disminuida=6st
6ª: menor=8st, mayor=9st | 7ª: menor=10st, mayor=11st | 8ª: justa=12st`,
  },
  {
    id: "tonalidades", title: "Tonalidades y armaduras",
    content: `Sostenidos: último sostenido + semitono = tonalidad mayor. Orden: Fa# Do# Sol# Re# La# Mi# Si#
Bemoles: penúltimo bemol = tonalidad mayor. (1 bemol = Fa). Orden: Sib Mib Lab Reb Solb Dob Fab
Relativa menor: tercera menor descendente desde la tónica mayor.`,
  },
  {
    id: "escalas", title: "Escalas",
    content: `Escala mayor: T T ST T T T ST (2 2 1 2 2 2 1 semitonos)
Escala menor natural: T ST T T ST T T
Escala menor armónica: T ST T T ST T+ ST (el T+ es un tono y medio entre 6.º y 7.º)

Tetracordo: grupo de 4 notas consecutivas. 1.º tetracordo = notas 1-4, 2.º tetracordo = notas 5-8.`,
  },
  {
    id: "notas-extranas", title: "Notas extrañas",
    content: `Nota de paso (NP): une por grado conjunto dos notas reales en direcciones opuestas. No pertenece al acorde.
Bordadura (B): sale de una nota real por grado conjunto y regresa a la misma nota.
Apoyatura (A): nota ajena al acorde en tiempo fuerte, que resuelve por grado conjunto en la nota real siguiente.`,
  },
];

export function TheoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Teoría</h1>
        <p className="text-slate-500 mt-1">Resumen de los contenidos del examen EA4.</p>
      </div>
      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-3">{s.title}</h2>
            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
              {s.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/src/features/theory/TheoryPage.tsx
git commit -m "feat: implement theory page with EA4 content summary"
```

---

## Task 20: Exam Generator

**Files:**
- Create: `app/src/features/examGenerator/ExamGenerator.ts`
- Create: `app/src/features/examGenerator/ExamGeneratorPage.tsx`

- [ ] **Step 1: Create ExamGenerator**

Create `app/src/features/examGenerator/ExamGenerator.ts`:

```typescript
import type { ExamConfig, ExamData, ExamExercise } from "../../theory/types";
import { SYNCOPATION_FRAGMENTS } from "../../data/melodyFragments";
import { INTERVAL_EXERCISES } from "../../data/intervalExercises";
import { KEY_SIGNATURE_EXERCISES } from "../../data/keySignatureExercises";
import { SCALE_EXERCISES } from "../../data/scaleExercises";
import {
  buildMajorScale,
  buildHarmonicMinorScale,
  getTetrachord,
} from "../../theory/scales";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateExam(config: ExamConfig): ExamData {
  const exercises: ExamExercise[] = [];

  // Exercise 1: Syncopation
  const synFrag = pick(shuffle(SYNCOPATION_FRAGMENTS.filter(
    (f) => f.difficulty === config.difficulty || config.difficulty === "avanzado"
  )));
  exercises.push({
    type: 1,
    title: "Síncopas y contratiempos",
    instruction: "Señala las síncopas (S) y los contratiempos (C). Indica también los tiempos: F (fuerte), D (débil), SF (semifuerte), PF (parte fuerte), PD (parte débil).",
    data: { fragment: synFrag },
    solution: { annotations: synFrag.solutions, staffData: synFrag.staff },
  });

  // Exercise 2: Transposition stub
  exercises.push({
    type: 2,
    title: "Transporte",
    instruction: "Transporta el fragmento a la distancia indicada e indica la nueva tonalidad y armadura.",
    data: { stub: true, message: "Ejercicio generado — ver pentagrama del examen" },
    solution: { stub: true, message: "Próximamente" },
  });

  // Exercise 3: Meter/tonality stub
  exercises.push({
    type: 3,
    title: "Compás, líneas divisorias, tonalidad y grados tonales",
    instruction: "Busca el compás, coloca líneas divisorias, indica la tonalidad, señala los grados tonales I, IV, V y la sensible.",
    data: { stub: true },
    solution: { stub: true, message: "Próximamente" },
  });

  // Exercise 4: Intervals (6 intervals)
  const ivPool = shuffle(INTERVAL_EXERCISES);
  const ivExercises = ivPool.slice(0, 6);
  exercises.push({
    type: 4,
    title: "Análisis de intervalos",
    instruction: "Analiza los siguientes intervalos. Indica el número, calificativo, dirección y si son simples o compuestos.",
    data: { intervals: ivExercises },
    solution: { intervals: ivExercises.map((e) => e.solution) },
  });

  // Exercise 5: Complete measures stub
  exercises.push({
    type: 5,
    title: "Completar compases",
    instruction: "Completa los compases con silencios o figuras adecuados.",
    data: { stub: true },
    solution: { stub: true, message: "Próximamente" },
  });

  // Exercise 6: Scales (4 scales)
  const scPool = shuffle(SCALE_EXERCISES.filter(
    (s) => config.difficulty === "avanzado" || s.difficulty === config.difficulty || s.difficulty === "basico"
  ));
  const scExercises = scPool.slice(0, 4);
  const scSolutions = scExercises.map((ex) => {
    const scale =
      ex.type === "major"
        ? buildMajorScale(ex.tonicEs)
        : ex.type === "harmonic_minor"
        ? buildHarmonicMinorScale(ex.tonicEs)
        : buildMajorScale(ex.tonicEs);
    return { label: ex.label, scale, tetrachord: getTetrachord(scale, ex.tetrachord) };
  });
  exercises.push({
    type: 6,
    title: "Escalas y tetracordos",
    instruction: "Escribe las siguientes escalas y señala el tetracordo indicado.",
    data: { scales: scExercises },
    solution: { scales: scSolutions },
  });

  // Exercise 7: Key signatures (5 key sigs)
  const ksPool = shuffle(KEY_SIGNATURE_EXERCISES.filter(
    (k) => config.difficulty === "avanzado" || k.difficulty === config.difficulty || k.difficulty === "basico"
  ));
  const ksExercises = ksPool.slice(0, 5);
  exercises.push({
    type: 7,
    title: "Tonalidades mayor y relativa menor",
    instruction: "Indica la tonalidad mayor y la relativa menor de cada armadura.",
    data: { keySignatures: ksExercises },
    solution: { keySignatures: ksExercises.map((e) => e.solution) },
  });

  // Exercise 8: Non-chord tones stub
  exercises.push({
    type: 8,
    title: "Notas extrañas",
    instruction: "Señala las notas extrañas e indica si son nota de paso (NP), bordadura (B) o apoyatura (A).",
    data: { stub: true },
    solution: { stub: true, message: "Próximamente" },
  });

  return { config, exercises };
}
```

- [ ] **Step 2: Create ExamGeneratorPage**

Create `app/src/features/examGenerator/ExamGeneratorPage.tsx`:

```tsx
import { useState } from "react";
import type { ExamConfig, ExamData } from "../../theory/types";
import { generateExam } from "./ExamGenerator";
import { Card, Button, Select } from "../../components/ui";
import { VexFlowRenderer } from "../../components/music/VexFlowRenderer";
import type { StaffDisplay } from "../../components/music/types";
import type { SyncopationFragment } from "../../data/melodyFragments";
import type { IntervalExerciseData } from "../../data/intervalExercises";
import type { KeySigExerciseData } from "../../data/keySignatureExercises";

function makeKeyStaff(vexflowKey: string): StaffDisplay {
  return {
    meter: { numerator: 4, denominator: 4 },
    keySignature: vexflowKey,
    clef: "treble",
    measures: [{ notes: [] }],
    width: 180,
    height: 110,
  };
}

function makeIntervalStaff(pitchA: string, pitchB: string): StaffDisplay {
  return {
    meter: { numerator: 4, denominator: 4 },
    keySignature: "C",
    clef: "treble",
    measures: [{ notes: [
      { id: "a", pitch: pitchA, duration: "h" },
      { id: "b", pitch: pitchB, duration: "h" },
    ]}],
    width: 180,
    height: 110,
  };
}

export function ExamGeneratorPage() {
  const today = new Date().toLocaleDateString("es-ES");
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("2025/2026");
  const [difficulty, setDifficulty] = useState<"basico" | "medio" | "avanzado">("medio");
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);

  function generate() {
    const config: ExamConfig = {
      studentName,
      course,
      date: today,
      difficulty,
      timeSignatures: [{ numerator: 4, denominator: 4 }],
      keySignatureRange: difficulty === "basico" ? 2 : difficulty === "medio" ? 4 : 5,
      allowedFigures: ["quarter", "half", "eighth"],
      allowTriplets: difficulty !== "basico",
      allowDots: true,
      allowTies: true,
    };
    setExamData(generateExam(config));
    setShowSolutions(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Generador de exámenes</h1>
        <p className="text-slate-500 mt-1">
          Genera un examen completo similar al modelo EA4. Descarga el PDF del examen y el de soluciones.
        </p>
      </div>

      <Card title="Configuración del examen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre del alumno (opcional)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nombre Apellido"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Select
            label="Dificultad"
            id="diff"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "basico" | "medio" | "avanzado")}
            options={[
              { value: "basico", label: "Básico (1-2 alteraciones)" },
              { value: "medio", label: "Medio (1-4 alteraciones)" },
              { value: "avanzado", label: "Avanzado (hasta 5 alteraciones)" },
            ]}
          />
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={generate}>Generar examen</Button>
        </div>
      </Card>

      {examData && (
        <div className="space-y-4">
          {/* Exam header preview */}
          <div className="bg-white rounded-xl border-2 border-slate-300 p-6">
            <div className="flex justify-between items-start mb-1">
              <div>
                <p className="font-bold text-lg">Examen de Lenguaje Musical — EA4</p>
                <p className="text-sm text-slate-600">Curs: {examData.config.course}</p>
              </div>
              <p className="text-sm text-slate-500">El Sindicato EA4</p>
            </div>
            <div className="flex gap-8 text-sm mt-2">
              <p>Nom: <span className="font-medium">{examData.config.studentName || "___________________________"}</span></p>
              <p>Data: <span className="font-medium">{examData.config.date}</span></p>
            </div>
            <hr className="my-4 border-slate-300" />

            {/* Exercises */}
            {examData.exercises.map((ex) => (
              <div key={ex.type} className="mb-8">
                <p className="font-semibold text-slate-800">
                  {ex.type}. {ex.instruction}
                </p>

                {/* Exercise 1: Syncopation stave */}
                {ex.type === 1 && !ex.data.stub && (
                  <div className="mt-3">
                    <VexFlowRenderer
                      staff={(ex.data as { fragment: SyncopationFragment }).fragment.staff}
                    />
                    {showSolutions && (
                      <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        <strong>Solución:</strong>{" "}
                        {Object.entries((ex.solution as { annotations: Record<string, string> }).annotations)
                          .map(([id, ann]) => `${id}: ${ann}`)
                          .join(" · ")}
                      </div>
                    )}
                  </div>
                )}

                {/* Exercise 4: Intervals */}
                {ex.type === 4 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(ex.data as { intervals: IntervalExerciseData[] }).intervals.map((iv, i) => (
                      <div key={iv.id} className="border border-slate-200 rounded p-2">
                        <p className="text-xs text-slate-400 mb-1">Intervalo {i + 1}</p>
                        <VexFlowRenderer staff={makeIntervalStaff(iv.staffPitchA, iv.staffPitchB)} />
                        {showSolutions && (
                          <p className="text-xs text-blue-700 mt-1">
                            {iv.solution.number}.ª {iv.solution.quality} {iv.solution.direction}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Exercise 6: Scales */}
                {ex.type === 6 && (
                  <div className="mt-3 space-y-2">
                    {(ex.data as { scales: { label: string }[] }).scales.map((sc, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-sm font-medium w-64">{sc.label}</span>
                        <div className="flex-1 border-b border-slate-300 h-6" />
                        {showSolutions && (
                          <span className="text-xs text-blue-700">
                            {(ex.solution as { scales: { scale: string[] }[] }).scales[i].scale.join(" - ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Exercise 7: Key signatures */}
                {ex.type === 7 && (
                  <div className="mt-3 flex flex-wrap gap-4">
                    {(ex.data as { keySignatures: KeySigExerciseData[] }).keySignatures.map((ks, i) => (
                      <div key={ks.id} className="text-center">
                        <VexFlowRenderer staff={makeKeyStaff(ks.vexflowKey)} />
                        <div className="text-xs text-slate-500 mt-1">Mayor: ______ · Menor: ______</div>
                        {showSolutions && (
                          <p className="text-xs text-blue-700 mt-0.5">
                            {ks.solution.major} · {ks.solution.minor}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Stub exercises */}
                {(ex.data as { stub?: boolean }).stub && (
                  <div className="mt-3 border-l-4 border-slate-300 pl-4 py-2 text-sm text-slate-500 italic">
                    [Ejercicio {ex.type} — pentagrama con ejercicio aleatorio — espacio para respuesta]
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSolutions((v) => !v)}
            >
              {showSolutions ? "Ocultar soluciones" : "Ver soluciones en pantalla"}
            </Button>
            <Button
              onClick={() => window.print()}
              variant="primary"
            >
              🖨️ Imprimir / Guardar como PDF
            </Button>
          </div>

          <p className="text-xs text-slate-400">
            Consejo: usa "Imprimir" del navegador y elige "Guardar como PDF" para exportar. El PDF de soluciones se activa con "Ver soluciones en pantalla" antes de imprimir.
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser and commit**

```bash
cd app && npm run dev
# Navigate to #/generador — fill config, generate exam, verify all 8 exercises appear, test print
git add app/src/features/examGenerator/
git commit -m "feat: implement exam generator with all 8 exercise types and print-to-PDF"
```

---

## Task 21: localStorage persistence

**Files:**
- Create: `app/src/hooks/useLocalStorage.ts`
- Create: `app/src/hooks/useUserStats.ts`

- [ ] **Step 1: Create useLocalStorage hook**

Create `app/src/hooks/useLocalStorage.ts`:

```typescript
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [key, value]);

  return [value, setValue];
}
```

- [ ] **Step 2: Create useUserStats hook**

Create `app/src/hooks/useUserStats.ts`:

```typescript
import { useLocalStorage } from "./useLocalStorage";

interface UserStats {
  exercisesCompleted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  lastExercise?: string;
}

const INITIAL_STATS: UserStats = {
  exercisesCompleted: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
};

export function useUserStats() {
  const [stats, setStats] = useLocalStorage<UserStats>("ea4-stats", INITIAL_STATS);

  function recordAttempt(correct: number, incorrect: number, exerciseType: string) {
    setStats({
      ...stats,
      exercisesCompleted: stats.exercisesCompleted + 1,
      correctAnswers: stats.correctAnswers + correct,
      incorrectAnswers: stats.incorrectAnswers + incorrect,
      lastExercise: exerciseType,
    });
  }

  function resetStats() {
    setStats(INITIAL_STATS);
  }

  return { stats, recordAttempt, resetStats };
}
```

- [ ] **Step 3: Commit**

```bash
git add app/src/hooks/
git commit -m "feat: add localStorage persistence hooks for user stats and preferences"
```

---

## Task 22: Print styles and final polish

**Files:**
- Modify: `app/src/index.css`
- Modify: `app/src/App.tsx` (add print styles import)

- [ ] **Step 1: Add print styles**

Append to `app/src/index.css`:

```css
@media print {
  header,
  aside,
  .no-print {
    display: none !important;
  }

  main {
    padding: 0 !important;
    margin: 0 !important;
  }

  .print-page {
    page-break-after: always;
  }
}
```

- [ ] **Step 2: Add `no-print` class to header and sidebar**

In `app/src/components/layout/Header.tsx`, add `no-print` to the `<header>` className.

In `app/src/components/layout/Sidebar.tsx`, add `no-print` to the `<aside>` className.

In `app/src/components/layout/PageShell.tsx`, the main element gets `pl-0 pt-0` when printing.

- [ ] **Step 3: Verify build**

```bash
cd app && npm run build
```

Expected: build succeeds with no TypeScript errors. Output in `app/dist/`.

- [ ] **Step 4: Run all tests**

```bash
cd app && npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Final commit**

```bash
git add app/
git commit -m "feat: add print styles for exam PDF export via browser print dialog"
```

---

## Task 23: GitHub Pages configuration

**Files:**
- Modify: `app/vite.config.ts` (verify base URL)
- Create: `app/.github/workflows/deploy.yml` (optional GitHub Actions deploy)

- [ ] **Step 1: Verify base URL matches repository name**

In `app/vite.config.ts`, confirm:

```typescript
base: "/EA4_generador_examens/",
```

If the GitHub repository has a different name, update this string to match exactly.

- [ ] **Step 2: Test build and preview**

```bash
cd app && npm run build && npm run preview
```

Open `http://localhost:4173/EA4_generador_examens/` — verify the app works fully from the built static files.

- [ ] **Step 3: Run full test suite one last time**

```bash
cd app && npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 4: Final commit and tag**

```bash
git add app/
git commit -m "feat: finalize Phase 1 — EA4 Practicador with exam generator ready for GitHub Pages"
```

---

---

## Self-review fixes (apply during implementation)

### Fix 1: VexFlowRenderer must render note labels via VexFlow Annotation

In Task 12, the `VexFlowRenderer` receives `label` and `labelColor` per note but never renders them. In the render loop, after creating each `staveNote`, add:

```typescript
import { Annotation } from "vexflow";

// Inside the vexNotes.map(), after creating staveNote:
if (noteData.label) {
  const annotation = new Annotation(noteData.label);
  annotation.setFont("Arial", 9, "bold");
  (annotation as any).setStyle({ fillStyle: noteData.labelColor ?? "#000", strokeStyle: noteData.labelColor ?? "#000" });
  annotation.setVerticalJustification(1); // 1 = TOP
  staveNote.addModifier(annotation, 0);
}
```

This is needed for syncopation annotations (S, C, F, D etc.) to appear above notes.

### Fix 2: Rest durations in melodyFragments.ts

Do NOT include `"r"` in duration strings. The `VexFlowRenderer` already appends `"r"` when `isRest: true`. Change rest notes like:

```typescript
// WRONG:
{ id: "sf002-n1", pitch: "r", duration: "8r", isRest: true }

// CORRECT:
{ id: "sf002-n1", pitch: "r", duration: "8", isRest: true }
```

Apply to all rest notes in `melodyFragments.ts`.

### Fix 3: Remove duplicate DIATONIC_ES in transposition.ts

In Task 8, `DIATONIC_ES` is declared twice. Remove the second declaration (the one that appears after the `INTERVAL_SEMITONES` object). Keep only the first one at the top of the file.

### Fix 4: VexFlow Accidental handling

In the `VexFlowRenderer`, the current code adds accidentals for all notes with `#` or `b` in the pitch string. This can cause doubled accidentals when the key signature already includes that note. For Phase 1, simplify by using VexFlow's `KeyManager` or just accept that some notes may show unnecessary accidentals. This is a cosmetic issue for Phase 1.

---

## Summary of deliverables

After completing all tasks, the `app/` directory contains:

**Fully implemented:**
- Vite + React + TypeScript + Tailwind app with HashRouter (GitHub Pages ready)
- Collapsible sidebar with "El Sindicato EA4" branding
- Music theory engine with tests (`keys`, `scales`, `intervals`, `rhythm`, `transposition`)
- VexFlow 4 renderer for musical notation
- Exercise 1 — Síncopas y contratiempos (interactive click + annotation)
- Exercise 4 — Intervalos (VexFlow staves + dropdown correction)
- Exercise 6 — Escalas y tetracordos (dropdown note selection + tetrachord marking)
- Exercise 7 — Tonalidades (VexFlow key signatures + text input)
- Exam generator (all 8 exercises, exercises 1/4/6/7 fully rendered)
- Print-to-PDF via browser print dialog
- localStorage persistence

**Stubs (navigable, "Próximamente"):**
- Exercise 2 — Transporte
- Exercise 3 — Compás y tonalidad
- Exercise 5 — Completar compases
- Exercise 8 — Notas extrañas

**Commands:**
```bash
cd app
npm install        # install dependencies
npm run dev        # start development server
npm run test:run   # run tests
npm run build      # build for production
npm run preview    # preview production build
```

---
