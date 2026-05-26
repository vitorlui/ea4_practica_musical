import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PageShell } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { StepList } from "../components/theory/StepList";
import { TheoryTable } from "../components/theory/TheoryTable";
import { CircleOfFifthsRenderer } from "../components/music/CircleOfFifthsRenderer";
import { randomCirculoExercise } from "../data/circuloQuintasExercises";
import type { CirculoExercise } from "../data/circuloQuintasExercises";
import type { TheorySection } from "../components/theory/types";

/* ── theory content ─────────────────────────────────────────────────── */
const THEORY: TheorySection[] = [
  {
    id: "que-es",
    title: "¿Qué es el círculo de quintas?",
    steps: [
      {
        title: "Definición",
        body: "El círculo de quintas organiza las 12 tonalidades en un círculo ordenado por el número de alteraciones de su armadura. Girando a la derecha se añade un sostenido; girando a la izquierda se añade un bemol.",
      },
      {
        title: "Las dos zonas",
        body: "Zona derecha (superior): tonalidades con sostenidos. Zona izquierda (superior): tonalidades con bemoles. Fondo: zona enarmónica donde Fa♯ Mayor (6♯) = Sol♭ Mayor (6♭).",
      },
    ],
  },
  {
    id: "construccion-sostenidos",
    title: "Cómo construirlo: sostenidos (sentido horario ↻)",
    steps: [
      {
        title: "Regla: sube una 5ª justa",
        body: "Desde cada tónica, sube una 5ª justa (7 semitonos) para obtener la siguiente tonalidad. Cada paso añade 1 sostenido nuevo.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "h", annotations: ["Do"], annotationColors: ["#4338ca"] },
            { keys: ["g/4"], duration: "h", annotations: ["Sol"], annotationColors: ["#d97706"] },
          ],
          timeSignature: "", width: 280, height: 140,
          caption: "Do → Sol: 5ª justa ascendente (7 semitonos). Sol Mayor añade Fa♯",
        },
      },
      {
        title: "Secuencia completa de sostenidos",
        body: "Do (0♯) → Sol (1♯) → Re (2♯) → La (3♯) → Mi (4♯) → Si (5♯) → Fa♯ (6♯). El nuevo sostenido siempre es la nota 7ª de la nueva escala.",
      },
      {
        title: "Orden de los sostenidos",
        body: "Fa♯ · Do♯ · Sol♯ · Re♯ · La♯ · Mi♯ · Si♯. Mnemotécnica: 'Fa Do Sol Re La Mi Si'. Cada armadura incluye todos los sostenidos anteriores más uno nuevo.",
        highlight: true,
      },
    ],
    table: {
      headers: ["Paso ↻", "Tónica mayor", "Sostenidos", "Alteram."],
      rows: [
        ["—",    "Do",  "—",                       "0"],
        ["+5ª",  "Sol", "Fa♯",                     "1♯"],
        ["+5ª",  "Re",  "Fa♯ Do♯",                "2♯"],
        ["+5ª",  "La",  "Fa♯ Do♯ Sol♯",           "3♯"],
        ["+5ª",  "Mi",  "Fa♯ Do♯ Sol♯ Re♯",       "4♯"],
        ["+5ª",  "Si",  "Fa♯ Do♯ Sol♯ Re♯ La♯",   "5♯"],
        ["+5ª",  "Fa♯", "Fa♯ Do♯ Sol♯ Re♯ La♯ Mi♯","6♯"],
      ],
    },
  },
  {
    id: "construccion-bemoles",
    title: "Cómo construirlo: bemoles (sentido antihorario ↺)",
    steps: [
      {
        title: "Regla: baja una 5ª justa (o sube una 4ª)",
        body: "Desde cada tónica, baja una 5ª justa (= sube una 4ª justa, 5 semitonos). Cada paso añade 1 bemol nuevo.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "h", annotations: ["Do"], annotationColors: ["#4338ca"] },
            { keys: ["f/4"], duration: "h", annotations: ["Fa"], annotationColors: ["#2563eb"] },
          ],
          timeSignature: "", width: 280, height: 140,
          caption: "Do → Fa: 4ª justa ascendente (= 5ª ↓). Fa Mayor añade Si♭",
        },
      },
      {
        title: "Secuencia completa de bemoles",
        body: "Do (0♭) → Fa (1♭) → Si♭ (2♭) → Mi♭ (3♭) → La♭ (4♭) → Re♭ (5♭) → Sol♭ (6♭). El nuevo bemol siempre es la nota 4ª de la nueva escala.",
      },
      {
        title: "Orden de los bemoles",
        body: "Si♭ · Mi♭ · La♭ · Re♭ · Sol♭ · Do♭ · Fa♭. Es el orden inverso al de los sostenidos. La tónica mayor es siempre el PENÚLTIMO bemol (excepción: Fa Mayor con 1♭, memorizar).",
        highlight: true,
      },
    ],
    table: {
      headers: ["Paso ↺", "Tónica mayor", "Bemoles", "Alteram."],
      rows: [
        ["—",   "Do",  "—",                          "0"],
        ["+4ª", "Fa",  "Si♭",                        "1♭"],
        ["+4ª", "Si♭", "Si♭ Mi♭",                   "2♭"],
        ["+4ª", "Mi♭", "Si♭ Mi♭ La♭",               "3♭"],
        ["+4ª", "La♭", "Si♭ Mi♭ La♭ Re♭",           "4♭"],
        ["+4ª", "Re♭", "Si♭ Mi♭ La♭ Re♭ Sol♭",      "5♭"],
        ["+4ª", "Sol♭","Si♭ Mi♭ La♭ Re♭ Sol♭ Do♭",  "6♭"],
      ],
    },
  },
  {
    id: "relativas",
    title: "Anillo interior: tonalidades relativas menores",
    steps: [
      {
        title: "La relativa menor",
        body: "Cada tonalidad mayor comparte su armadura con una tonalidad menor llamada 'relativa'. La relativa menor está una 3ª menor (3 semitonos) por debajo de la mayor.",
        staffExample: {
          notes: [
            { keys: ["g/4"], duration: "h", annotations: ["Sol M"], annotationColors: ["#d97706"] },
            { keys: ["e/4"], duration: "h", annotations: ["Mi m"], annotationColors: ["#7c3aed"] },
          ],
          keySignature: "G",
          timeSignature: "", width: 300, height: 140,
          caption: "Sol Mayor y Mi menor: misma armadura (Fa♯). Mi = Sol − 3ª menor",
        },
      },
      {
        title: "Cómo identificar la relativa menor",
        body: "Regla rápida: baja 1 tono y medio (3 semitonos) desde la tónica mayor. Sol → Mi (−3ST). Do → La (−3ST). Fa → Re (−3ST).",
      },
    ],
    table: {
      headers: ["Mayor", "Relativa menor", "Armadura"],
      rows: [
        ["Do",  "La m",   "0"],
        ["Sol", "Mi m",   "1♯"],
        ["Re",  "Si m",   "2♯"],
        ["La",  "Fa♯ m",  "3♯"],
        ["Mi",  "Do♯ m",  "4♯"],
        ["Fa",  "Re m",   "1♭"],
        ["Si♭", "Sol m",  "2♭"],
        ["Mi♭", "Do m",   "3♭"],
      ],
    },
  },
  {
    id: "enarmonias",
    title: "Zona enarmónica (fondo del círculo)",
    steps: [
      {
        title: "Tonalidades enarmónicas",
        body: "En el fondo del círculo (6♯/6♭) existen tonalidades que suenan igual pero se escriben de forma distinta: Fa♯ Mayor = Sol♭ Mayor, Si Mayor = Do♭ Mayor (5♯/7♭), Re♭ Mayor = Do♯ Mayor (5♭/7♯).",
        staffExample: {
          notes: [
            { keys: ["f/4"], accidentals: ["#"], duration: "w", annotations: ["Fa♯ M"], annotationColors: ["#92400e"] },
          ],
          keySignature: "F#",
          timeSignature: "", caption: "Fa♯ Mayor (6♯) = Sol♭ Mayor (6♭): misma tecla, distinta escritura",
        },
      },
    ],
  },
];

