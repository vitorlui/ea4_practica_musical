# Spec: Site Overhaul — Theory + Practice per Page

**Date:** 2026-05-25  
**Project:** EA4 Generador Examens  
**Status:** Approved

---

## Goal

Every menu item (except exam) gets two tabs: Teoría (step-by-step, book page reference) and Práctica (interactive exercises). Missing theory topics from the book get new menu entries with their own pages. Exam stays last.

---

## Sidebar Structure

```
INICIO
────────────────────────────────
EJERCICIOS DEL EXAMEN
  1. Síncopas y Contratiempos     /sincopas
  2. Transporte                   /transporte
  3. Compás y Tonalidad           /compas-tonalidad
  4. Intervalos                   /intervalos
  5. Completar compás             /completar-compas
  6. Escalas                      /escalas
  7. Armadura                     /armadura
  8. Notas extrañas               /notas-extranyas
────────────────────────────────
TEORÍA ADICIONAL
  Grados tonales                  /grados-tonales
  Enarmonía                       /enarmonia
  Acordes perfectos               /acordes
  Semitono diat./crom.            /semitono
  Notas de adorno                 /notas-adorno
────────────────────────────────
EXAMEN ALEATORIO                  /examen
```

Sidebar uses two `<section>` groups with a divider label. Active route highlighted in indigo.

---

## Shared Component: `TheoryPracticeLayout`

**File:** `app/src/components/layout/TheoryPracticeLayout.tsx`

**Props:**
```ts
interface TheoryPracticeLayoutProps {
  title: string;
  bookPages: string;           // e.g. "p.72–79"
  theory: TheorySection[];     // same type as current TheoryPage
  children: React.ReactNode;   // exercise tab content
  defaultTab?: "teoria" | "practica";
}
```

**Renders:**
- Page header: `[title]` + `[📖 Libro: p.XX–XX]` badge (links to nothing, purely informational)
- Tab bar: `[Teoría]` `[Práctica]` — indigo underline on active
- Theory tab: numbered steps + optional table (reuse TheoryPage rendering logic)
- Practice tab: `children`

**Tab state:** local `useState`, no URL sync (YAGNI).

Extract `StepList` and `TheoryTable` from `TheoryPage.tsx` into `app/src/components/theory/` so both TheoryPage and TheoryPracticeLayout can reuse them.

---

## Exercise Format for Stub/New Pages

All new exercises use multiple-choice (4 options), consistent with existing pages. No interactive staff editor required.

**Shared exercise card pattern:**
1. Question / stimulus (text or small VexFlow snippet where needed)
2. 4 option buttons (A/B/C/D)
3. On selection: green/red feedback + explanation
4. Streak counter
5. "Siguiente" button

---

## Pages: Theory Content + Exercise Design

### 1. Síncopas y Contratiempos
- **Book:** p.16–23 (Unitat 1)
- **Theory steps:**
  1. Qué es el compás y los tiempos fuertes/débiles
  2. Definición de síncopa: tiempo débil → tiempo fuerte (con ligadura o por duración)
  3. Definición de contratiempo: nota breve en parte débil + pausa en tiempo fuerte
  4. Cómo identificar en partitura: busca notas que "atraviesan" la línea del tiempo
  5. Regla mnemotécnica: síncopa = salto fuerte, contratiempo = pausa fuerte
- **Table:** Síncopa vs Contratiempo (definición, posición, ligadura, ejemplo)
- **Exercises:** already implemented — keep, wrap in TheoryPracticeLayout

### 2. Transporte
- **Book:** p.16–23 (Unitat 1)
- **Theory steps:**
  1. Qué es transportar: reproducir una melodía a otra altura
  2. Los intervalos internos entre notas se mantienen iguales
  3. Tipos: transporte tonal (con armadura) vs cromático (mecánico)
  4. Proceso: identificar nota original → subir/bajar intervalo → ajustar alteraciones
  5. Ejemplo: Do mayor → Re mayor (todos suben una 2ª mayor)
- **Table:** Intervalos de transporte más comunes (intervalo → tonalidad destino)
- **Exercises:** Show note name + "Transporta una 3ª mayor ascendente" → MC 4 note names

