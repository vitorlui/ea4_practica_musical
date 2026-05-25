# EA4 Practicador — Diseño de la aplicación web

**Fecha:** 2026-05-25  
**Autoría visible:** El Sindicato EA4  
**Estado:** Aprobado por el usuario

---

## 1. Objetivo

Aplicación web estática para practicar ejercicios de Lenguaje Musical de 4.º curso (EA4), basada en el modelo de examen real de la carpeta `Prova/`. Incluye practicador interactivo por módulo y generador de exámenes aleatorios con exportación de PDF de examen y PDF de soluciones.

Deployable en GitHub Pages sin servidor.

---

## 2. Alcance de la Fase 1

### Módulos completamente funcionales
- **Ejercicio 1:** Síncopas y contratiempos (marcar F, D, SF, PF, PD, S, C sobre notas)
- **Ejercicio 4:** Análisis de intervalos (número, calificativo, dirección, tipo)
- **Ejercicio 6:** Escalas y tetracordos
- **Ejercicio 7:** Tonalidades a partir de armaduras (mayor y relativa menor)
- **Generador de exámenes:** Los 8 ejercicios, aleatorios, con PDF de examen y PDF de soluciones

### Stubs navegables (página visible, "Próximamente")
- Ejercicio 2: Transporte
- Ejercicio 3: Compás, líneas divisorias, grados tonales
- Ejercicio 5: Completar compases
- Ejercicio 8: Notas extrañas

---

## 3. Stack técnico

| Tecnología | Uso | Versión |
|---|---|---|
| Vite | Build tool | 5.x |
| React | UI framework | 18.x |
| TypeScript | Tipado estático | 5.x |
| Tailwind CSS | Estilos utilitarios | 3.x |
| VexFlow | Renderizado de pentagramas | 4.x |
| jsPDF | Generación de PDFs | 2.x |
| html2canvas | Captura de pentagramas VexFlow para PDF | 1.x |
| React Router v6 | Enrutado con **HashRouter** (GitHub Pages) | 6.x |
| Context API | Estado global ligero | React built-in |
| Vitest | Tests unitarios de lógica musical | 1.x |
| React Testing Library | Tests de componentes | 14.x |

**Node requerido:** 18+

---

## 4. Estructura de directorios

