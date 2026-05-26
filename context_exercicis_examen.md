# Context per crear nous exercicis d'examen EA4

## Arxius principals

| Arxiu | Funció |
|---|---|
| `app/src/theory/types.ts` | Tipus compartits: `ExamExerciseType`, `ExamConfig`, configs per exercici |
| `app/src/exam/ExamGenerator.ts` | Dades estàtiques + funcions generadores |
| `app/src/pages/ExamPage.tsx` | Renderitzat de cada exercici (pregunta + solució) |
| `app/src/components/music/VexFlowRenderer.tsx` | Pentagrama d'un sol compàs (1 stave) |
| `app/src/components/music/MultiMeasureRenderer.tsx` | Múltiples compassos en files |

---

## Interfície VexNote (VexFlowRenderer.tsx)

```typescript
interface VexNote {
  keys: string[];                   // notes VexFlow: ["c/4"], ["c/4","e/4","g/4"] (acord)
  duration: string;                 // "w" "h" "q" "8" "16" | afegir "r" = silenci, "d" = punt
  accidentals?: (string|null)[];    // ["#"], ["b"], [null,"#"] — un per nota del keys[]
  annotations?: string[];           // etiquetes DALT (sobre la nota)
  annotationColors?: string[];      // colors hex per annotation[]
  bottomAnnotations?: string[];     // etiquetes BAIX (sota la nota)
  bottomAnnotationColors?: string[];
  isRest?: boolean;                 // true = silenci (keys s'ignoren visualment)
  dots?: number;                    // 1 = nota amb punt. OBLIGATORI usar Dot.buildAndAttach()
  tieToNext?: boolean;              // lligadura fins la nota següent (o siguiente compàs)
  color?: string;                   // color nota + plica
  ornament?: string;                // "mordent" "mordentInverted" "trill" "trillh" "turn" "turnInverted"
  arpeggio?: boolean;               // ona vertical d'arpeig
}
```

### Durades útils
| Codi | Nom | Valor |
|---|---|---|
| `"w"` | Rodona | 4 temps |
| `"h"` | Blanca | 2 temps |
| `"h"` + `dots:1` | Blanca amb punt | 3 temps |
| `"q"` | Negra | 1 temps |
| `"8"` | Corxera | ½ temps |
| `"wr"` | Silenci de rodona | — |
| `"hr"` | Silenci de blanca | — |
| `"qr"` | Silenci de negra | — |

### Notes VexFlow
Format: `"noteta/octava"` — lletres angleses (c=Do, d=Re, e=Mi, f=Fa, g=Sol, a=La, b=Si).
Alteració va a `accidentals`, no a la key: `keys: ["c/4"], accidentals: ["#"]` → Do#4.
Excepcions amb alteració ja a la key (armadura ja la conté): `"f#/4"`, `"bb/4"` — 
però cal posar `accidentals: ["#"]` si volem el símbol visible quan no hi ha armadura.

### Colors estàndard usats al projecte
```
NP (nota de pas): "#dc2626"  (vermell)
B  (bordadura):   "#7c3aed"  (morat)
A  (apoggiatura): "#ea580c"  (taronja)
I  (tònica):      "#1d4ed8"  (blau)
IV (subdominant): "#16a34a"  (verd)
V  (dominant):    "#c2410c"  (taronja fosc)
VII (sensible):   "#dc2626"  (vermell)
Major:            "#1d4ed8"  (blau)
Menor:            "#b91c1c"  (vermell fosc)
Diatònic:         "#16a34a"  (verd)
Cromàtic:         "#dc2626"  (vermell)
```

---

## VexFlowRenderer — ús habitual

```tsx
<VexFlowRenderer
  notes={noteArray}
  timeSignature=""          // "" = sense compàs
  keySignature="C"          // "G", "F", "Bb", "D"... (sempre tònica del mode major)
  clef="treble"             // o "bass"
  width={220}               // amplada total SVG
  height={120}              // alçada total SVG
  staveY={20}               // distància des de dalt fins la 1a línia del pentagrama
                            // ↑ augmentar si hi ha anotacions dalt (35–50)
/>
```

**Regles staveY:**
- Sense anotacions: `staveY=20`
- Amb annotations (TOP): `staveY=35–50`
- Múltiples anotacions apilades (ex: intervals): `staveY=80`

**Mode SOFT**: VexFlowRenderer usa `Voice.Mode.SOFT` → no comprova que la suma de duracion ompli el compàs. Pots posar qualsevol combinació de notes.

---

## MultiMeasureRenderer — ús habitual

```tsx
<MultiMeasureRenderer
  measures={measuresArray}   // MeasureData[] — cadascun té { notes: VexNote[] }
  keySignature="G"
  timeSignature="3/4"
  measuresPerRow={4}
  measureWidth={160}
  rowHeight={160}
  topPadding={10}
/>
```

---

## Patró d'exercici al ExamGenerator.ts

Cada exercici segueix aquest esquema:

```typescript
// 1. Dades estàtiques (array de possibilitats)
const TEMA_ITEMS: TemaItemDef[] = [ ... ];

// 2. Funció generadora
function generateTemaExercise(num: number, cfg: TemaConfig): ExamExercise {
  // filtrar per config, barrejar, prendre n elements
  const pool = filterOrAll(TEMA_ITEMS, x => cfg.foo.length === 0 || cfg.foo.includes(x.foo));
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
  
  // construir items (pre-calcular VexNotes per pregunta i solució)
  const items = shuffled.map(x => ({
    questionNotes: [...],   // notes per a la pregunta (sense labels, sense colors)
    solutionNotes: [...],   // notes per a la solució (amb labels, colors)
    label: x.label,         // text de solució
  }));
  
  return {
    type: "tema",
    number: num,
    title: "Títol en català",
    instructions: "Instruccions en català per a l'alumne.",
    data: { items },
    solution: { items },    // mateixa ref: ExamPage accedeix als camps que necessita
  };
}
```

