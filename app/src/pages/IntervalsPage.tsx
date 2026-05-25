import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { Card, Button, Badge, Select } from "../components/ui";
import type { TheorySection } from "../components/theory/types";

const INTERVALOS_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "Número del intervalo", body: "Cuenta las notas desde la nota inferior hasta la superior, incluidas ambas. Do→Sol: Do(1), Re(2), Mi(3), Fa(4), Sol(5) → 5ª." },
      { title: "Calidad: mayores y menores", body: "Son mayores o menores: 2ª, 3ª, 6ª, 7ª. Mayor = más semitonos; menor = menos. Ej: 3ª mayor = 4 semitonos (Do-Mi); 3ª menor = 3 semitonos (Re-Fa)." },
      { title: "Calidad: justos", body: "Son justos: 4ª, 5ª, 8ª. 4ª justa = 5st, 5ª justa = 7st, 8ª justa = 12st. Los intervalos justos no pueden ser mayores ni menores." },
      { title: "Aumentado y disminuido", body: "Aumentado = 1 semitono más que mayor/justo. Disminuido = 1 semitono menos que menor/justo. Ej: 4ª aumentada = 6st (Do-Fa#); 5ª disminuida = 6st (Si-Fa)." },
      { title: "Melódico vs armónico", body: "Melódico: las dos notas suenan una después de la otra (puede ser ascendente o descendente). Armónico: las dos notas suenan simultáneamente." },
      { title: "Conjunto vs disjunto", body: "Conjunto: distancia de 2ª (grado conjunto, notas adyacentes). Disjunto: más de una 2ª (salto)." },
      { title: "Simple vs compuesto", body: "Simple: hasta la 8ª inclusive. Compuesto: supera la octava (9ª, 10ª...). En EA4 se trabajan principalmente los simples." },
    ],
    table: {
      headers: ["Intervalo", "Semitonos", "Calidad", "Consonancia"],
      rows: [
        ["2ª menor", "1", "menor", { text: "Disonante", badge: "disonante" }],
        ["2ª mayor", "2", "mayor", { text: "Disonante", badge: "disonante" }],
        ["3ª menor", "3", "menor", { text: "Consonancia imperfecta", badge: "imperfecta" }],
        ["3ª mayor", "4", "mayor", { text: "Consonancia imperfecta", badge: "imperfecta" }],
        ["4ª justa", "5", "justa", { text: "Disonante*", badge: "disonante" }],
        ["4ª aumentada / 5ª dis.", "6", "aum./dis.", { text: "Disonante", badge: "disonante" }],
        ["5ª justa", "7", "justa", { text: "Consonancia perfecta", badge: "perfecta" }],
        ["6ª menor", "8", "menor", { text: "Consonancia imperfecta", badge: "imperfecta" }],
        ["6ª mayor", "9", "mayor", { text: "Consonancia imperfecta", badge: "imperfecta" }],
        ["7ª menor", "10", "menor", { text: "Disonante", badge: "disonante" }],
        ["7ª mayor", "11", "mayor", { text: "Disonante", badge: "disonante" }],
        ["8ª justa", "12", "justa", { text: "Consonancia perfecta", badge: "perfecta" }],
      ],
    },
  },
];
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
    <TheoryPracticeLayout
      title="4. Intervalos"
      bookPages="p.72–79 (Unitat 8) · p.16–23 (Unitat 1)"
      theory={INTERVALOS_THEORY}
    >
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
    </TheoryPracticeLayout>
  );
}
