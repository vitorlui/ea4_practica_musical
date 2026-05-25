import { useState, useCallback, useMemo } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { Card, Button, Badge } from "../components/ui";
import type { TheorySection } from "../components/theory/types";

const SINCOPA_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué es el tiempo fuerte?", body: "En un compás, el primer tiempo siempre es fuerte. En 4/4 también es semifuerte el tercer tiempo. Los demás son débiles." },
      { title: "Definición de síncopa", body: "Una síncopa es una nota que empieza en un tiempo o parte DÉBIL y se prolonga (por su valor o ligada) ocupando el tiempo FUERTE siguiente. La nota 'atraviesa' la línea de tiempo fuerte." },
      { title: "Definición de contratiempo", body: "Un contratiempo es una nota corta que ocupa un tiempo o parte DÉBIL, precedida por una pausa en tiempo fuerte. No se prolonga al tiempo fuerte. Hay pausa en el tiempo fuerte." },
      { title: "Cómo identificar síncopa (método)", body: "1) Señala los tiempos fuertes. 2) Busca notas que empiecen en tiempo débil. 3) Si esa nota cruza el tiempo fuerte siguiente (por duración o ligadura) → síncopa." },
      { title: "Cómo identificar contratiempo (método)", body: "1) Señala los tiempos fuertes. 2) Busca pausas en tiempo fuerte. 3) Si después de la pausa hay una nota en tiempo débil que no llega al fuerte → contratiempo." },
      { title: "Regla mnemotécnica", body: "SÍNCOPA: la nota 'salta' sobre el tiempo fuerte. CONTRATIEMPO: la pausa 'ocupa' el tiempo fuerte.", highlight: true },
    ],
    table: {
      headers: ["", "Síncopa (>)", "Contratiempo (+)"],
      rows: [
        ["Empieza en", "Tiempo débil", "Tiempo débil"],
        ["Tiempo fuerte", "Ocupado por la nota (ligada o por valor)", "Ocupado por pausa"],
        ["Ligadura", "Frecuente (puede ser por valor)", "No"],
        ["Símbolo libro", ">", "+"],
      ],
    },
  },
];
import { MultiMeasureRenderer } from "../components/music/MultiMeasureRenderer";
import { MetricTreeRenderer } from "../components/music/MetricTreeRenderer";
import type { MeasureData } from "../components/music/MultiMeasureRenderer";
import { randomSyncopationExercise } from "../data/syncopationExercises";
import type { SyncopationExercise } from "../data/syncopationExercises";
import { addBeatStrengths } from "../utils/metricLabels";
import { classifyMeasures } from "../utils/beatTypeClassifier";

type BeatLabel = "" | "N" | "S" | "C" | "R";
type FeedbackState = "idle" | "checked";

const BEAT_TYPE_MAP: Record<string, BeatLabel> = {
  normal: "N",
  sincopa: "S",
  contratiempo: "C",
  silencio: "R",
};

const BEAT_FULL_NAME: Record<BeatLabel, string> = {
  "": "Sense etiquetar",
  N: "Normal",
  S: "Síncopa",
  C: "Contratemps",
  R: "Silenci",
};

// Colors for user-labeling mode
const BEAT_COLOR: Record<BeatLabel, string> = {
  "": "#9ca3af",
  N: "#6b7280",
  S: "#7c3aed",
  C: "#ea580c",
  R: "#64748b",
};

// Solution symbols shown in the staff
const SOLUTION_SYMBOL: Record<BeatLabel, string> = {
  "": "",
  N: "",
  S: ">",
  C: "+",
  R: "",
};

const SOLUTION_COLOR: Record<BeatLabel, string> = {
  "": "#9ca3af",
  N: "#9ca3af",
  S: "#7c3aed",
  C: "#ea580c",
  R: "#64748b",
};

const LABEL_OPTIONS: { value: BeatLabel; label: string }[] = [
  { value: "N", label: "N — Normal" },
  { value: "S", label: "S — Síncopa" },
  { value: "C", label: "C — Contratemps" },
  { value: "R", label: "R — Silenci" },
];

function totalNotes(ex: SyncopationExercise) {
  return ex.measures.reduce((acc, m) => acc + m.notes.length, 0);
}

function buildAnnotatedMeasures(
  ex: SyncopationExercise,
  labels: BeatLabel[],
  solutionMode: boolean,
): MeasureData[] {
  let noteIdx = 0;
  return ex.measures.map((m) => ({
    ...m,
    notes: m.notes.map((n) => {
      const label = labels[noteIdx++];
      if (!label) return n;
      const symbol = solutionMode ? SOLUTION_SYMBOL[label] : label;
      const color = solutionMode ? SOLUTION_COLOR[label] : BEAT_COLOR[label];
      if (!symbol) return n;
      return {
        ...n,
        annotations: [symbol],
        annotationColors: [color],
      };
    }),
  }));
}