### filterOrAll
```typescript
// ja existent al ExamGenerator.ts:
function filterOrAll<T>(arr: T[], predicate: (x: T) => boolean): T[] {
  const filtered = arr.filter(predicate);
  return filtered.length > 0 ? filtered : arr;
}
```

---

## Patró de renderitzat al ExamPage.tsx

### Pregunta (dins `<div className="exam-question-content">`)
```tsx
{exercise.type === "tema" && (() => {
  type TemaItem = { questionNotes: VexNote[]; label: string };
  const items = (data.items as TemaItem[]) ?? [];
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <VexFlowRenderer
            notes={item.questionNotes}
            timeSignature=""
            keySignature="C"
            width={200}
            height={120}
            staveY={35}
          />
          {/* línies en blanc per a la resposta */}
          <div className="mt-1 w-36 space-y-2">
            <div className="border-b border-gray-400 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
})()}
```

### Solució (dins `<SolutionBox>`)
```tsx
{exercise.type === "tema" && (() => {
  type TemaItem = { solutionNotes: VexNote[]; label: string };
  const items = (sol.items as TemaItem[]) ?? [];
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <VexFlowRenderer
            notes={item.solutionNotes}
            timeSignature=""
            keySignature="C"
            width={200}
            height={130}
            staveY={35}
          />
          <p className="text-center text-xs font-semibold text-blue-700">{item.label}</p>
        </div>
      ))}
    </div>
  );
})()}
```

---

## Afegir un nou tipus d'exercici — checklist

1. **`types.ts`**: afegir el string al `ExamExerciseType` union. Afegir `XxxConfig` interface si cal config avançada. Afegir camp opcional a `ExamConfig`.
2. **`ExamGenerator.ts`**: 
   - Afegir interfície de dades estàtiques + array constant
   - Afegir funció `generateXxxExercise(num, cfg)` 
   - Afegir case al switch de `generateExam()`
   - Afegir string a `DEFAULT_EXERCISE_ORDER`
   - Afegir import del nou config type
3. **`ExamPage.tsx`**:
   - Afegir estat `const [xxxFilter, setXxxFilter] = useState(...)` 
   - Afegir `xxxConfig: { ... }` al `config` dins `handleGenerate`
   - Afegir bloc pregunta `{exercise.type === "xxx" && ...}` dins `exam-question-content`
   - Afegir bloc solució dins `<SolutionBox>`
   - Afegir secció `<CfgSection label="Ex. N — Xxx">` al panell de config avançada

---

## Exercicis actuals (exercicis 1–11)

| Num | Tipus | Visualització principal |
|---|---|---|
| 1 | `sincopa` | MultiMeasureRenderer 4 compassos, anotacions >/+ |
| 2 | `transporte` | MultiMeasureRenderer original + espai buit per cada transposició |
| 3 | `compas_tonalidad` | VexFlowRenderer notes planes (sense barres) → sol barres + anotacions I/IV/V/VII |
| 4 | `intervalos` | VexFlowRenderer 9 notes amb anotacions intervals dalt/baix |
| 5 | `completar_compas` | Grid 3×2 VexFlowRenderer, notes donades → sol completes en vermell |
| 6 | `escalas` | Pentagrama buit → sol amb 8 notes de l'escala |
| 7 | `armadura` | Grid 3×2 VexFlowRenderer armadures amb silenci → sol etiquetes major/menor |
| 8 | `notas_extranyas` | MultiMeasureRenderer 4 compassos → sol anotacions NP/B/A en colors |
| 9 | `enarmonia` | Grid 3×2 nota donada + silenci → sol nota donada + nota enarmònica ambdues etiquetades |
| 10 | `acordes` | Grid 3×2 acord sense etiqueta → sol acord acolorit + nom sota |
| 11 | `semitonos` | Grid 3×2 parell de notes → sol parells acolorits + etiqueta Diatònic/Cromàtic |

---

## Convencions de noms de notes

Sempre espanyol/català: Do Re Mi Fa Sol La Si (mai C D E F G A B en text visible a l'alumne).
Alteracions: # = sostingut, ♭ = bemol (o b en codi). Ex: "Fa#", "Si♭", "Do#", "Reb".

## Clau de Sol vs. Clau de Fa

Per defecte `clef="treble"` (clau de Sol). Usar `clef="bass"` only si l'exercici ho requereix explícitament.

## Armadures per a VexFlow

VexFlow `keySignature` sempre ha de rebre el **tònic del mode MAJOR** corresponent:
- Do major / La menor → `"C"`
- Sol major / Mi menor → `"G"`
- Re major / Si menor → `"D"`
- Fa major / Re menor → `"F"`
- Si♭ major / Sol menor → `"Bb"`

Mai passar el tònic d'un mode menor directament (ex: "A" per La menor → mostraria La major amb 3 sostenidos).

## Impressió (CSS)

- `.solution-box` és ocult per defecte a `@media print` → "Imprimir examen" no mostra solucions
- `body.print-solution-only .solution-box` → visible → "Imprimir solució" mostra solucions
- `.no-print` → ocult sempre en impressió (botons, configuració, nav)
- `.exam-question-content` ocultat amb `print-solution-only` (mostra sol la solució)
