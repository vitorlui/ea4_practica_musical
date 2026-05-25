import { useState, useCallback } from "react";
import { PageShell } from "../components/layout";
import { Card, Button, Badge, Select } from "../components/ui";
import { VexFlowRenderer } from "../components/music/VexFlowRenderer";
import type { VexNote } from "../components/music/VexFlowRenderer";
import { buildScale, noteToSpanish } from "../theory/scales";
import { randomScaleExercise } from "../data/scaleExercises";
import type { ScaleExerciseConfig } from "../data/scaleExercises";
import type { ScaleType } from "../theory/types";

type FeedbackState = "idle" | "correct" | "incorrect";

const SCALE_TYPE_OPTIONS = [
  { value: "major", label: "Mayor" },
  { value: "natural_minor", label: "Menor natural" },
  { value: "harmonic_minor", label: "Menor armónica" },
];

function noteToVexKey(note: ReturnType<typeof buildScale>[0]): string {
  const map: Record<string, string> = { C: "c", D: "d", E: "e", F: "f", G: "g", A: "a", B: "b" };
  return `${map[note.name]}${note.accidental}/${note.octave}`;
}

function scaleToVexNotes(tonic: string, scaleType: ScaleType): VexNote[] {
  const notes = buildScale(tonic, scaleType);
  return notes.map((n) => ({
    keys: [noteToVexKey(n)],
    duration: "q",
    accidentals: [n.accidental || null],
  }));
}

export default function ScalesPage() {
  const [config, setConfig] = useState<ScaleExerciseConfig>(randomScaleExercise);
  const [selectedType, setSelectedType] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showSolution, setShowSolution] = useState(false);
  const [streak, setStreak] = useState(0);

  const scaleNotes = buildScale(config.tonic, config.scaleType);
  const vexNotes = scaleToVexNotes(config.tonic, config.scaleType);

  const handleCheck = useCallback(() => {
    if (selectedType === config.scaleType) {
      setFeedback("correct");
      setStreak((s) => s + 1);
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }
  }, [selectedType, config]);

  const handleNext = useCallback(() => {
    setConfig(randomScaleExercise());
    setSelectedType("");
    setFeedback("idle");
    setShowSolution(false);
  }, []);

  return (
    <PageShell title="6. Escalas">
      <div className="space-y-4">
        <Card>
          <p className="text-gray-600 text-sm">
            Observa la escala en el pentagrama e identifica su tipo (mayor, menor natural o menor armónica).
          </p>
          {streak > 1 && <Badge color="correct" className="mt-2">Racha: {streak} correctas</Badge>}
        </Card>

        {/* Staff showing the scale */}
        <Card title={`Escala de ${config.tonic}`}>
          <div className="overflow-x-auto">
            <VexFlowRenderer
              notes={vexNotes}
              keySignature={config.tonic}
              timeSignature=""
              width={600}
              height={140}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Tónica: {config.tonic}</p>
        </Card>

        {/* Answer */}
        <Card title="Tu respuesta">
          <Select
            label="Tipo de escala"
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setFeedback("idle"); }}
            options={[{ value: "", label: "Selecciona…" }, ...SCALE_TYPE_OPTIONS]}
          />
          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleCheck}
              disabled={!selectedType || feedback !== "idle"}
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
                <span className="text-green-700 font-medium">{config.label}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge color="incorrect">Incorrecto</Badge>
                <p className="text-red-700 text-sm">
                  La respuesta correcta es: <strong>{config.label}</strong>
                </p>
              </div>
            )}
          </Card>
        )}

        {showSolution && (
          <Card title="Solución">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-gray-500">Escala</dt>
              <dd className="font-medium">{config.label}</dd>
              <dt className="text-gray-500">Tipo</dt>
              <dd className="font-medium capitalize">
                {config.scaleType === "major" ? "Mayor" : config.scaleType === "natural_minor" ? "Menor natural" : "Menor armónica"}
              </dd>
              <dt className="text-gray-500">Notas</dt>
              <dd className="font-medium text-blue-700">
                {scaleNotes.map(noteToSpanish).join(" — ")}
              </dd>
            </dl>
            {config.scaleType === "harmonic_minor" && (
              <p className="text-xs text-gray-500 mt-2">
                La escala menor armónica sube el 7º grado medio tono (sensible).
              </p>
            )}
          </Card>
        )}
      </div>
    </PageShell>
  );
}