export default function SyncopationPage() {
  const [exercise, setExercise] = useState<SyncopationExercise>(randomSyncopationExercise);
  const [userLabels, setUserLabels] = useState<BeatLabel[]>(() =>
    new Array(totalNotes(exercise)).fill("")
  );
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showSolution, setShowSolution] = useState(false);
  const [showBeatLabels, setShowBeatLabels] = useState(true);
  const [showTree, setShowTree] = useState(true);

  const correctLabels = classifyMeasures(exercise.measures, exercise.timeSignature)
    .map((bt) => BEAT_TYPE_MAP[bt]);

  const setLabel = useCallback((index: number, label: BeatLabel) => {
    setUserLabels((prev) => {
      const next = [...prev];
      next[index] = label;
      return next;
    });
    setFeedback("idle");
  }, []);

  const handleNext = useCallback(() => {
    const next = randomSyncopationExercise();
    setExercise(next);
    setUserLabels(new Array(totalNotes(next)).fill(""));
    setFeedback("idle");
    setShowSolution(false);
  }, []);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
    setFeedback("checked");
    setUserLabels(correctLabels);
  }, [correctLabels]);

  const displayMeasures = useMemo(() => {
    const inSolutionMode = feedback === "checked";
    const annotated = buildAnnotatedMeasures(
      exercise,
      inSolutionMode ? correctLabels : userLabels,
      inSolutionMode,
    );
    return showBeatLabels ? addBeatStrengths(annotated, exercise.timeSignature) : annotated;
  }, [exercise, feedback, correctLabels, userLabels, showBeatLabels]);

  const score =
    feedback === "checked"
      ? correctLabels.filter((cl, i) => cl === userLabels[i]).length
      : 0;

  const numNotes = totalNotes(exercise);

  return (
    <TheoryPracticeLayout
      title="1. Síncopas y Contratiempos"
      bookPages="p.16–23 (Unitat 1)"
      theory={SINCOPA_THEORY}
    >
      <div className="space-y-4">
        <Card>
          <p className="text-gray-600 text-sm">
            Etiqueta cada figura rítmica:{" "}
            <strong>S</strong> = Síncopa (<strong>&gt;</strong>),{" "}
            <strong>C</strong> = Contratemps (<strong>+</strong>),{" "}
            <strong>N</strong> = Normal,{" "}
            <strong>R</strong> = Silenci.
          </p>
          <div className="flex gap-4 mt-2 flex-wrap">
            <label className="flex items-center gap-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showBeatLabels}
                onChange={(e) => setShowBeatLabels(e.target.checked)}
                className="rounded"
              />
              Mostrar temps (F / D / SF)
            </label>
            <label className="flex items-center gap-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showTree}
                onChange={(e) => setShowTree(e.target.checked)}
                className="rounded"
              />
              Mostrar arbre mètric
            </label>
          </div>
        </Card>

        {/* Staff */}
        <Card title={exercise.title}>
          <MultiMeasureRenderer
            measures={displayMeasures}
            keySignature={exercise.keySignature}
            timeSignature={exercise.timeSignature}
            measuresPerRow={2}
            measureWidth={220}
            rowHeight={155}
          />
          {showTree && (
            <div className="mt-2 border-t border-gray-100 pt-2">
              <p className="text-xs text-gray-400 mb-1">Arbre mètric:</p>
              <MetricTreeRenderer
                timeSignature={exercise.timeSignature}
                width={520}
              />
            </div>
          )}
        </Card>

        {/* Labeling buttons */}
        <Card title="Etiqueta cada figura">
          <div className="space-y-2">
            {Array.from({ length: numNotes }, (_, i) => {
              const isCorrect = feedback === "checked" && userLabels[i] === correctLabels[i];
              return (
                <div key={i} className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-500 w-20">Figura {i + 1}:</span>
                  <div className="flex gap-2 flex-wrap">
                    {LABEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setLabel(i, opt.value)}
                        disabled={feedback === "checked"}
                        className={[
                          "px-3 py-1 rounded-lg text-sm font-medium border transition-colors",
                          userLabels[i] === opt.value
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                        ].join(" ")}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                  {feedback === "checked" && (
                    <span className={isCorrect ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
                      {isCorrect ? "✓" : `✗ (${BEAT_FULL_NAME[correctLabels[i]]})`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-5 flex-wrap">
            <Button
              onClick={() => setFeedback("checked")}
              disabled={userLabels.some((l) => l === "") || feedback === "checked"}
              variant="primary"
            >
              Comprovar
            </Button>
            <Button onClick={handleNext} variant="secondary">Següent</Button>
            <Button onClick={handleShowSolution} variant="ghost" disabled={showSolution}>
              Veure solució
            </Button>
          </div>
        </Card>

        {feedback === "checked" && (
          <Card>
            <div className="flex items-center gap-3">
              <Badge color={score === numNotes ? "correct" : score > 0 ? "missing" : "incorrect"}>
                {score}/{numNotes} correctes
              </Badge>
              {score === numNotes && (
                <span className="text-green-700 font-medium">Perfecte!</span>
              )}
            </div>
          </Card>
        )}

        {showSolution && (
          <Card title="Solució">
            <ul className="space-y-1 text-sm">
              {exercise.beatTypes.map((bt, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-gray-400 w-20">Figura {i + 1}:</span>
                  <span className="font-medium capitalize">
                    {bt}
                    {bt === "sincopa" && <span className="ml-1 text-purple-600 font-bold">&gt;</span>}
                    {bt === "contratiempo" && <span className="ml-1 text-orange-600 font-bold">+</span>}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 space-y-1">
              <p><strong>Síncopa (&gt;):</strong> Nota que comença en temps dèbil i es prolonga ocupant el temps fort següent.</p>
              <p><strong>Contratemps (+):</strong> Nota breu en la part dèbil del temps, sense lligar al temps fort.</p>
            </div>
          </Card>
        )}
      </div>
    </TheoryPracticeLayout>
  );
}
