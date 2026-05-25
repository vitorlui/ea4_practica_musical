import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomNotaExtraniaExercise } from "../data/notasExtranyasExercises";
import type { NotaExtraniaExercise } from "../data/notasExtranyasExercises";
import type { TheorySection } from "../components/theory/types";

const NOTAS_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué son notas extrañas?", body: "Son notas que no pertenecen al acorde activo en ese momento de la melodía. Su función es embellecer y dar movimiento. En EA4 se trabajan: nota de paso (NP), bordadura (B) y apoyatura (A)." },
      {
        title: "Nota de paso (NP)",
        body: "Une dos notas del acorde por movimiento de grado conjunto. Siempre en parte débil. Va de una nota estructural a otra diferente. Ejemplo: Do-Re-Mi, donde Re es NP entre Do y Mi del acorde.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "q", bottomAnnotations: ["A"],  bottomAnnotationColors: ["#2563eb"] },
            { keys: ["d/4"], duration: "q", bottomAnnotations: ["NP"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["e/4"], duration: "q", bottomAnnotations: ["A"],  bottomAnnotationColors: ["#2563eb"] },
          ],
          timeSignature: "3/4",
          caption: "Do–Re–Mi: Re es nota de paso (NP) entre Do y Mi del acorde",
        },
      },
      {
        title: "Bordadura (B)",
        body: "Sale de una nota del acorde, sube o baja un grado, y vuelve a la misma nota. La 1ª y 3ª nota son iguales. Siempre en parte débil. Ejemplo: Mi-Fa-Mi, donde Fa es bordadura superior.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "q", bottomAnnotations: ["A"], bottomAnnotationColors: ["#2563eb"] },
            { keys: ["d/4"], duration: "q", bottomAnnotations: ["B"], bottomAnnotationColors: ["#d97706"] },
            { keys: ["c/4"], duration: "q", bottomAnnotations: ["A"], bottomAnnotationColors: ["#2563eb"] },
          ],
          timeSignature: "3/4",
          caption: "Do–Re–Do: Re es bordadura (B) de Do (superior)",
        },
      },
      {
        title: "Apoyatura (A)",
        body: "Aparece en parte fuerte o acentuada. No pertenece al acorde. Resuelve por grado conjunto hacia una nota real del acorde. Genera tensión que se resuelve inmediatamente.",
        staffExample: {
          notes: [
            { keys: ["d/4"], duration: "q", bottomAnnotations: ["A↓"], bottomAnnotationColors: ["#7c3aed"] },
            { keys: ["c/4"], duration: "h", bottomAnnotations: ["Ac."],  bottomAnnotationColors: ["#2563eb"] },
          ],
          timeSignature: "3/4",
          caption: "Re (apoyatura, tiempo fuerte) → Do (nota del acorde)",
        },
      },
      { title: "Método de identificación", body: "1) Ubica las notas del acorde activo. 2) Señala las notas que NO están en el acorde. 3) Analiza su posición (fuerte/débil) y su movimiento (grado conjunto). 4) Aplica la definición de NP, B o A según corresponda.", highlight: true },
    ],
    table: {
      headers: ["", "NP", "Bordadura (B)", "Apoyatura (A)"],
      rows: [
        ["Posición en el compás", "Parte débil", "Parte débil", "Parte fuerte o acentuada"],
        ["Notas que la rodean", "Dos notas diferentes", "Misma nota antes y después", "Nota del acorde después"],
        ["Movimiento", "Grado conjunto (une dos notas)", "Grado conjunto (ida y vuelta)", "Grado conjunto (hacia nota real)"],
        ["Tensión", "Baja", "Baja", "Alta"],
      ],
    },
  },
];

export default function NotasExtranyasPage() {
  const [exercise, setExercise] = useState<NotaExtraniaExercise>(randomNotaExtraniaExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomNotaExtraniaExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="8. Notas extrañas"
      bookPages="p.48–55 (Unitat 5)"
      theory={NOTAS_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={`¿Qué tipo de nota extraña es ${exercise.markedNote}?`}
        stimulus={exercise.context}
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
