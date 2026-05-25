export interface NotaAdornoExercise {
  id: string;
  question: string;
  stimulus: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: NotaAdornoExercise[] = [
  { id: "na01", question: "¿Qué nota de adorno es esta?", stimulus: "Símbolo: una nota pequeña (corchea pequeña) escrita justo antes de la nota real.", options: ["Apoiatura", "Mordente", "Grupeto", "Trino"], correctIndex: 0, explanation: "La apoiatura es una nota pequeña que precede a la nota real y toma la mitad (o dos tercios) de su valor." },
  { id: "na02", question: "¿Qué nota de adorno indica el símbolo tr~?", stimulus: "Símbolo: tr o tr~ escrito sobre una nota.", options: ["Trino", "Mordente", "Grupeto", "Arpejo"], correctIndex: 0, explanation: "El trino (tr~) indica alternar muy rápidamente la nota real con la nota un grado superior." },
  { id: "na03", question: "¿Qué nota de adorno representa el signo ~ (onda horizontal)?", stimulus: "Símbolo: ~ (ondulación horizontal) sobre la nota", options: ["Grupeto", "Trino", "Mordente", "Apoiatura"], correctIndex: 0, explanation: "El grupeto (~) es una figura de 4 notas: nota superior, nota real, nota inferior, nota real. Decora la nota principal con una pequeña vuelta." },
  { id: "na04", question: "¿Qué describe mejor el mordente?", stimulus: "Describir el mordente de una nota:", options: ["Alternar rápidamente la nota real con la nota inmediatamente superior o inferior, volviendo a la real", "Tocar las notas de un acorde de abajo a arriba rápidamente", "Cuatro notas en círculo alrededor de la nota real", "Nota pequeña que precede a la nota real"], correctIndex: 0, explanation: "El mordente consiste en alternar rápidamente (normalmente una vez) la nota real con la nota superior (mordente superior) o inferior (mordente inferior)." },
  { id: "na05", question: "¿Qué nota de adorno consiste en tocar las notas de un acorde sucesivamente de abajo a arriba?", stimulus: "El símbolo es una línea ondulada vertical al lado del acorde.", options: ["Arpejo", "Trino", "Grupeto", "Mordente"], correctIndex: 0, explanation: "El arpejo (arpegio) consiste en tocar las notas del acorde una tras otra, de abajo a arriba, en lugar de simultáneamente." },
  { id: "na06", question: "¿Cuántas notas incluye un grupeto estándar?", stimulus: "Grupeto (~): figura ornamental", options: ["4 notas (sup., real, inf., real)", "2 notas (real y superior)", "3 notas (sup., real, inf.)", "5 notas"], correctIndex: 0, explanation: "El grupeto tiene 4 notas: nota superior, nota real, nota inferior, nota real (vuelta completa alrededor de la nota)." },
  { id: "na07", question: "¿En qué parte del compás suele colocarse la apoiatura?", stimulus: "La apoiatura (nota de adorno principal):", options: ["En parte fuerte o acentuada", "Solo en parte débil", "Entre dos tiempos", "Al final del compás"], correctIndex: 0, explanation: "La apoiatura se coloca en parte fuerte o acentuada. Produce tensión y resuelve por grado conjunto hacia la nota real." },
  { id: "na08", question: "¿Qué diferencia hay entre apoiatura y mordente?", stimulus: "Comparando apoiatura y mordente:", options: ["Apoiatura: nota larga que toma valor de la real. Mordente: alternancia rápida sin valor propio.", "Mordente: nota larga. Apoiatura: alternancia rápida.", "Son lo mismo, solo cambia el nombre.", "El mordente es más largo que la apoiatura."], correctIndex: 0, explanation: "La apoiatura toma la mitad (o 2/3) del valor de la nota real. El mordente es muy rápido y solo 'toca' brevemente la nota superior/inferior." },
  { id: "na09", question: "¿Qué es la acciaccatura?", stimulus: "La acciaccatura es una apoiatura especial:", options: ["Apoiatura muy breve, representada con una corchea pequeña tachada", "Un tipo de trino", "Una variante del grupeto", "Un arpejo rápido"], correctIndex: 0, explanation: "La acciaccatura (mordent breu / apoiatura breve) es una nota pequeña tachada. Se interpreta muy brevemente, casi simultánea a la nota real." },
  { id: "na10", question: "¿Qué efecto produce el trino en la nota?", stimulus: "Trino (tr~) sobre una nota larga:", options: ["Alternancia muy rápida y continua con la nota superior durante toda la duración", "Toca la nota superior una sola vez", "Baja a la nota inferior rápidamente", "Toca el acorde en arpejo"], correctIndex: 0, explanation: "El trino alterna la nota real con la nota superior de forma continua y muy rápida durante toda la duración de la nota." },
];

export function randomNotaAdornoExercise(): NotaAdornoExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
