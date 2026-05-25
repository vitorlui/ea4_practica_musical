import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomEnarmoniaExercise } from "../data/enarmoniaExercises";
import type { EnarmoniaExercise } from "../data/enarmoniaExercises";
import type { TheorySection } from "../components/theory/types";

const ENARMONIA_THEORY: TheorySection[] = [
  {
    id: "def",
    steps: [
      { title: "¿Qué es la enarmonía?", body: "Dos notas son enarmónicas cuando tienen el mismo sonido (misma frecuencia) pero distinto nombre y escritura. En el piano, una misma tecla puede tener dos nombres." },
      {
        title: "Sin distancia entre notas enarmónicas",
        body: "La distancia entre Do# y Reb es 0 semitonos: suenan exactamente igual. Solo cambia la notación escrita.",
        staffExample: {
          notes: [
            { keys: ["c/4"], accidentals: ["#"], duration: "h", annotations: ["Do#"], annotationColors: ["#4338ca"] },
            { keys: ["d/4"], accidentals: ["b"], duration: "h", annotations: ["Reb"], annotationColors: ["#dc2626"] },
          ],
          timeSignature: "",
          caption: "Do# y Reb: mismo sonido, 0 semitonos entre ellas",
        },
      },
      {
        title: "Pares enarmónicos más frecuentes",
        body: "Do#/Reb, Re#/Mib, Fa#/Solb, Sol#/Lab, La#/Sib. Además: Si/Dob y Mi/Fab (menos frecuentes).",
        staffExample: {
          notes: [
            { keys: ["g/4"], accidentals: ["#"], duration: "h", annotations: ["Sol#"], annotationColors: ["#4338ca"] },
            { keys: ["a/4"], accidentals: ["b"], duration: "h", annotations: ["Lab"], annotationColors: ["#dc2626"] },
          ],
          timeSignature: "",
          caption: "Sol# y Lab: enarmónicas (8 semitonos desde Do)",
        },
      },
      { title: "Cuándo se usa la enarmonía", body: "Para simplificar la escritura. Ejemplo: Fa# Mayor (6 sostenidos) es equivalente a Solb Mayor (6 bemoles). Se elige la que resulta más fácil de leer en cada contexto.", highlight: true },
      { title: "Semitonos cromáticos y enarmónicos", body: "El semitono cromático sube/baja la misma nota (Do→Do#). El semitono diatónico mueve a una nota diferente (Mi→Fa). Las notas enarmónicas resultan de usar distintos nombres para el mismo punto del semitono cromático." },
    ],
    table: {
      headers: ["Nota con #", "Equivalente enarmónico (b)", "Semitonos desde Do"],
      rows: [
        ["Do#", "Reb", "1"],
        ["Re#", "Mib", "3"],
        ["Fa#", "Solb", "6"],
        ["Sol#", "Lab", "8"],
        ["La#", "Sib", "10"],
        ["Mi", "Fab", "4"],
        ["Si", "Dob", "11"],
      ],
    },
  },
];

export default function EnarmoniaPage() {
  const [exercise, setExercise] = useState<EnarmoniaExercise>(randomEnarmoniaExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomEnarmoniaExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="Enarmonía"
      bookPages="p.72–79 (Unitat 8)"
      theory={ENARMONIA_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={exercise.question}
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
