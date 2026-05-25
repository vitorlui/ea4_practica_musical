import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { Card, Button, Badge, Select } from "../components/ui";
import type { TheorySection } from "../components/theory/types";

const ESCALAS_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      {
        title: "Escala mayor",
        body: "Patrón: T-T-ST-T-T-T-ST (T = tono = 2 semitonos, ST = semitono = 1 semitono). Ejemplo Do mayor: Do Re Mi Fa Sol La Si Do. Primer tetracordo: Do-Re-Mi-Fa. Segundo tetracordo: Sol-La-Si-Do.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["d/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["e/4"], duration: "q", bottomAnnotations: ["ST"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["f/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["g/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["a/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["b/4"], duration: "q", bottomAnnotations: ["ST"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["c/5"], duration: "q" },
          ],
          timeSignature: "", width: 520, height: 155,
          caption: "Do mayor: T-T-ST-T-T-T-ST (ST = semitono en rojo)",
        },
      },
      {
        title: "Escala menor natural",
        body: "Patrón: T-ST-T-T-ST-T-T. Ejemplo La menor: La Si Do Re Mi Fa Sol La. Es la relativa menor de Do mayor (misma armadura).",
        staffExample: {
          notes: [
            { keys: ["a/3"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["b/3"], duration: "q", bottomAnnotations: ["ST"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["c/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["d/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["e/4"], duration: "q", bottomAnnotations: ["ST"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["f/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["g/4"], duration: "q", bottomAnnotations: ["T"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["a/4"], duration: "q" },
          ],
          timeSignature: "", width: 520, height: 155,
          caption: "La menor natural: T-ST-T-T-ST-T-T",
        },
      },
      {
        title: "Escala menor armónica",
        body: "Igual que la menor natural pero el VII grado sube medio tono (sensible). Ejemplo La menor armónica: La Si Do Re Mi Fa Sol# La. El intervalo entre VI y VII es de tono y medio (T+ST).",
        staffExample: {
          notes: [
            { keys: ["a/3"], duration: "q" },
            { keys: ["b/3"], duration: "q" },
            { keys: ["c/4"], duration: "q" },
            { keys: ["d/4"], duration: "q" },
            { keys: ["e/4"], duration: "q" },
            { keys: ["f/4"], duration: "q" },
            { keys: ["g/4"], duration: "q", accidentals: ["#"], annotations: ["↑VII"], annotationColors: ["#dc2626"] },
            { keys: ["a/4"], duration: "q" },
          ],
          timeSignature: "", width: 520, height: 155,
          caption: "La menor armónica: VII grado subido Sol→Sol# (sensible, ↑)",
        },
      },
      {
        title: "Escala menor melódica",
        body: "Ascendente: VI y VII suben medio tono. Descendente: igual que la menor natural. Ejemplo La menor melódica asc.: La Si Do Re Mi Fa# Sol# La.",
        staffExample: {
          notes: [
            { keys: ["a/3"], duration: "q" },
            { keys: ["b/3"], duration: "q" },
            { keys: ["c/4"], duration: "q" },
            { keys: ["d/4"], duration: "q" },
            { keys: ["e/4"], duration: "q" },
            { keys: ["f/4"], duration: "q", accidentals: ["#"], annotations: ["↑VI"], annotationColors: ["#d97706"] },
            { keys: ["g/4"], duration: "q", accidentals: ["#"], annotations: ["↑VII"], annotationColors: ["#dc2626"] },
            { keys: ["a/4"], duration: "q" },
          ],
          timeSignature: "", width: 520, height: 155,
          caption: "La menor melódica (asc.): VI y VII subidos (Fa#, Sol#)",
        },
      },
      { title: "Tetracordos", body: "Un tetracordo es un grupo de 4 notas consecutivas. Cada escala tiene dos tetracordos: 1.º = grados I-II-III-IV, 2.º = grados V-VI-VII-VIII. El libro pide señalarlos en el examen." },
    ],
    table: {
      headers: ["Escala", "Patrón", "VII grado"],
      rows: [
        ["Mayor", "T-T-ST-T-T-T-ST", "Subtónica (T de la tónica)"],
        ["Menor natural", "T-ST-T-T-ST-T-T", "Subtónica (T de la tónica)"],
        ["Menor armónica", "T-ST-T-T-ST-T+ST-ST", "Sensible (ST de la tónica, subido)"],
        ["Menor melódica (asc.)", "T-ST-T-T-T-T-ST", "Sensible (ST de la tónica, subido)"],
      ],
    },
  },
];
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
    <TheoryPracticeLayout
      title="6. Escalas"
      bookPages="p.56–71 (Unitats 6–7)"
      theory={ESCALAS_THEORY}
    >
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
    </TheoryPracticeLayout>
  );
}