```
EA4_generador_examens/
  app/                          ← raíz de la aplicación React
    public/
    src/
      app/
        App.tsx                 ← router + providers
        routes.tsx              ← definición de rutas
      components/
        layout/
          Sidebar.tsx           ← menú lateral ocultable
          Header.tsx            ← header compacto con autoría
          PageShell.tsx         ← wrapper de página con layout
        music/
          VexFlowRenderer.tsx   ← wrapper React para VexFlow
          MusicStaff.tsx        ← pentagrama con datos tipados
          NoteLabel.tsx         ← etiqueta sobre/bajo nota (F, D, S, C...)
          KeySignatureDisplay.tsx ← armadura visual
        ui/
          Button.tsx
          Card.tsx
          Modal.tsx
          Select.tsx
          Badge.tsx
          Toggle.tsx
      features/
        home/
          HomePage.tsx          ← cards de ejercicios con estado
        syncopation/            ← Ejercicio 1 (COMPLETO)
          SyncopationPage.tsx
          SyncopationGenerator.ts
          SyncopationCorrection.ts
          SyncopationHelp.tsx
        intervals/              ← Ejercicio 4 (COMPLETO)
          IntervalsPage.tsx
          IntervalGenerator.ts
          IntervalCorrection.ts
          IntervalHelp.tsx
        scales/                 ← Ejercicio 6 (COMPLETO)
          ScalesPage.tsx
          ScaleGenerator.ts
          ScaleCorrection.ts
        keySignatures/          ← Ejercicio 7 (COMPLETO)
          KeySignaturesPage.tsx
          KeySignatureGenerator.ts
          KeySignatureCorrection.ts
        transposition/          ← Ejercicio 2 (stub)
          TranspositionPage.tsx
        meterTonality/          ← Ejercicio 3 (stub)
          MeterTonalityPage.tsx
        completeMeasures/       ← Ejercicio 5 (stub)
          CompleteMeasuresPage.tsx
        nonChordTones/          ← Ejercicio 8 (stub)
          NonChordTonesPage.tsx
        examGenerator/          ← Generador completo
          ExamGeneratorPage.tsx
          ExamGenerator.ts      ← orquestador
          PdfExamExporter.ts    ← PDF del examen
          PdfSolutionsExporter.ts ← PDF de soluciones
          ExamConfig.ts         ← tipos de configuración
        theory/
          TheoryPage.tsx        ← resumen teórico inline
      theory/                  ← funciones puras TypeScript (sin imports React)
        keys.ts                 ← tonalidades, armaduras
        scales.ts               ← escalas mayor, menor natural, menor armónica
        intervals.ts            ← análisis de intervalos
        rhythm.ts               ← duraciones, compases, síncopas, contratiempos
        transposition.ts        ← transporte de notas
        nonChordTones.ts        ← clasificación notas extrañas
        types.ts                ← tipos compartidos (Note, Interval, Measure, etc.)
      data/
        presets.ts              ← configuraciones por defecto
        melodyFragments.ts      ← fragmentos melódicos pre-generados para ejercicios
      tests/
        keys.test.ts
        scales.test.ts
        intervals.test.ts
        rhythm.test.ts
        transposition.test.ts
    index.html
    vite.config.ts             ← base: '/EA4_generador_examens/'
    tailwind.config.js
    tsconfig.json
    package.json
  .claude/
    skills/
      ea4-music-theory/SKILL.md
      ea4-exam-generator/SKILL.md
      ea4-ui-ux/SKILL.md
  docs/                        ← documentación del proyecto
```

---

## 5. Diseño de rutas (HashRouter)

| Ruta | Componente | Estado |
|---|---|---|
| `#/` | HomePage | — |
| `#/sincopas` | SyncopationPage | Completo |
| `#/intervalos` | IntervalsPage | Completo |
| `#/tonalidades` | KeySignaturesPage | Completo |
| `#/escalas` | ScalesPage | Completo |
| `#/transporte` | TranspositionPage | Stub |
| `#/compas` | MeterTonalityPage | Stub |
| `#/completar` | CompleteMeasuresPage | Stub |
| `#/notas-extranas` | NonChordTonesPage | Stub |
| `#/generador` | ExamGeneratorPage | Completo |
| `#/teoria` | TheoryPage | — |

---

## 6. Layout y UI

### Header (56px)
- Izquierda: botón ☰ (toggle sidebar) + logo "El Sindicato EA4"
- Derecha: indicador de módulo activo

### Sidebar (260px, ocultable)
- Fondo: `slate-800` / texto: `slate-100`
- Ítem activo: fondo `indigo-600`
- Módulos no implementados: etiqueta gris "Próximamente"
- Ocultable en todos los breakpoints

### Paleta de colores

| Token | Color | Uso |
|---|---|---|
| `primary` | `indigo-600` | Acciones principales, sidebar activo |
| `bg-main` | `slate-50` | Fondo de contenido |
| `bg-card` | `white` | Cards de ejercicio |
| `correct` | `green-500` | Respuesta correcta |
| `incorrect` | `red-500` | Respuesta incorrecta |
| `missing` | `yellow-500` | Elemento no marcado |
| `solution` | `blue-500` | Solución mostrada |

### Estructura estándar de página de ejercicio

1. **Card de configuración:** selectores de compás, dificultad, opciones del ejercicio + botón "Generar ejercicio"
2. **Pentagrama VexFlow:** renderizado del ejercicio. Click en nota → menú flotante con opciones de marcado
3. **Controles de acción:** [Corregir] [Ver solución] [Reiniciar] [Ayuda]
4. **Panel de feedback:** resultados con colores + explicación textual

---

## 7. Lógica musical (src/theory/)

### Tipos base (types.ts)