**Data structure:**
```ts
interface TransposeExercise {
  id: string;
  sourceNote: string;        // "Do"
  intervalName: string;      // "3ª mayor ascendente"
  semitones: number;         // 4
  correctAnswer: string;     // "Mi"
  distractors: string[];     // ["Mib", "Fa", "Re"]
  explanation: string;
}
```

### 3. Compás y Tonalidad
- **Book:** p.24–47 (Unitats 2, 3, 4)
- **Theory steps:**
  1. Cómo leer una fracción de compás: numerador = tiempos, denominador = figura
  2. Compases simples: cada tiempo se divide en 2
  3. Compases compuestos: numerador múltiplo de 3, cada tiempo se divide en 3
  4. Cómo identificar tonalidad: contar alteraciones → aplicar regla sostenidos/bemoles
  5. Tonalidades relativas: mayor y menor con misma armadura
  6. Grados tonales I y V (tónica y dominante) como referencia de tonalidad
- **Table:** Compases simples ↔ compuestos correspondientes (2/4↔6/8, 3/4↔9/8, 4/4↔12/8)
- **Exercises:** Two sub-types alternated randomly:
  - Show time signature fraction → identify "simple" or "compuesto" → MC
  - Show key signature description → identify major/minor key name → MC

### 4. Intervalos
- **Book:** p.72–79 (Unitat 8) + p.16–23 for majors/minors
- **Theory steps:**
  1. Número del intervalo: contar notas extremas incluidas
  2. Calidad: mayores/menores (2ª,3ª,6ª,7ª) vs justos (4ª,5ª,8ª)
  3. Aumentado = semitono más que mayor/justo; Disminuido = semitono menos que menor/justo
  4. Melódico (notas sucesivas) vs armónico (notas simultáneas)
  5. Conjunto (≤2ª) vs disjunto (>2ª)
  6. Simple (≤8ª) vs compuesto (>8ª)
  7. Consonante vs disonante (regla 1ª-3ª-5ª-6ª-8ª)
- **Table:** All intervals with semitone count + quality + consonant/dissonant
- **Exercises:** already implemented — keep, wrap in TheoryPracticeLayout

### 5. Completar compás
- **Book:** p.16–23 (Unitat 1) for note values
- **Theory steps:**
  1. Equivalencias: redonda=4, blanca=2, negra=1, corchea=0.5, semicorchea=0.25 (en negras)
  2. Puntillo: añade la mitad del valor
  3. Proceso: identificar compás → sumar figuras existentes → calcular lo que falta
  4. Reglas de agrupación: en compás simple, no mezclar tiempos en una sola figura
- **Table:** Equivalencias de figuras
- **Exercises:** "En un compás de 3/4 ya hay: negra + corchea. ¿Qué figura completa?" → MC 4 figure names

**Data structure:**
```ts
interface CompletarCompasExercise {
  id: string;
  meter: string;            // "3/4"
  totalBeats: number;       // 3 (in quarter notes)
  existing: string[];       // ["negra", "corchea"]
  existingValue: number;    // 1.5
  missing: number;          // 1.5
  correctAnswer: string;    // "negra con puntillo"
  distractors: string[];
  explanation: string;
}
```

### 6. Escalas
- **Book:** p.56–71 (Unitats 6, 7)
- **Theory steps:**
  1. Escala mayor: patrón T-T-ST-T-T-T-ST (con ejemplo Do mayor)
  2. Escala menor natural: T-ST-T-T-ST-T-T (con ejemplo La menor)
  3. Escala menor armónica: igual que natural pero VII subido ½ tono
  4. Escala menor melódica: VI y VII subidos al ascender, naturales al descender
  5. Tetracordos: dos grupos de 4 notas; 1º = I–IV, 2º = V–VIII
- **Table:** Patrones por escala (nombre + patrón + ejemplo)
- **Exercises:** already implemented — wrap in TheoryPracticeLayout

### 7. Armadura
- **Book:** p.32–47 (Unitats 3, 4)
- **Theory steps:**
  1. Sostenidos: orden Fa-Do-Sol-Re-La-Mi-Si; tónica = 2ª menor encima del último #
  2. Bemoles: orden Si-Mi-La-Re-Sol-Do-Fa; tónica = penúltimo bemol
  3. Caso especial: 1 bemol (Fa mayor), memorizar
  4. Relativa menor: 3ª menor descendente desde la mayor
  5. Tonalidades enarmónicas: Fa# mayor = Solb mayor
