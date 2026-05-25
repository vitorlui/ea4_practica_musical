import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomGradoExercise } from "../data/gradosTonalesExercises";
import type { GradoExercise } from "../data/gradosTonalesExercises";
import type { TheorySection } from "../components/theory/types";

const GRADOS_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué son los grados de la escala?", body: "Los siete grados de una escala reciben nombres según su función armónica. Se numeran con cifras romanas del I al VII a partir de la tónica." },
      { title: "I — Tónica", body: "Nota que da nombre a la tonalidad. Es el punto de mayor reposo y estabilidad. También se llama VIII cuando aparece en la octava superior." },
      { title: "II — Supertónica", body: "Está un grado por encima de la tónica. Función secundaria; suele ir hacia la dominante o la subdominante." },
      { title: "III — Mediante", body: "Está a medio camino entre la tónica (I) y la dominante (V). Define si la tonalidad es mayor o menor (la 3ª mayor = modo mayor; la 3ª menor = modo menor)." },
      { title: "IV — Subdominante", body: "Está un grado por debajo de la dominante. Su función es 'preparar' la dominante. Junto con I y V forma la base armónica de la música tonal." },
      { title: "V — Dominante", body: "Segundo grado más importante. Crea tensión armónica que quiere resolver a la tónica. La cadencia V→I es la más básica de la armonía tonal." },
      { title: "VI — Superdominante; VII — Sensible/Subtónica", body: "VI (superdominante): un grado por encima de la dominante. VII: si está a un semitono de la tónica = sensible (escala mayor, menor armónica); si está a un tono = subtónica (escala menor natural).", highlight: true },
    ],
    table: {
      headers: ["Grado", "Nombre", "En Do Mayor", "Función"],
      rows: [
        ["I (y VIII)", "Tónica", "Do", "Máximo reposo, centro tonal"],
        ["II", "Supertónica", "Re", "Función de paso"],
        ["III", "Mediante", "Mi", "Define mayor/menor"],
        ["IV", "Subdominante", "Fa", "Prepara la dominante"],
        ["V", "Dominante", "Sol", "Tensión → resolución en I"],
        ["VI", "Superdominante", "La", "Color armónico"],
        ["VII", "Sensible / Subtónica", "Si", "Sensible = ST de I (sube); Subtónica = T de I"],
      ],
    },
  },
];

export default function GradosTonalesPage() {
  const [exercise, setExercise] = useState<GradoExercise>(randomGradoExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomGradoExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="Grados tonales"
      bookPages="p.64–71 (Unitat 7)"
      theory={GRADOS_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={exercise.question}
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
