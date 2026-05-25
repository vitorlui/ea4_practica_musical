import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomCompletarCompasExercise } from "../data/completarCompasExercises";
import type { CompletarCompasExercise } from "../data/completarCompasExercises";
import type { TheorySection } from "../components/theory/types";

const COMPLETAR_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      {
        title: "Valores de las figuras (en negras)",
        body: "Redonda = 4, blanca = 2, negra = 1, corchea = 0.5, semicorchea = 0.25. El puntillo añade la mitad del valor de la figura: negra con puntillo = 1.5, blanca con puntillo = 3.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "q", annotations: ["1"],   annotationColors: ["#4338ca"] },
            { keys: ["c/4"], duration: "8", annotations: ["½"],   annotationColors: ["#6366f1"] },
            { keys: ["c/4"], duration: "8r", isRest: true, annotations: ["½"], annotationColors: ["#dc2626"] },
          ],
          timeSignature: "2/4",
          caption: "Compás 2/4: negra (1) + corchea (½) + silencio corchea (½) = 2 tiempos",
        },
      },
      {
        title: "Proceso para completar",
        body: "1) Lee el compás (numerador = total de tiempos, denominador = figura de referencia). 2) Convierte todas las figuras existentes a la misma unidad. 3) Suma los valores. 4) Calcula lo que falta. 5) Escribe la figura o silencio equivalente.",
        staffExample: {
          notes: [
            { keys: ["e/4"], duration: "q", annotations: ["1"],   annotationColors: ["#4338ca"] },
            { keys: ["f/4"], duration: "q", annotations: ["1"],   annotationColors: ["#4338ca"] },
            { keys: ["g/4"], duration: "q", isRest: false },
            { keys: ["a/4"], duration: "q", isRest: false },
          ],
          timeSignature: "4/4",
          caption: "Compás 4/4 completo: 4 negras = 4 tiempos",
        },
      },
      { title: "Reglas de agrupación", body: "En compases simples no puedes usar una sola figura que cruce el tiempo fuerte central (en 4/4, el tiempo 3 es semifuerte). Ejemplo: en 4/4, no puedes poner una blanca en el tiempo 2 que llegue al 4 cruzando el 3." },
      { title: "En compases compuestos (6/8, 9/8, 12/8)", body: "La unidad de tiempo es la negra con puntillo. En 6/8 el total son 6 corcheas (o 2 negras con puntillo). Convierte a corcheas para calcular.", highlight: true },
    ],
    table: {
      headers: ["Figura", "Valor (en negras)", "Valor (en corcheas)"],
      rows: [
        ["Redonda", "4", "8"],
        ["Blanca con puntillo", "3", "6"],
        ["Blanca", "2", "4"],
        ["Negra con puntillo", "1.5", "3"],
        ["Negra", "1", "2"],
        ["Corchea con puntillo", "0.75", "1.5"],
        ["Corchea", "0.5", "1"],
        ["Semicorchea", "0.25", "0.5"],
      ],
    },
  },
];

export default function CompletarCompasPage() {
  const [exercise, setExercise] = useState<CompletarCompasExercise>(randomCompletarCompasExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomCompletarCompasExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="5. Completar compás"
      bookPages="p.16–23 (Unitat 1)"
      theory={COMPLETAR_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={`Compás: ${exercise.meter} — ${exercise.totalBeatsDescription}`}
        stimulus={`Notas ya escritas: ${exercise.existingNotes}. ¿Qué figura completa el compás?`}
        options={exercise.options}
        correctIndex={exercise.options.indexOf(exercise.correctAnswer)}
        explanation={exercise.explanation}
        streak={streak}
        onAnswer={(correct) => setStreak((s) => correct ? s + 1 : 0)}
        onNext={handleNext}
      />
    </TheoryPracticeLayout>
  );
}
