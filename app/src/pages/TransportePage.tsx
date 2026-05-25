import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomTransposeExercise } from "../data/transposeExercises";
import type { TransposeExercise } from "../data/transposeExercises";
import type { TheorySection } from "../components/theory/types";

const TRANSPORTE_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué es transportar?", body: "Transportar una melodía es reproducirla a una altura diferente. Los intervalos entre las notas se mantienen exactamente iguales; lo que cambia es la nota de partida." },
      { title: "Los intervalos internos no cambian", body: "Si la melodía original sube una 3ª mayor entre las notas 1 y 2, la melodía transportada también debe subir una 3ª mayor entre esas mismas posiciones." },
      { title: "Tipos de transporte", body: "Tonal: se transporta a una nueva tonalidad, cambiando la armadura. Cromático: se sube o baja cada nota el mismo número de semitonos sin cambiar la armadura (menos frecuente en EA4)." },
      {
        title: "Proceso paso a paso",
        body: "1) Identifica el intervalo de transporte. 2) Aplica ese intervalo a cada nota de la melodía. 3) Ajusta las alteraciones para mantener la calidad exacta del intervalo. 4) Verifica el ritmo y el compás (no cambian).",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "q", annotations: ["Do"],  annotationColors: ["#4338ca"] },
            { keys: ["e/4"], duration: "q", annotations: ["Mi"],  annotationColors: ["#4338ca"] },
            { keys: ["g/4"], duration: "q", annotations: ["Sol"], annotationColors: ["#4338ca"] },
          ],
          timeSignature: "3/4",
          caption: "Original en Do mayor: Do–Mi–Sol",
        },
      },
      {
        title: "Ejemplo: 4ª justa ascendente",
        body: "Melodía original Do–Mi–Sol transportada una 4ª justa (5 semitonos) → Fa–La–Do. Cada nota sube 5 semitonos. La armadura cambia a Fa mayor (1 bemol).",
        highlight: true,
        staffExample: {
          notes: [
            { keys: ["f/4"], duration: "q", annotations: ["Fa"],  annotationColors: ["#dc2626"] },
            { keys: ["a/4"], duration: "q", annotations: ["La"],  annotationColors: ["#dc2626"] },
            { keys: ["c/5"], duration: "q", annotations: ["Do"],  annotationColors: ["#dc2626"] },
          ],
          timeSignature: "3/4",
          keySignature: "F",
          caption: "Transportado a Fa mayor (4ª justa ↑): Fa–La–Do",
        },
      },
    ],
    table: {
      headers: ["Intervalo de transporte", "Semitonos", "Ejemplo (desde Do)"],
      rows: [
        ["2ª mayor ascendente", "2", "Do → Re"],
        ["3ª menor ascendente", "3", "Do → Mib"],
        ["3ª mayor ascendente", "4", "Do → Mi"],
        ["4ª justa ascendente", "5", "Do → Fa"],
        ["5ª justa ascendente", "7", "Do → Sol"],
        ["2ª mayor descendente", "−2", "Do → Sib"],
      ],
    },
  },
];

export default function TransportePage() {
  const [exercise, setExercise] = useState<TransposeExercise>(randomTransposeExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const correctIndex = exercise.options.indexOf(exercise.correctAnswer);

  const handleNext = useCallback(() => {
    setExercise(randomTransposeExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="2. Transporte"
      bookPages="p.16–23 (Unitat 1)"
      theory={TRANSPORTE_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={`Nota original: ${exercise.sourceNote} — Transporta una ${exercise.intervalName}`}
        stimulus="Selecciona la nota resultante:"
        options={exercise.options}
        correctIndex={correctIndex}
        explanation={exercise.explanation}
        streak={streak}
        onAnswer={(correct) => setStreak((s) => correct ? s + 1 : 0)}
        onNext={handleNext}
      />
    </TheoryPracticeLayout>
  );
}
