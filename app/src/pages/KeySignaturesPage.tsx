import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { Card, Button, Badge, Select } from "../components/ui";
import type { TheorySection } from "../components/theory/types";

const ARMADURA_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      {
        title: "Orden de los sostenidos",
        body: "Fa - Do - Sol - Re - La - Mi - Si. La tónica mayor está una 2ª menor (1 semitono) por encima del último sostenido. Ejemplo: 2 sostenidos (Fa#, Do#) → último = Do#, tónica = Re → Re Mayor.",
        staffExample: {
          notes: [{ keys: ["b/4"], duration: "wr", isRest: true }],
          keySignature: "D",
          timeSignature: "",
          caption: "Re Mayor (2#: Fa# y Do#): tónica = un semitono sobre el último # (Do#→Re)",
        },
      },
      {
        title: "Orden de los bemoles",
        body: "Si - Mi - La - Re - Sol - Do - Fa. La tónica mayor es el penúltimo bemol. Ejemplo: 3 bemoles (Sib, Mib, Lab) → penúltimo = Mib → Mib Mayor. Excepción: 1 bemol (Sib) = Fa Mayor (memorizar).",
        staffExample: {
          notes: [{ keys: ["b/4"], duration: "wr", isRest: true }],
          keySignature: "Eb",
          timeSignature: "",
          caption: "Mib Mayor (3b: Sib, Mib, Lab): tónica = penúltimo bemol = Mib",
        },
      },
      {
        title: "Tonalidades relativas",
        body: "Cada armadura pertenece a dos tonalidades: una mayor y su relativa menor. La relativa menor está una 3ª menor (1T+1ST) por debajo de la mayor. Ej: Sol Mayor → Mi menor.",
        staffExample: {
          notes: [{ keys: ["b/4"], duration: "wr", isRest: true }],
          keySignature: "G",
          timeSignature: "",
          caption: "Sol Mayor / Mi menor: misma armadura (1#: Fa#). Relativa menor 3ª↓",
        },
      },
      {
        title: "Tonalidades enarmónicas",
        body: "Fa# Mayor (6#) = Solb Mayor (6b). Do# Mayor (7#) = Reb Mayor (5b). Estas tonalidades suenan igual pero se escriben de forma distinta.",
        staffExample: {
          notes: [{ keys: ["b/4"], duration: "wr", isRest: true }],
          keySignature: "F#",
          timeSignature: "",
          caption: "Fa# Mayor (6#) = Solb Mayor (6b): misma tonalidad, diferente escritura",
        },
      },
      {
        title: "Do Mayor y La menor",
        body: "Sin alteraciones en la armadura. Do Mayor y La menor son la pareja relativa sin accidentales.",
        highlight: true,
        staffExample: {
          notes: [{ keys: ["b/4"], duration: "wr", isRest: true }],
          keySignature: "C",
          timeSignature: "",
          caption: "Do Mayor / La menor: sin alteraciones (armadura vacía)",
        },
      },
    ],
    table: {
      headers: ["Alteraciones", "Mayor", "Relativa menor"],
      rows: [
        ["0", "Do Mayor", "La menor"],
        ["1# (Fa#)", "Sol Mayor", "Mi menor"],
        ["2# (Fa#,Do#)", "Re Mayor", "Si menor"],
        ["3# (+Sol#)", "La Mayor", "Fa# menor"],
        ["1b (Sib)", "Fa Mayor", "Re menor"],
        ["2b (+Mib)", "Sib Mayor", "Sol menor"],
        ["3b (+Lab)", "Mib Mayor", "Do menor"],
        ["4b (+Reb)", "Lab Mayor", "Fa menor"],
      ],
    },
  },
];
import { VexFlowRenderer } from "../components/music/VexFlowRenderer";
import { getKeySignature, getRelativeKey, ALL_MAJOR_KEYS, ALL_MINOR_KEYS } from "../theory/keys";
import { randomKeySignatureExercise } from "../data/keySignatureExercises";
import type { KeyMode } from "../theory/types";

type FeedbackState = "idle" | "correct" | "incorrect";

interface Question {
  tonic: string;
  mode: KeyMode;
  vexKey: string;
}

function tonicToVexKey(tonic: string): string {
  // VexFlow key names: "C", "G", "D", "A", "E", "B", "F#", "Bb", "Eb", "Ab", "Db", "F"
  return tonic;
}

function generateQuestion(): Question {
  const exercise = randomKeySignatureExercise();
  return {
    tonic: exercise.tonic,
    mode: exercise.mode,
    vexKey: tonicToVexKey(exercise.tonic),
  };
}

