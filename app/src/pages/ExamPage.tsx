import { useState, useCallback, useRef } from "react";
import { PageShell } from "../components/layout";
import { Card, Button } from "../components/ui";
import { VexFlowRenderer } from "../components/music/VexFlowRenderer";
import { generateExam } from "../exam/ExamGenerator";
import type { ExamData, ExamExercise, ExamConfig } from "../theory/types";

function ExamHeader({ config }: { config: ExamConfig }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6 print-page">
      <div className="text-center mb-2">
        <h1 className="text-lg font-bold">EXAMEN DE LENGUAJE MUSICAL EA4</h1>
        <p className="text-sm text-gray-600">El Sindicato EA4</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
        <div><span className="font-medium">Curso:</span> {config.course || "____________________"}</div>
        <div><span className="font-medium">Data:</span> {config.date || "____________________"}</div>
        <div className="col-span-2"><span className="font-medium">Nom:</span> {config.studentName || "____________________"}</div>
      </div>
    </div>
  );
}

function ExerciseBlock({ exercise, showSolution }: { exercise: ExamExercise; showSolution: boolean }) {
  const data = exercise.data as Record<string, unknown>;
  const solution = exercise.solution as Record<string, unknown>;

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-4">
      <h2 className="text-base font-bold mb-1">
        Ejercicio {exercise.number}: {exercise.title}
      </h2>
      <p className="text-sm text-gray-600 mb-3 italic">{exercise.instructions}</p>

      {/* Specific exercise rendering */}
      {exercise.type === "sincopa" && Boolean(data.exercise) && (
        <div className="mb-3">
          <VexFlowRenderer
            notes={(data.exercise as { notes: { keys: string[]; duration: string; isRest?: boolean }[] }).notes}
            timeSignature={(data.exercise as { timeSignature: string }).timeSignature}
            keySignature={(data.exercise as { keySignature: string }).keySignature}
            width={500}
            height={130}
          />
        </div>
      )}

      {exercise.type === "intervalos" && Boolean(data.exercise) && (
        <div className="mb-3">
          <VexFlowRenderer
            notes={[{
              keys: [
                `${(data.exercise as { lower: { name: string; accidental: string; octave: number } }).lower.name.toLowerCase()}${(data.exercise as { lower: { name: string; accidental: string; octave: number } }).lower.accidental}/${(data.exercise as { lower: { name: string; accidental: string; octave: number } }).lower.octave}`,
                `${(data.exercise as { upper: { name: string; accidental: string; octave: number } }).upper.name.toLowerCase()}${(data.exercise as { upper: { name: string; accidental: string; octave: number } }).upper.accidental}/${(data.exercise as { upper: { name: string; accidental: string; octave: number } }).upper.octave}`,
              ],
              duration: "h",
              accidentals: [
                (data.exercise as { lower: { accidental: string } }).lower.accidental || null,
                (data.exercise as { upper: { accidental: string } }).upper.accidental || null,
              ],
            }]}
            timeSignature=""
            keySignature="C"
            width={260}
            height={160}
          />
          {!showSolution && <div className="h-8 border-b border-gray-400 mt-2 w-48 mx-auto" />}
        </div>
      )}

      {exercise.type === "escalas" && (
        <div className="mb-3">
          <p className="text-sm text-gray-500">
            Escala: {(data as { config: { label: string } }).config?.label}
          </p>
          {/* Empty staff for student to write */}
          <div className="my-2 border border-gray-200 rounded p-2 bg-gray-50 h-24 flex items-center justify-center text-gray-300 text-sm">
            [Pentagrama para escribir]
          </div>
        </div>
      )}

      {exercise.type === "armadura" && Boolean(data.exercise) && (
        <div className="mb-3">
          <VexFlowRenderer
            notes={[{ keys: ["b/4"], duration: "wr", isRest: true }]}
            keySignature={(data.exercise as { tonic: string }).tonic}
            timeSignature=""
            width={260}
            height={120}
          />
        </div>
      )}

      {/* Answer space (hidden when solution shown) */}
      {!showSolution && exercise.type !== "escalas" && (
        <div className="mt-2 h-10 border-b border-gray-300 w-64" />
      )}

      {/* Solution block */}
      {showSolution && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
          <span className="font-semibold text-blue-700">Solución: </span>
          {exercise.type === "sincopa" && (
            <span>{(solution.beatTypes as string[]).join(" — ")}</span>
          )}
          {exercise.type === "intervalos" && (
            <span>{solution.label as string}</span>
          )}
          {exercise.type === "escalas" && (
            <span>{(solution.notes as string[])?.join(" — ")}</span>
          )}
          {exercise.type === "armadura" && (
            <span>
              {solution.label as string} — Relativa: {solution.relative as string}
            </span>
          )}
          {["transporte", "compas_tonalidad", "completar_compas", "notas_extranyas"].includes(exercise.type) && (
            <span className="text-gray-400 italic">Ver teoría</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExamPage() {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [course, setCourse] = useState("4t curs — 2025/26");
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    const config: ExamConfig = {
      exerciseCounts: {},
      title: "Examen Lenguaje Musical EA4",
      course,
      date: new Date().toLocaleDateString("ca-ES"),
      studentName: "",
    };
    setExamData(generateExam(config));
    setShowSolution(false);
  }, [course]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <PageShell title="Examen Aleatorio">
      <div className="space-y-4">
        {/* Config card */}
        <Card title="Configuración" className="no-print">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">Curso</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <Button onClick={handleGenerate} variant="primary" size="lg">
              Generar examen
            </Button>
          </div>
        </Card>

        {examData && (
          <>
            {/* Action buttons */}
            <div className="flex gap-3 no-print">
              <Button onClick={handlePrint} variant="secondary">
                Imprimir / Guardar PDF
              </Button>
              <Button
                onClick={() => setShowSolution((s) => !s)}
                variant={showSolution ? "danger" : "ghost"}
              >
                {showSolution ? "Ocultar soluciones" : "Mostrar soluciones"}
              </Button>
              <Button onClick={handleGenerate} variant="ghost">
                Nuevo examen
              </Button>
            </div>

            {/* Printable exam */}
            <div ref={printRef} className="bg-white rounded-xl border border-gray-200 p-6">
              <ExamHeader config={examData.config} />
              {examData.exercises.map((ex) => (
                <ExerciseBlock key={ex.number} exercise={ex} showSolution={showSolution} />
              ))}
            </div>
          </>
        )}

        {!examData && (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-3">📄</p>
              <p>Pulsa "Generar examen" para crear un examen con los 8 bloques aleatorios.</p>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