/* ── page ───────────────────────────────────────────────────────────── */
export default function CirculoQuintasPage() {
  const [params] = useSearchParams();
  const view = params.get("v") === "practica" ? "practica" : "teoria";

  const [exercise, setExercise] = useState<CirculoExercise>(randomCirculoExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomCirculoExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <PageShell title="Círculo de Quintas">
      {/* badge */}
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
          📚 Teoría tonal fundamental (Unitats 3–4)
        </span>
        <span className="text-xs text-gray-400 capitalize">
          {view === "teoria" ? "Teoría" : "Práctica"}
        </span>
      </div>

      {view === "teoria" ? (
        <div className="space-y-6">
          {/* ── interactive circle ─────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <CircleOfFifthsRenderer />
          </div>

          {/* ── construction instructions ──────────────── */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-bold text-indigo-800 mb-2">Reglas de construcción (resumen rápido)</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold text-amber-800 mb-1">↻ Sostenidos (horario)</p>
                <p className="text-amber-700 text-xs">Sube una 5ª justa cada paso.<br />Do→Sol→Re→La→Mi→Si→Fa♯<br />Cada tónica = último ♯ + 1 semitono ↑</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-semibold text-blue-800 mb-1">↺ Bemoles (antihorario)</p>
                <p className="text-blue-700 text-xs">Sube una 4ª justa (= baja 5ª) cada paso.<br />Do→Fa→Si♭→Mi♭→La♭→Re♭→Sol♭<br />Tónica = penúltimo ♭ (excepto Fa)</p>
              </div>
            </div>
          </div>

          {/* ── full theory sections ────────────────────── */}
          <div className="space-y-5">
            {THEORY.map((section) => (
              <div key={section.id} className="space-y-4">
                {section.title && (
                  <h3 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-1">
                    {section.title}
                  </h3>
                )}
                {section.steps && <StepList steps={section.steps} />}
                {section.table && <TheoryTable table={section.table} />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <MCExerciseCard
          key={key}
          question={exercise.question}
          options={exercise.options}
          correctIndex={exercise.correctIndex}
          explanation={exercise.explanation}
          streak={streak}
          onAnswer={(correct) => setStreak((s) => correct ? s + 1 : 0)}
          onNext={handleNext}
        />
      )}
    </PageShell>
  );
}