export default function KeySignaturesPage() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selectedTonic, setSelectedTonic] = useState("");
  const [selectedMode, setSelectedMode] = useState<KeyMode>("major");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showSolution, setShowSolution] = useState(false);
  const [streak, setStreak] = useState(0);

  const ks = getKeySignature(question.tonic, question.mode);
  const relative = getRelativeKey(question.tonic, question.mode);

  const handleCheck = useCallback(() => {
    const correct =
      selectedTonic === question.tonic && selectedMode === question.mode;
    if (correct) {
      setFeedback("correct");
      setStreak((s) => s + 1);
    } else {
      setFeedback("incorrect");
      setStreak(0);
    }
  }, [selectedTonic, selectedMode, question]);

  const handleNext = useCallback(() => {
    setQuestion(generateQuestion());
    setSelectedTonic("");
    setSelectedMode("major");
    setFeedback("idle");
    setShowSolution(false);
  }, []);

  return (
    <TheoryPracticeLayout
      title="7. Armadura"
      bookPages="p.32–47 (Unitats 3–4)"
      theory={ARMADURA_THEORY}
    >
      <div className="space-y-4">
        {/* Instructions */}
        <Card>
          <p className="text-gray-600 text-sm">
            Observa la armadura en el pentagrama y escribe a qué tonalidad corresponde (tónica + modo).
          </p>
          {streak > 1 && (
            <Badge color="correct" className="mt-2">
              Racha: {streak} correctas
            </Badge>
          )}
        </Card>

        {/* Staff */}
        <Card title="Armadura">
          <VexFlowRenderer
            notes={[{ keys: ["b/4"], duration: "wr", isRest: true }]}
            keySignature={question.vexKey}
            timeSignature=""
            width={340}
            height={130}
          />
          <p className="text-xs text-gray-400 mt-2">
            {ks.numAccidentals === 0
              ? "Sin alteraciones"
              : `${ks.numAccidentals} ${ks.accidentalType === "sharp" ? "sostenido(s)" : "bemol(es)"}`}
          </p>
        </Card>

        {/* Answer form */}
        <Card title="Tu respuesta">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              label="Tónica"
              value={selectedTonic}
              onChange={(e) => {
                setSelectedTonic(e.target.value);
                setFeedback("idle");
              }}
              options={[
                { value: "", label: "Selecciona…" },
                ...ALL_MAJOR_KEYS.map((k) => ({ value: k, label: k })),
                ...ALL_MINOR_KEYS.filter((k) => !ALL_MAJOR_KEYS.includes(k)).map((k) => ({ value: k, label: k })),
              ]}
            />
            <Select
              label="Modo"
              value={selectedMode}
              onChange={(e) => {
                setSelectedMode(e.target.value as KeyMode);
                setFeedback("idle");
              }}
              options={[
                { value: "major", label: "Mayor" },
                { value: "minor", label: "Menor" },
              ]}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleCheck}
              disabled={!selectedTonic || feedback !== "idle"}
              variant="primary"
            >
              Comprobar
            </Button>
            <Button onClick={handleNext} variant="secondary">
              Siguiente
            </Button>
            <Button
              onClick={() => setShowSolution(true)}
              variant="ghost"
              disabled={showSolution}
            >
              Ver solución
            </Button>
          </div>
        </Card>

        {/* Feedback */}
        {feedback !== "idle" && (
          <Card>
            {feedback === "correct" ? (
              <div className="flex items-center gap-2">
                <Badge color="correct">Correcto</Badge>
                <span className="text-green-700 font-medium">
                  {question.tonic} {question.mode === "major" ? "mayor" : "menor"} — {ks.numAccidentals} {ks.accidentalType === "sharp" ? "sostenido(s)" : ks.accidentalType === "flat" ? "bemol(es)" : "sin alteraciones"}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <Badge color="incorrect">Incorrecto</Badge>
                <p className="text-red-700 text-sm">
                  La respuesta correcta es:{" "}
                  <strong>
                    {question.tonic} {question.mode === "major" ? "mayor" : "menor"}
                  </strong>
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Solution */}
        {showSolution && (
          <Card title="Solución">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-gray-500">Tonalidad</dt>
              <dd className="font-medium">{question.tonic} {question.mode === "major" ? "mayor" : "menor"}</dd>
              <dt className="text-gray-500">Alteraciones</dt>
              <dd className="font-medium">
                {ks.numAccidentals === 0
                  ? "Ninguna (Do mayor / La menor)"
                  : `${ks.numAccidentals} ${ks.accidentalType === "sharp" ? "sostenido(s)" : "bemol(es)"}: ${ks.accidentals.join(", ")}`}
              </dd>
              <dt className="text-gray-500">Relativa</dt>
              <dd className="font-medium">
                {relative.tonic} {relative.mode === "major" ? "mayor" : "menor"}
              </dd>
            </dl>
          </Card>
        )}
      </div>
    </TheoryPracticeLayout>
  );
}
