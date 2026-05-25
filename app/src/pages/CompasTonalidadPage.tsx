import { useState, useCallback } from "react";
import { TheoryPracticeLayout } from "../components/layout";
import { MCExerciseCard } from "../components/ui";
import { randomCompasTonalidadExercise } from "../data/compasTonalidadExercises";
import type { CompasExercise } from "../data/compasTonalidadExercises";
import type { TheorySection } from "../components/theory/types";

const COMPAS_THEORY: TheorySection[] = [
  {
    id: "compas",
    title: "El compás",
    steps: [
      { title: "Leer la fracción de compás", body: "Numerador = número de tiempos (o unidades) por compás. Denominador = figura que vale una unidad (4=negra, 8=corchea, 2=blanca)." },
      {
        title: "Compases simples",
        body: "El numerador NO es múltiplo de 3 mayor que 3 (puede ser 2, 3 o 4). Cada tiempo se divide en 2. Ejemplos: 2/4 (binario), 3/4 (ternario), 4/4 (cuaternario).",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "q", bottomAnnotations: ["F"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["d/4"], duration: "q", bottomAnnotations: ["D"], bottomAnnotationColors: ["#6b7280"] },
            { keys: ["e/4"], duration: "q", bottomAnnotations: ["F"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["f/4"], duration: "q", bottomAnnotations: ["D"], bottomAnnotationColors: ["#6b7280"] },
          ],
          timeSignature: "4/4",
          caption: "4/4 simple: 4 negras por compás (F=fuerte, D=débil)",
        },
      },
      {
        title: "Compases compuestos",
        body: "El numerador ES múltiplo de 3: 6, 9 o 12. Cada tiempo se divide en 3. El número de tiempos = numerador ÷ 3. Ejemplos: 6/8 (2 tiempos), 9/8 (3 tiempos), 12/8 (4 tiempos).",
        staffExample: {
          notes: [
            { keys: ["c/4"], duration: "8", bottomAnnotations: ["F"], bottomAnnotationColors: ["#dc2626"] },
            { keys: ["d/4"], duration: "8", bottomAnnotations: ["D"], bottomAnnotationColors: ["#6b7280"] },
            { keys: ["e/4"], duration: "8", bottomAnnotations: ["D"], bottomAnnotationColors: ["#6b7280"] },
            { keys: ["f/4"], duration: "8", bottomAnnotations: ["SF"], bottomAnnotationColors: ["#d97706"] },
            { keys: ["g/4"], duration: "8", bottomAnnotations: ["D"], bottomAnnotationColors: ["#6b7280"] },
            { keys: ["a/4"], duration: "8", bottomAnnotations: ["D"], bottomAnnotationColors: ["#6b7280"] },
          ],
          timeSignature: "6/8",
          caption: "6/8 compuesto: 2 tiempos de 3 corcheas (F/SF/D)",
        },
      },
      { title: "Compases correspondientes", body: "Cada simple tiene su compuesto: 2/4 ↔ 6/8, 3/4 ↔ 9/8, 4/4 ↔ 12/8. La unidad de tiempo en el compuesto = unidad del simple con puntillo." },
    ],
    table: {
      headers: ["Compás simple", "Tipo", "Compás compuesto correspondiente", "Tiempo en compuesto"],
      rows: [
        ["2/4", "Binario simple", "6/8", "Negra con puntillo"],
        ["3/4", "Ternario simple", "9/8", "Negra con puntillo"],
        ["4/4", "Cuaternario simple", "12/8", "Negra con puntillo"],
      ],
    },
  },
  {
    id: "tonalidad",
    title: "La tonalidad",
    steps: [
      {
        title: "Armadura con sostenidos",
        body: "Orden: Fa-Do-Sol-Re-La-Mi-Si. Tónica mayor = nota 1 semitono por encima del último sostenido. Ejemplo: 2# (Fa#,Do#) → último=Do#, tónica=Re → Re Mayor.",
        staffExample: {
          notes: [
            { keys: ["d/4"], duration: "h", isRest: true },
          ],
          keySignature: "D",
          timeSignature: "",
          caption: "Re Mayor: 2 sostenidos (Fa# y Do#)",
        },
      },
      {
        title: "Armadura con bemoles",
        body: "Orden: Si-Mi-La-Re-Sol-Do-Fa. Tónica mayor = penúltimo bemol. Excepción: 1b (Sib) = Fa Mayor.",
        staffExample: {
          notes: [
            { keys: ["b/3"], duration: "h", isRest: true },
          ],
          keySignature: "Bb",
          timeSignature: "",
          caption: "Sib Mayor: 2 bemoles (Sib y Mib)",
        },
      },
      {
        title: "Tonalidad relativa menor",
        body: "Misma armadura, tónica diferente. La menor relativa está una 3ª menor por debajo de la mayor. Ejemplo: Sol Mayor (1#) → Mi menor.",
        staffExample: {
          notes: [
            { keys: ["e/4"], duration: "h", isRest: true },
          ],
          keySignature: "G",
          timeSignature: "",
          caption: "Sol Mayor / Mi menor: 1 sostenido (Fa#)",
        },
      },
    ],
  },
];

export default function CompasTonalidadPage() {
  const [exercise, setExercise] = useState<CompasExercise>(randomCompasTonalidadExercise);
  const [streak, setStreak] = useState(0);
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setExercise(randomCompasTonalidadExercise());
    setKey((k) => k + 1);
  }, []);

  return (
    <TheoryPracticeLayout
      title="3. Compás y Tonalidad"
      bookPages="p.24–47 (Unitats 2–4)"
      theory={COMPAS_THEORY}
    >
      <MCExerciseCard
        key={key}
        question={exercise.question}
        stimulus={exercise.stimulus}
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
