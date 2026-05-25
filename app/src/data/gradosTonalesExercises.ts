export interface GradoExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: GradoExercise[] = [
  { id: "g01", question: "¿Qué nota es la dominante (V grado) de Do Mayor?", options: ["Sol", "Fa", "Re", "La"], correctIndex: 0, explanation: "En Do Mayor: I=Do, II=Re, III=Mi, IV=Fa, V=Sol. La dominante es Sol." },
  { id: "g02", question: "¿Qué nota es la subdominante (IV grado) de Sol Mayor?", options: ["Do", "Fa#", "Re", "La"], correctIndex: 0, explanation: "Sol Mayor: Sol-La-Si-Do-Re-Mi-Fa#. El IV grado es Do." },
  { id: "g03", question: "¿Qué grado es La en Do Mayor?", options: ["VI (superdominante)", "V (dominante)", "III (mediante)", "VII (sensible)"], correctIndex: 0, explanation: "Do(I)-Re(II)-Mi(III)-Fa(IV)-Sol(V)-La(VI). La es el VI grado, la superdominante." },
  { id: "g04", question: "¿Qué nota es la sensible (VII grado) de Do Mayor?", options: ["Si", "Lab", "Fa#", "Re"], correctIndex: 0, explanation: "En Do Mayor el VII grado es Si, que está a un semitono (2ª menor) de la tónica Do." },
  { id: "g05", question: "¿Qué nota es la tónica (I grado) de Re Mayor?", options: ["Re", "Do", "Mi", "Sol"], correctIndex: 0, explanation: "La tónica siempre es la nota que da nombre a la tonalidad. Re Mayor → tónica = Re." },
  { id: "g06", question: "¿Qué nota es la dominante (V grado) de Fa Mayor?", options: ["Do", "Sib", "Sol", "Re"], correctIndex: 0, explanation: "Fa Mayor: Fa-Sol-La-Sib-Do-Re-Mi. El V grado es Do." },
  { id: "g07", question: "¿Cómo se llama el VII grado cuando está a un semitono de la tónica?", options: ["Sensible", "Subtónica", "Mediante", "Superdominante"], correctIndex: 0, explanation: "Cuando el VII grado está a un semitono (2ª menor) de la tónica se llama sensible. Si está a un tono, se llama subtónica." },
  { id: "g08", question: "¿Qué grado es Fa en Do Mayor?", options: ["IV (subdominante)", "V (dominante)", "II (supertónica)", "VI (superdominante)"], correctIndex: 0, explanation: "Do(I)-Re(II)-Mi(III)-Fa(IV). Fa es el IV grado, la subdominante." },
  { id: "g09", question: "¿Qué nota es la mediante (III grado) de La menor?", options: ["Do", "Re", "Mi", "Sol"], correctIndex: 0, explanation: "La menor: La-Si-Do-Re-Mi-Fa-Sol. El III grado es Do." },
  { id: "g10", question: "¿Qué nombre recibe el V grado de una escala?", options: ["Dominante", "Subdominante", "Sensible", "Supertónica"], correctIndex: 0, explanation: "El V grado se llama dominante. Es el segundo grado más importante de la tonalidad, crea tensión hacia la tónica." },
  { id: "g11", question: "¿Qué nota es la supertónica (II grado) de Re Mayor?", options: ["Mi", "Fa#", "Do#", "La"], correctIndex: 0, explanation: "Re Mayor: Re-Mi-Fa#-Sol-La-Si-Do#. El II grado es Mi." },
  { id: "g12", question: "En Do Mayor, ¿qué notas son los grados tonales (I, IV, V)?", options: ["Do, Fa, Sol", "Do, Mi, Sol", "Re, Fa, La", "Mi, Sol, Si"], correctIndex: 0, explanation: "Los grados tonales en Do Mayor son: I=Do (tónica), IV=Fa (subdominante), V=Sol (dominante)." },
];

export function randomGradoExercise(): GradoExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