- **Table:** Tabla completa de armaduras (0–7 alteraciones, mayor + relativa menor)
- **Exercises:** already implemented — wrap in TheoryPracticeLayout

### 8. Notas extrañas
- **Book:** p.48–55 (Unitat 5)
- **Theory steps:**
  1. Qué son notas extrañas: no pertenecen al acorde, embellecen la melodía
  2. Nota de paso (NP): une dos notas reales por grado conjunto, en parte débil
  3. Bordadura (B): sale de nota real, va un grado conjunto y vuelve a la misma
  4. Apoyatura (A): en parte fuerte, precede por grado conjunto a nota real del acorde
  5. Cómo identificar: primero ubica notas del acorde, luego clasifica las demás
- **Table:** NP vs B vs A (definición, posición en el compás, movimiento, ejemplo)
- **Exercises:** "La nota marcada es: Nota de paso / Bordadura / Apoyatura / No es extraña" → MC

**Data structure:**
```ts
interface NotaExtraniaExercise {
  id: string;
  description: string;      // "Do-Re-Mi en Do mayor, el Re..."
  context: string;          // harmonic context explanation
  markedNote: string;       // "Re"
  correctType: "NP" | "B" | "A" | "ninguna";
  explanation: string;
}
```

### NEW: Grados tonales
- **Book:** p.64–71 (Unitat 7)
- **Theory steps:**
  1. I Tónica: da nombre a la tonalidad, máximo reposo
  2. II Supertónica: un grado encima de la tónica
  3. III Mediante: a medio camino entre tónica y dominante
  4. IV Subdominante: un grado bajo la dominante
  5. V Dominante: segundo grado más importante; crea tensión hacia I
  6. VI Superdominante: un grado encima de la dominante
  7. VII Sensible (a ST de la tónica) / Subtónica (a T de la tónica)
- **Table:** Grado (numeral romano) + nombre + función + distancia desde tónica
- **Exercises:** "En Re mayor, ¿qué nota es la dominante (V)?" → MC 4 note names

