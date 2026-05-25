import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomNotaAdornoExercise } from "../data/notasAdornoExercises";
import type { NotaAdornoExercise } from "../data/notasAdornoExercises";
import type { TheorySection } from "../components/theory/types";

const ADORNO_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué son las notas de adorno?", body: "Las notas de adorno (ornamentos) son pequeñas notas o símbolos que decoran la melodía. No tienen valor rítmico propio (o lo toman de la nota real). Se usan para embellecer y expresar la melodía." },
      { title: "Apoiatura", body: "Nota pequeña (corchea sin tachar) que precede a la nota real. Se coloca en parte fuerte y toma la mitad (o 2/3) del valor de la nota real. Produce tensión y resuelve por grado conjunto." },
      { title: "Acciaccatura (apoiatura breve)", body: "Nota pequeña tachada (corchea pequeña con una raya). Se interpreta muy brevemente, casi simultánea a la nota real. Es más rápida que la apoiatura." },
      { title: "Mordente", body: "Alternancia rápida (normalmente una vez) entre la nota real y la nota superior (mordente superior) o inferior (mordente inferior). El símbolo es una pequeña onda sobre la nota." },
      { title: "Grupeto (~)", body: "Figura de 4 notas: nota superior, nota real, nota inferior, nota real. El símbolo es una onda horizontal (~). Decora la nota principal con una pequeña vuelta alrededor.", highlight: true },
      { title: "Trino (tr~)", body: "Alternancia muy rápida y continua entre la nota real y la nota superior durante toda la duración de la nota. El símbolo es 'tr' o 'tr~' escrito sobre la nota." },
      { title: "Arpejo", body: "Las notas de un acorde se tocan sucesivamente de abajo a arriba en lugar de simultáneamente. El símbolo es una línea ondulada vertical al lado del acorde." },
    ],
    table: {
      headers: ["Adorno", "Símbolo", "Descripción breve"],
      rows: [
        ["Apoiatura", "Corchea pequeña", "Nota previa, toma valor de la real"],
        ["Acciaccatura", "Corchea pequeña tachada", "Nota muy breve, casi simultánea"],
        ["Mordente", "Onda pequeña", "Alternancia rápida con nota adyacente"],
        ["Grupeto", "~ (onda horizontal)", "4 notas: sup., real, inf., real"],
        ["Trino", "tr~", "Alternancia continua con nota superior"],
        ["Arpejo", "Onda vertical", "Acorde tocado nota por nota"],
      ],
    },
  },
];

export default function NotasAdornoPage() {
  const [exercise, setExercise] = useState<NotaAdornoExercise>(randomNotaAdornoExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomNotaAdornoExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="Notas de adorno"
      bookPages="p.88–95 (Unitat 10)"
      theory={ADORNO_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={exercise.question}
        stimulus={exercise.stimulus || undefined}
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
