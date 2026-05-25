import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomAcordeExercise } from "../data/acordesExercises";
import type { AcordeExercise } from "../data/acordesExercises";
import type { TheorySection } from "../components/theory/types";

const ACORDES_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué es un acorde?", body: "Un acorde es un conjunto de tres o más notas que suenan simultáneamente. Las notas se ordenan por terceras superpuestas. Un acorde de tres notas se llama tríada." },
      { title: "La tríada: fundamental, 3ª y 5ª", body: "Cada nota del acorde recibe un nombre: la nota inferior es la fundamental, la siguiente es la 3ª (a distancia de tercera) y la superior es la 5ª (a distancia de quinta desde la fundamental)." },
      {
        title: "Acorde perfecto mayor",
        body: "3ª mayor (4 semitonos) desde la fundamental + 3ª menor (3 semitonos) desde la 3ª. Entre fundamental y 5ª hay una 5ª justa (7 semitonos). Ejemplo: Do-Mi-Sol (Do mayor).",
        staffExample: {
          notes: [{ keys: ["c/4", "e/4", "g/4"], duration: "w" }],
          timeSignature: "",
          caption: "Do mayor: Do–Mi–Sol (4st + 3st = 5ª justa)",
        },
      },
      {
        title: "Acorde perfecto menor",
        body: "3ª menor (3 semitonos) desde la fundamental + 3ª mayor (4 semitonos) desde la 3ª. Entre fundamental y 5ª hay también una 5ª justa. Ejemplo: La-Do-Mi (La menor).",
        staffExample: {
          notes: [{ keys: ["a/3", "c/4", "e/4"], duration: "w" }],
          timeSignature: "",
          caption: "La menor: La–Do–Mi (3st + 4st = 5ª justa)",
        },
      },
      {
        title: "Cómo identificar mayor o menor",
        body: "Cuenta semitonos de la fundamental a la 3ª. 4 semitonos → perfecto mayor ('alegre'). 3 semitonos → perfecto menor ('oscuro'). La 5ª siempre es justa en ambos.",
        highlight: true,
        staffExample: {
          notes: [
            { keys: ["g/4", "b/4", "d/5"], duration: "w", annotations: ["Mayor"], annotationColors: ["#4338ca"] },
          ],
          timeSignature: "",
          caption: "Sol mayor: Sol–Si–Re (4st + 3st)",
        },
      },
    ],
    table: {
      headers: ["", "Acorde perfecto mayor", "Acorde perfecto menor"],
      rows: [
        ["Fund. → 3ª", "3ª mayor (4 semitonos)", "3ª menor (3 semitonos)"],
        ["3ª → 5ª", "3ª menor (3 semitonos)", "3ª mayor (4 semitonos)"],
        ["Fund. → 5ª", "5ª justa (7 semitonos)", "5ª justa (7 semitonos)"],
        ["Ejemplo", "Do-Mi-Sol", "La-Do-Mi"],
        ["Carácter", "Luminoso, alegre", "Oscuro, melancólico"],
      ],
    },
  },
];

export default function AcordesPage() {
  const [exercise, setExercise] = useState<AcordeExercise>(randomAcordeExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomAcordeExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="Acordes perfectos"
      bookPages="p.80–87 (Unitat 9)"
      theory={ACORDES_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={exercise.question}
        stimulus={exercise.staffNotes ? undefined : exercise.stimulus}
        staffNotes={exercise.staffNotes}
        options={exercise.options}
        correctIndex={exercise.correctIndex}
        explanation={exercise.explanation}
        streak={streak}
        onAnswer={(correct) => setStreak((s) => correct ? s + 1 : 0)}
        onNext={handleNext}
      />
    </TheoryPracticeLayout>
  );
}
