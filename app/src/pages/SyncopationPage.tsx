import { useState, useCallback } from "react";
import { PageShell } from "../components/layout";
import { Card, Button, Badge } from "../components/ui";
import { VexFlowRenderer } from "../components/music/VexFlowRenderer";
import type { VexNote } from "../components/music/VexFlowRenderer";
import { randomSyncopationExercise } from "../data/syncopationExercises";
import type { SyncopationExercise } from "../data/syncopationExercises";

type BeatLabel = "" | "N" | "S" | "C" | "R";
type FeedbackState = "idle" | "checked";

const BEAT_TYPE_MAP: Record<string, BeatLabel> = {
  normal: "N",
  sincopa: "S",
  contratiempo: "C",
  silencio: "R",
};

const BEAT_FULL_NAME: Record<BeatLabel, string> = {
  "": "Sin etiquetar",
  N: "Normal",
  S: "Síncopa",
  C: "Contratiempo",
  R: "Silencio",
};

const BEAT_COLOR: Record<BeatLabel, string> = {
  "": "#9ca3af",
  N: "#6b7280",
  S: "#7c3aed",
  C: "#ea580c",
  R: "#64748b",
};

const LABEL_OPTIONS: { value: BeatLabel; label: string }[] = [
  { value: "N", label: "N — Normal" },
  { value: "S", label: "S — Síncopa" },
  { value: "C", label: "C — Contratiempo" },
  { value: "R", label: "R — Silencio/reposo" },
];

export default function SyncopationPage() {
  const [exercise, setExercise] = useState<SyncopationExercise>(randomSyncopationExercise);
  const [userLabels, setUserLabels] = useState<BeatLabel[]>(() =>
    new Array(exercise.notes.length).fill("")
  );
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showSolution, setShowSolution] = useState(false);

  const setLabel = useCallback((index: number, label: BeatLabel) => {
    setUserLabels((prev) => {
      const next = [...prev];
      next[index] = label;
      return next;
    });
    setFeedback("idle");
  }, []);

  const handleCheck = useCallback(() => {
    setFeedback("checked");
  }, []);

  const handleNext = useCallback(() => {
    const next = randomSyncopationExercise();
    setExercise(next);
    setUserLabels(new Array(next.notes.length).fill(""));
    setFeedback("idle");
    setShowSolution(false);
  }, []);

  const correctLabels = exercise.beatTypes.map((bt) => BEAT_TYPE_MAP[bt]);

  // Build annotated notes for display
  function buildAnnotatedNotes(labels: BeatLabel[]): VexNote[] {
    return exercise.notes.map((n, i) => ({
      ...n,
      annotations: labels[i] ? [labels[i]] : [],
      annotationColors: labels[i] ? [BEAT_COLOR[labels[i]]] : [],
    }));
  }

  const displayNotes = feedback === "checked"
    ? buildAnnotatedNotes(correctLabels)
    : buildAnnotatedNotes(userLabels);

  const score = feedback === "checked"
    ? correctLabels.filter((cl, i) => cl === userLabels[i]).length
    : 0;

  return (
    <PageShell title="1. Síncopas y Contratiempos">
      <div className="space-y-4">
        <Card>
          <p className="text-gray-600 text-sm">
            Etiqueta cada figura rítmica: <strong>S</strong> = Síncopa, <strong>C</strong> = Contratiempo, <strong>N</strong> = Normal, <strong>R</strong> = Silencio/reposo.
          </p>
        </Card>

        {/* Staff */}
        <Card title={exercise.title}>
          <VexFlowRenderer
            notes={displayNotes}
            timeSignature={exercise.timeSignature}
            keySignature={exercise.keySignature}
            width={540}
            height={155}
          />
        </Card>

        {/* Note labeling buttons */}
        <Card title="Etiqueta cada figura">
          <div className="space-y-3">
            {exercise.notes.map((_n, i) => {
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
                          "px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors",
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

          <div className="flex gap-3 mt-5">
            <Button
              onClick={handleCheck}
              disabled={userLabels.some((l) => l === "") || feedback === "checked"}
              variant="primary"
            >
              Comprobar
            </Button>
            <Button onClick={handleNext} variant="secondary">Siguiente</Button>
            <Button
              onClick={() => { setShowSolution(true); setFeedback("checked"); setUserLabels(correctLabels); }}
              variant="ghost"
              disabled={showSolution}
            >
              Ver solución
            </Button>
          </div>
        </Card>

        {feedback === "checked" && (
          <Card>
            <div className="flex items-center gap-3">
              <Badge color={score === exercise.notes.length ? "correct" : score > 0 ? "missing" : "incorrect"}>
                {score}/{exercise.notes.length} correctas
              </Badge>
              {score === exercise.notes.length && (
                <span className="text-green-700 font-medium">¡Perfecto!</span>
              )}
            </div>
          </Card>
        )}

        {showSolution && (
          <Card title="Solución">
            <ul className="space-y-1 text-sm">
              {exercise.beatTypes.map((bt, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-gray-400 w-20">Figura {i + 1}:</span>
                  <span className="font-medium capitalize">{bt} ({BEAT_TYPE_MAP[bt]})</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800 space-y-1">
              <p><strong>Síncopa (S):</strong> Nota que empieza en tiempo débil y liga con el tiempo fuerte siguiente.</p>
              <p><strong>Contratiempo (C):</strong> Nota breve en parte débil del tiempo, sin ligar al tiempo fuerte.</p>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