### NEW: Enarmonía
- **Book:** p.72–79 (Unitat 8)
- **Theory steps:**
  1. Qué es enarmonía: dos notas con el mismo sonido pero distinto nombre
  2. No hay distancia entre notas enarmónicas: 0 tonos, 0 semitonos
  3. Casos más frecuentes: Do#=Reb, Re#=Mib, Fa#=Solb, Sol#=Lab, La#=Sib, Si=Dob, Mi=Fab
  4. Cuándo se usa: para simplificar armaduras (Fa# mayor = Solb mayor)
- **Table:** Pares enarmónicos más frecuentes
- **Exercises:** "¿Cuál es el enarmónico de Sol#?" → MC

### NEW: Acordes perfectos
- **Book:** p.80–87 (Unitat 9)
- **Theory steps:**
  1. Qué es un acorde: tres o más notas simultáneas ordenadas por terceras
  2. Tríada: acorde de tres notas (fundamental, tercera, quinta)
  3. Acorde perfecto mayor: 3ª mayor (2T) + 5ª justa (3T+1ST) desde la fundamental
  4. Acorde perfecto menor: 3ª menor (1T+1ST) + 5ª justa (3T+1ST) desde la fundamental
  5. Cómo identificar: cuenta semitonos de fundamental a 3ª (4=mayor, 3=menor)
- **Table:** Mayor vs Menor (intervalos, ejemplo en Do, estructura)
- **Exercises:** "El acorde Do-Mi-Sol es: perfecto mayor / perfecto menor / otro" → MC

### NEW: Semitono diatónico y cromático
- **Book:** p.80–87 (Unitat 9)
- **Theory steps:**
  1. Qué es un semitono: distancia mínima entre dos notas (1 semitono)
  2. Diatónico: las dos notas tienen nombres distintos (Mi–Fa, Si–Do, Do–Reb)
  3. Cromático: las dos notas tienen el mismo nombre, distinto accidental (Do–Do#, Re–Reb)
  4. Regla rápida: mismo nombre = cromático; nombres distintos = diatónico
- **Table:** Ejemplos de semitonos diatónicos y cromáticos
- **Exercises:** "El semitono entre Fa# y Sol es: diatónico / cromático" → MC

### NEW: Notas de adorno
- **Book:** p.88–95 (Unitat 10)
- **Theory steps:**
  1. Qué son: notas/signos que embellecen sin valor propio en el compás
  2. Apoyatura: nota pequeña antes de la real, toma la mitad (o 2/3) de su valor
  3. Mordente: alternar rápidamente nota real con la inmediatamente superior/inferior
  4. Grupeto: 4 notas: superior, real, inferior, real (signo ~)
  5. Trino: alternar rapidísimo nota real con la superior (signo tr~)
  6. Arpegio: tocar notas de un acorde sucesivamente de abajo a arriba (signo arpeggio)
- **Table:** Nombre + símbolo + descripción + notas que incluye
- **Exercises:** "Este símbolo [tr~] representa: Trino / Mordente / Grupeto / Arpegio" → MC

---

## Component Extraction Plan

Current `TheoryPage.tsx` has inline rendering logic for steps and tables. Extract to shared components:

```
app/src/components/theory/
  StepList.tsx          # renders TheoryStep[]
  TheoryTable.tsx       # renders TheoryTable with badges
  index.ts
```

Both `TheoryPage` and `TheoryPracticeLayout` import from here.

---

## File Inventory

### New files
```
app/src/components/layout/TheoryPracticeLayout.tsx
app/src/components/theory/StepList.tsx
app/src/components/theory/TheoryTable.tsx
app/src/components/theory/index.ts
app/src/pages/TransportePage.tsx
app/src/pages/CompasTonalidadPage.tsx
app/src/pages/CompletarCompasPage.tsx
app/src/pages/NotasExtranyasPage.tsx
app/src/pages/GradosTonalesPage.tsx
app/src/pages/EnarmoniaPage.tsx
app/src/pages/AcordesPage.tsx
app/src/pages/SemitonoPage.tsx
app/src/pages/NotasAdornoPage.tsx
app/src/data/transposeExercises.ts
app/src/data/compasTonalidadExercises.ts
app/src/data/completarCompasExercises.ts
app/src/data/notasExtranyasExercises.ts
app/src/data/gradosTonalesExercises.ts
app/src/data/enarmoniaExercises.ts
app/src/data/acordesExercises.ts
app/src/data/semitonoExercises.ts
app/src/data/notasAdornoExercises.ts
```

### Modified files
```
app/src/pages/TheoryPage.tsx           — use extracted components
app/src/pages/SyncopationPage.tsx      — wrap in TheoryPracticeLayout
app/src/pages/IntervalsPage.tsx        — wrap in TheoryPracticeLayout + expand theory
app/src/pages/ScalesPage.tsx           — wrap in TheoryPracticeLayout
app/src/pages/KeySignaturesPage.tsx    — wrap in TheoryPracticeLayout
app/src/components/layout/Sidebar.tsx  — add sections + new routes
app/src/App.tsx                        — add new routes
```

---

## Implementation Phases

### Phase 1 — Foundation (~1 day)
1. Extract `StepList` and `TheoryTable` from TheoryPage into `app/src/components/theory/`
2. Update TheoryPage to import from new location (no behavior change)
3. Build `TheoryPracticeLayout` component
4. Wrap 4 existing exercise pages (Síncopas, Intervalos, Escalas, Armadura) with theory tabs
5. Update Sidebar with section groups (no new routes yet)

### Phase 2 — Stub pages (~2 days)
6. Implement Transporte: data + exercises + theory
7. Implement Compás y Tonalidad: data + exercises + theory
8. Implement Completar compás: data + exercises + theory
9. Implement Notas extrañas: data + exercises + theory
10. Add these 4 routes to App.tsx

### Phase 3 — New theory topics (~2 days)
11. Implement Grados tonales: data + exercises + theory
12. Implement Enarmonía: data + exercises + theory
13. Implement Acordes perfectos: data + exercises + theory
14. Implement Semitono diat./crom.: data + exercises + theory
15. Implement Notas de adorno: data + exercises + theory
16. Add 5 new routes to App.tsx + update Sidebar with "TEORÍA ADICIONAL" section

---

## Constraints

- No interactive staff editor required for new exercises — MC only
- VexFlow only for pages that already use it (Síncopas, Intervalos)
- Theory content in Spanish, matching EA4 register
- Each theory page references book page (string badge, not a link)
- Exercises: minimum 10 items per page to allow variety
- Streak counter on all exercise pages
- TypeScript strict — no `any`