```typescript
type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";
type Accidental = "##" | "#" | "n" | "b" | "bb";
type Note = { name: NoteName; accidental?: Accidental; octave: number };
type IntervalNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type IntervalQuality = "mayor" | "menor" | "justa" | "aumentada" | "disminuida";
type IntervalDirection = "ascendente" | "descendente" | "armonico";
type RhythmicFigure = "whole" | "half" | "quarter" | "eighth" | "sixteenth" |
                      "half." | "quarter." | "eighth.";
type Meter = { numerator: number; denominator: number };
type BeatType = "F" | "D" | "SF" | "PF" | "PD";
type RhythmicEvent = { noteId: string; figure: RhythmicFigure; beatType: BeatType; tied?: boolean };
type Measure = { meter: Meter; events: RhythmicEvent[] };
```

### Funciones en keys.ts

```typescript
getKeyFromSharps(count: number): { major: string; minor: string }
getKeyFromFlats(count: number): { major: string; minor: string }
getLeadingTone(tonic: string, mode: "major" | "minor"): string
getScaleDegrees(tonic: string, mode: "major" | "minor"): string[]
```

### Funciones en scales.ts

```typescript
buildMajorScale(tonic: string): Note[]
buildNaturalMinorScale(tonic: string): Note[]
buildHarmonicMinorScale(tonic: string): Note[]
getTetrachord(scale: Note[], n: 1 | 2): Note[]
```

### Funciones en intervals.ts

```typescript
type IntervalResult = {
  number: IntervalNumber;
  quality: IntervalQuality;
  direction: IntervalDirection;
  size: "simple" | "compuesto";
};
getInterval(noteA: Note, noteB: Note): IntervalResult
buildInterval(noteA: Note, spec: { number: IntervalNumber; quality: IntervalQuality; direction: IntervalDirection }): Note
```

### Funciones en rhythm.ts

```typescript
durationToBeats(figure: RhythmicFigure, meter: Meter): number
measureTotalBeats(meter: Meter): number
detectSyncopations(measure: Measure): string[]   // returns noteIds
detectOffbeats(measure: Measure): string[]        // returns noteIds
getBeatType(eventIndex: number, meter: Meter): BeatType
```

### Funciones en transposition.ts

```typescript
transposeNote(note: Note, interval: { number: IntervalNumber; quality: IntervalQuality; direction: IntervalDirection }): Note
transposeMelody(notes: Note[], interval: ...): Note[]
getTransposedKey(fromKey: string, interval: ...): { major: string; armadura: string }
```

---

## 8. Renderizado musical (VexFlow)

### Estrategia de integración

- `VexFlowRenderer.tsx`: componente React que recibe datos estructurados y renderiza en `<div ref>` usando VexFlow API
- Cada nota renderizada tiene un `data-note-id` para correlacionar con el estado
- Para interacción (click), se usa un overlay SVG transparente con áreas de click
- Para el PDF, se usa `html2canvas` para capturar el `<div>` con el pentagrama

### Datos que recibe VexFlowRenderer

```typescript
interface StaffData {
  meter: Meter;
  keySignature: string;      // p.ej. "Bb" para Sib mayor
  clef: "treble";
  measures: MeasureData[];
}

interface NoteData {
  id: string;
  pitch: string;             // formato VexFlow: "c/4", "d#/5"
  duration: string;          // formato VexFlow: "q", "h", "8"
  tied?: boolean;
  label?: string;            // etiqueta visual encima/abajo
  labelColor?: string;       // verde/rojo/azul
}
```

---

## 9. Generador de exámenes

### Configuración (ExamConfig)

```typescript
interface ExamConfig {
  studentName?: string;
  course: string;             // "2025/2026"
  date: string;
  difficulty: "basico" | "medio" | "avanzado";
  timeSignatures: Meter[];
  keySignatureRange: number;  // máx. alteraciones (1-5)
  allowedFigures: RhythmicFigure[];
  allowTriplets: boolean;
  allowDots: boolean;
  allowTies: boolean;
  exercisesToInclude: number[]; // [1,2,3,4,5,6,7,8]
}
```

