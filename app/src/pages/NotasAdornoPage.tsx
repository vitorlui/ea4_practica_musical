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
      {
        title: "Apoiatura",
        body: "Nota pequeña (corchea sin tachar) que precede a la nota real. Se coloca en parte fuerte y toma la mitad (o 2/3) del valor de la nota real. Produce tensión y resuelve por grado conjunto.",
        staffExample: {
          notes: [
            { keys: ["d/4"], duration: "8", annotations: ["apo."], annotationColors: ["#6366f1"] },
            { keys: ["c/4"], duration: "q" },
          ],
          timeSignature: "",
          caption: "Apoiatura: nota pequeña Re → nota real Do",
        },
      },
      {
        title: "Acciaccatura (apoiatura breve)",
        body: "Nota pequeña tachada (corchea pequeña con una raya diagonal). Se interpreta muy brevemente, casi simultánea a la nota real. Es más rápida que la apoiatura y se escribe con una raya que la tacha.",
        staffExample: {
          notes: [
            { keys: ["d/4"], duration: "8", annotations: ["♪/"], annotationColors: ["#6366f1"] },
            { keys: ["c/4"], duration: "q" },
            { keys: ["d/4"], duration: "8", annotations: ["♪/"], annotationColors: ["#6366f1"] },
            { keys: ["e/4"], duration: "q" },
          ],
          timeSignature: "",
          caption: "Acciaccatura (♪/): nota breve tachada antes de la nota real (Do, Mi)",
        },
      },
      {
        title: "Mordente",
        body: "Alternancia rápida (normalmente una vez) entre la nota real y la nota superior (mordente superior) o inferior (mordente inferior). El símbolo es una pequeña onda sobre la nota.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "h", ornament: "mordent" },
            { keys: ["c/4"], duration: "h", ornament: "mordentInverted" },
          ],
          timeSignature: "",
          caption: "Mordente superior (Do→Re→Do) y mordente inferior (Do→Si→Do)",
        },
      },
      {
        title: "Grupeto (~)",
        body: "Figura de 4 notas: nota superior, nota real, nota inferior, nota real. El símbolo es una onda horizontal (~). Decora la nota principal con una pequeña vuelta alrededor.",
        highlight: true,
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "h", ornament: "turn" },
            { keys: ["c/4"], duration: "h", ornament: "turnInverted" },
          ],
          timeSignature: "",
          caption: "Grupeto (~): Re–Do–Si–Do (superior) / Si–Do–Re–Do (invertido)",
        },
      },
      {
        title: "Trino (tr~)",
        body: "Alternancia muy rápida y continua entre la nota real y la nota superior durante toda la duración de la nota. El símbolo es 'tr' o 'tr~' escrito sobre la nota.",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "h", ornament: "trill" },
            { keys: ["c/4"], duration: "h", ornament: "trillh" },
          ],
          timeSignature: "",
          caption: "Trino: símbolo tr (corto) y tr~ con extensión (Do alterna con Re)",
        },
      },
      {
        title: "Arpejo",
        body: "Las notas de un acorde se tocan sucesivamente de abajo a arriba en lugar de simultáneamente. El símbolo es una línea ondulada vertical al lado del acorde.",
        staffExample: {
          notes: [
            { keys: ["c/4", "e/4", "g/4"], duration: "h", arpeggio: true },
            { keys: ["c/4", "e/4", "g/4"], duration: "h" },
          ],
          timeSignature: "",
          caption: "Arpejo (onda vertical): acorde Do mayor arpegiado vs simultáneo",
        },
      },
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
