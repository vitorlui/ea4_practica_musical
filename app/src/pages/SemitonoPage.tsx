import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomSemitonoExercise } from "../data/semitonoExercises";
import type { SemitonoExercise } from "../data/semitonoExercises";
import type { TheorySection } from "../components/theory/types";

const SEMITONO_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué es un semitono?", body: "El semitono es la distancia más pequeña entre dos notas en la música occidental. En el piano corresponde a dos teclas adyacentes (blanca-negra o dos blancas sin negra entre ellas: Mi-Fa, Si-Do)." },
      { title: "Semitono diatónico", body: "Las dos notas tienen nombres distintos: Mi→Fa, Si→Do, La→Sib, Do#→Re. Se mueve a una nota diferente del alfabeto musical (aunque una tenga alteración). Va de una nota a la nota siguiente con nombre diferente." },
      { title: "Semitono cromático", body: "Las dos notas tienen el mismo nombre pero distinto accidental: Do→Do#, Re→Reb, Sol→Sol#. Solo cambia el accidental (sostenido, bemol, becuadro); el nombre de la nota es el mismo." },
      { title: "Regla para identificar", body: "¿Tienen el mismo nombre de nota? SÍ → cromático. NO → diatónico. Ejemplo: Fa#→Sol (F≠G) = diatónico. Sol→Sol# (G=G) = cromático.", highlight: true },
      { title: "Cuidado con los enarmónicos", body: "Si#=Do (enarmónicas, 0 semitonos entre ellas). La# y Sib son enarmónicas. No hay semitono entre notas enarmónicas: mismo sonido, nombre diferente, pero distancia 0." },
    ],
    table: {
      headers: ["Tipo", "Definición", "Ejemplo ascendente", "Ejemplo descendente"],
      rows: [
        ["Diatónico", "Nombres distintos", "Mi → Fa", "Fa → Mi"],
        ["Diatónico", "Nombres distintos", "Si → Do", "Do → Si"],
        ["Cromático", "Mismo nombre, distinto accidental", "Do → Do#", "Re → Reb"],
        ["Cromático", "Mismo nombre, distinto accidental", "Sol → Sol#", "La → Lab"],
      ],
    },
  },
];

export default function SemitonoPage() {
  const [exercise, setExercise] = useState<SemitonoExercise>(randomSemitonoExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomSemitonoExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="Semitono diatónico y cromático"
      bookPages="p.80–87 (Unitat 9)"
      theory={SEMITONO_THEORY}
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