### Flujo de generación

1. `ExamGenerator.generateExam(config)` → `ExamData` (ejercicios + soluciones)
2. Preview en pantalla con todos los ejercicios renderizados
3. `PdfExamExporter.export(examData)` → descarga `examen_EA4.pdf`
4. `PdfSolutionsExporter.export(examData)` → descarga `soluciones_EA4.pdf`

### Cabecera del PDF (fiel al examen real)

```
Examen de Lenguaje Musical — EA4
Curs: 2025/2026                    Nom: _________________________
El Sindicato EA4                   Data: ____________
```

---

## 10. Tests requeridos (Vitest)

```typescript
// keys.test.ts
describe("key signatures", () => {
  it("0 alteraciones → Do mayor / La menor");
  it("1 sostenido → Sol mayor / Mi menor");
  it("2 bemoles → Sib mayor / Sol menor");
  it("sensible de Si menor → La#");
  it("sensible de La menor → Sol#");
});

// intervals.test.ts
describe("intervals", () => {
  it("Do-Re → 2ª mayor ascendente simple");
  it("Do-Fa# → 4ª aumentada");
  it("Do-Solb → 5ª disminuida");
  it("Do-La (descendente) → 3ª menor descendente");
});

// scales.test.ts
describe("scales", () => {
  it("Sol mayor → Sol La Si Do Re Mi Fa#");
  it("Re menor armónica → Re Mi Fa Sol La Sib Do#");
  it("La menor harmónica, 1r tetracord → La Si Do Re");
});

// rhythm.test.ts
describe("rhythm", () => {
  it("negra en 4/4 → 1 tiempo");
  it("tresillo de corcheas → 1 tiempo");
  it("6/8 → 2 tiempos, cada uno de negra con puntillo");
  it("9/8 → 9 corcheas");
});

// transposition.test.ts
describe("transposition", () => {
  it("Fa mayor + 3ª menor superior → Lab mayor");
  it("Re mayor + 2ª mayor inferior → Do mayor");
});
```

---

## 11. Persistencia (localStorage)

```typescript
interface UserPreferences {
  lastExercise: string;
  difficulty: "basico" | "medio" | "avanzado";
  defaultMeter: Meter;
}

interface UserStats {
  exercisesCompleted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  errorsByType: Record<string, number>;
}
```

---

## 12. GitHub Pages — configuración

**vite.config.ts:**
```typescript
export default defineConfig({
  base: '/EA4_generador_examens/',  // debe coincidir exactamente con el nombre del repositorio en GitHub
  // ...
})
```

**Routing:** `HashRouter` en `App.tsx` (evita redirección 404 en GitHub Pages).

**Deploy:** desde `app/dist/` hacia la rama `gh-pages`.

---

## 13. Skills locales a crear

### `.claude/skills/ea4-music-theory/SKILL.md`
Guía para implementar/revisar lógica musical EA4.

### `.claude/skills/ea4-exam-generator/SKILL.md`
Guía para generar exámenes aleatorios y PDFs.

### `.claude/skills/ea4-ui-ux/SKILL.md`
Guía de diseño para interfaces educativas musicales interactivas.

---

## 14. Criterios de aceptación (Fase 1)

1. `npm install && npm run dev` arranca sin errores
2. Sidebar ocultable visible con autoría "El Sindicato EA4"
3. Ejercicio 1 (síncopas) interactivo con corrección y feedback
4. Ejercicio 4 (intervalos) interactivo con corrección y feedback
5. Ejercicio 6 (escalas) interactivo con corrección y feedback
6. Ejercicio 7 (tonalidades) interactivo con corrección y feedback
7. Generador produce un examen con los 8 tipos de ejercicio
8. Botón "Descargar PDF examen" genera archivo descargable
9. Botón "Descargar PDF soluciones" genera archivo descargable
10. Tests pasan: `npm run test`
11. Build estático funciona: `npm run build`
12. Stubs de ejercicios 2, 3, 5, 8 son navegables
