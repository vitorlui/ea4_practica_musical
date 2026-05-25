export interface TransposeExercise {
  id: string;
  sourceNote: string;
  intervalName: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

const EXERCISES: TransposeExercise[] = [
  { id: "t01", sourceNote: "Do", intervalName: "2ª mayor ascendente", correctAnswer: "Re", options: ["Re", "Reb", "Mi", "Do#"], explanation: "Do + 2ª mayor (2 semitonos) = Re." },
  { id: "t02", sourceNote: "Do", intervalName: "3ª mayor ascendente", correctAnswer: "Mi", options: ["Mi", "Mib", "Fa", "Re"], explanation: "Do + 3ª mayor (4 semitonos) = Mi." },
  { id: "t03", sourceNote: "Re", intervalName: "3ª menor ascendente", correctAnswer: "Fa", options: ["Fa", "Fa#", "Mi", "Sol"], explanation: "Re + 3ª menor (3 semitonos) = Fa." },
  { id: "t04", sourceNote: "Sol", intervalName: "4ª justa ascendente", correctAnswer: "Do", options: ["Do", "Do#", "Si", "Re"], explanation: "Sol + 4ª justa (5 semitonos) = Do." },
  { id: "t05", sourceNote: "La", intervalName: "5ª justa ascendente", correctAnswer: "Mi", options: ["Mi", "Mib", "Fa#", "Re"], explanation: "La + 5ª justa (7 semitonos) = Mi." },
  { id: "t06", sourceNote: "Mi", intervalName: "2ª menor ascendente", correctAnswer: "Fa", options: ["Fa", "Fa#", "Re#", "Sol"], explanation: "Mi + 2ª menor (1 semitono) = Fa. Es un semitono diatónico natural." },
  { id: "t07", sourceNote: "Si", intervalName: "2ª menor ascendente", correctAnswer: "Do", options: ["Do", "Do#", "La#", "Re"], explanation: "Si + 2ª menor (1 semitono) = Do. Semitono diatónico natural." },
  { id: "t08", sourceNote: "La", intervalName: "3ª mayor ascendente", correctAnswer: "Do#", options: ["Do#", "Do", "Si", "Re"], explanation: "La + 3ª mayor (4 semitonos) = Do#. Hay que añadir sostenido para mantener el intervalo exacto." },
  { id: "t09", sourceNote: "Re", intervalName: "2ª mayor descendente", correctAnswer: "Do", options: ["Do", "Do#", "Mi", "Reb"], explanation: "Re - 2ª mayor (2 semitonos hacia abajo) = Do." },
  { id: "t10", sourceNote: "Sol", intervalName: "3ª menor descendente", correctAnswer: "Mi", options: ["Mi", "Mib", "Fa", "Re"], explanation: "Sol - 3ª menor (3 semitonos hacia abajo) = Mi." },
  { id: "t11", sourceNote: "Fa", intervalName: "4ª justa ascendente", correctAnswer: "Sib", options: ["Sib", "Si", "La", "Do"], explanation: "Fa + 4ª justa (5 semitonos) = Sib. El cuarto grado de Fa mayor es Sib." },
  { id: "t12", sourceNote: "Mi", intervalName: "6ª mayor ascendente", correctAnswer: "Do#", options: ["Do#", "Do", "Re", "Si"], explanation: "Mi + 6ª mayor (9 semitonos) = Do#." },
];

export function randomTransposeExercise(): TransposeExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
