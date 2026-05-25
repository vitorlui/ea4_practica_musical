import { useState, useCallback } from "react";
import { PageShell } from "../components/layout";
import { Card, Button, Badge, Select } from "../components/ui";
import { VexFlowRenderer } from "../components/music/VexFlowRenderer";
import { randomIntervalExercise, noteToVexKey } from "../data/intervalExercises";
import type { IntervalExercise } from "../data/intervalExercises";

type FeedbackState = "idle" | "correct" | "incorrect";

const INTERVAL_NUMBERS = [
  { value: "2", label: "2ª" },
  { value: "3", label: "3ª" },
  { value: "4", label: "4ª" },
  { value: "5", label: "5ª" },
  { value: "6", label: "6ª" },
  { value: "7", label: "7ª" },
  { value: "8", label: "8ª (octava)" },
];

const INTERVAL_QUALITIES = [
  { value: "justa", label: "Justa" },
  { value: "mayor", label: "Mayor" },
  { value: "menor", label: "Menor" },
  { value: "aumentada", label: "Aumentada" },
  { value: "disminuida", label: "Disminuida" },
];

export default function IntervalsPage() {
  const [exercise, setExercise] = useState<IntervalExercise>(randomIntervalExercise);
  const [selectedNumber, setSelectedNumber] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showSolution, setShowSolution] = useState(false);
  const [streak, setStreak] = useState(0);

  const lowerKey = noteToVexKey(exercise.lower);
  const upperKey = noteToVexKey(exercise.upper);

  const lowerAcc = exercise.lower.accidental || null;
  const upperAcc = exercise.upper.accidental || null;

  const handleCheck = useCallback(() => {
    const numCorrect = parseInt(selectedNumber) === exercise.number;
    const qualCorrect = selectedQuality === exercise.quality;
    if (numCorrect && qualCorrect) {
      setFeedback("correct");
      setStreak((s) => s + 1);
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }
  }, [selectedNumber, selectedQuality, exercise]);

  const handleNext = useCallback(() => {
    setExercise(randomIntervalExercise());
    setSelectedNumber("");
    setSelectedQuality("");
    setFeedback("idle");
    setShowSolution(false);
  }, []);

  return (
    <PageShell title="4. Intervalos">
      <div className="space-y-4">
        <Card>
          <p className="text-gray-600 text-sm">
            Identifica el intervalo entre las dos notas del pentagrama (número y calidad).
          </p>
          {streak > 1 && <Badge color="correct" className="mt-2">Racha: {streak} correctas</Badge>}
        </Card>

        {/* Staff showing the two notes */}
        <Card title="Intervalo">
          <VexFlowRenderer
            notes={[
              {
                keys: [lowerKey, upperKey],
                duration: "h",
                accidentals: [lowerAcc, upperAcc],
              },
            ]}
            timeSignature=""
            keySignature="C"
            width={280}
            height={160}
          />
          <p className="text-xs text-gray-400 mt-1">
            {lowerKey.toUpperCase()} — {upperKey.toUpperCase()}
          </p>
        </Card>

        {/* Answer form */}
        <Card title="Tu respuesta">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              label="Número"
              value={selectedNumber}
              onChange={(e) => { setSelectedNumber(e.target.value); setFeedback("idle"); }}
              options={[{ value: "", label: "Selecciona…" }, ...INTERVAL_NUMBERS]}
            />
            <Select
              label="Calidad"
              value={selectedQuality}
              onChange={(e) => { setSelectedQuality(e.target.value); setFeedback("idle"); }}
              options={[{ value: "", label: "Selecciona…" }, ...INTERVAL_QUALITIES]}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleCheck}
              disabled={!selectedNumber || !selectedQuality || feedback !== "idle"}
              variant="primary"
            >
              Comprobar
            </Button>
            <Button onClick={handleNext} variant="secondary">Siguiente</Button>
            <Button onClick={() => setShowSolution(true)} variant="ghost" disabled={showSolution}>
              Ver solución
            </Button>
          </div>
        </Card>

        {feedback !== "idle" && (
          <Card>
            {feedback === "correct" ? (
              <div className="flex items-center gap-2">
                <Badge color="correct">Correcto</Badge>
                <span className="text-green-700 font-medium">{exercise.label}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge color="incorrect">Incorrecto</Badge>
                <p className="text-red-700 text-sm">
                  La respuesta correcta es: <strong>{exercise.label}</strong>
                </p>
              </div>
            )}
          </Card>
        )}

        {showSolution && (
          <Card title="Solución">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-gray-500">Nota inferior</dt>
              <dd className="font-medium">{lowerKey.toUpperCase()}</dd>
              <dt className="text-gray-500">Nota superior</dt>
              <dd className="font-medium">{upperKey.toUpperCase()}</dd>
              <dt className="text-gray-500">Número</dt>
              <dd className="font-medium">{exercise.number}ª</dd>
              <dt className="text-gray-500">Calidad</dt>
              <dd className="font-medium capitalize">{exercise.quality}</dd>
              <dt className="text-gray-500">Intervalo</dt>
              <dd className="font-bold text-blue-700">{exercise.label}</dd>
            </dl>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
