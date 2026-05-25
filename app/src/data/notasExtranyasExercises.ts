export interface NotaExtraniaExercise {
  id: string;
  context: string;
  markedNote: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: NotaExtraniaExercise[] = [
  { id: "ne01", context: "Melodía en Do Mayor, acorde de tónica (Do-Mi-Sol). Notas: Do - Re - Mi", markedNote: "Re (la nota central)", options: ["Nota de paso (NP)", "Bordadura (B)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "Re une Do y Mi por grado conjunto y no pertenece al acorde de Do Mayor. Es una nota de paso (NP), en parte débil." },
  { id: "ne02", context: "Melodía en Do Mayor, acorde de tónica (Do-Mi-Sol). Notas: Mi - Fa - Mi", markedNote: "Fa (la nota central)", options: ["Bordadura (B)", "Nota de paso (NP)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "Fa está entre dos Mi iguales y sale por grado conjunto. Es una bordadura superior (B)." },
  { id: "ne03", context: "Melodía en Do Mayor, acorde de tónica. La nota Re aparece en tiempo fuerte, seguida de Do en tiempo débil.", markedNote: "Re (en tiempo fuerte)", options: ["Apoyatura (A)", "Nota de paso (NP)", "Bordadura (B)", "No es nota extraña"], correctIndex: 0, explanation: "Re aparece en tiempo fuerte, no pertenece al acorde (Do-Mi-Sol) y resuelve por grado conjunto hacia Do. Es una apoyatura (A)." },
  { id: "ne04", context: "Melodía en Sol Mayor, acorde de dominante (Re-Fa#-La). Notas: Re - Mi - Fa#", markedNote: "Mi (la nota central)", options: ["Nota de paso (NP)", "Bordadura (B)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "Mi une Re y Fa# por grado conjunto. No está en el acorde de Re Mayor. Es una nota de paso (NP)." },
  { id: "ne05", context: "Melodía en La menor, acorde de tónica (La-Do-Mi). Notas: La - Si - La", markedNote: "Si (la nota central)", options: ["Bordadura (B)", "Nota de paso (NP)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "Si está entre dos La y sale un grado por encima. Es una bordadura superior (B)." },
  { id: "ne06", context: "Melodía en Fa Mayor, acorde de subdominante (Fa-La-Do). Notas: Sol - Fa (en tiempo fuerte)", markedNote: "Sol (precede a Fa en tiempo fuerte; Fa es la nota real)", options: ["Apoyatura (A)", "Nota de paso (NP)", "Bordadura (B)", "No es nota extraña"], correctIndex: 0, explanation: "Sol está en tiempo fuerte o acentuado, no pertenece al acorde y resuelve por grado conjunto hacia Fa. Es una apoyatura (A)." },
  { id: "ne07", context: "Melodía en Re Mayor, acorde de tónica (Re-Fa#-La). Notas: Fa# - Sol - Fa#", markedNote: "Sol (la nota central)", options: ["Bordadura (B)", "Nota de paso (NP)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "Sol sale de Fa# y vuelve a Fa# por grado conjunto. Bordadura superior (B)." },
  { id: "ne08", context: "Melodía en Do Mayor, acorde de dominante (Sol-Si-Re). Notas: Sol - La - Si", markedNote: "La (la nota central)", options: ["Nota de paso (NP)", "Bordadura (B)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "La une Sol y Si por grado conjunto; no está en el acorde Sol-Si-Re. Nota de paso (NP)." },
  { id: "ne09", context: "Melodía en Do Mayor, acorde de tónica (Do-Mi-Sol). Nota Mi aparece en tiempo débil, seguida de otra nota del acorde.", markedNote: "Mi", options: ["No es nota extraña", "Nota de paso (NP)", "Bordadura (B)", "Apoyatura (A)"], correctIndex: 0, explanation: "Mi pertenece al acorde de Do Mayor (Do-Mi-Sol). No es una nota extraña." },
  { id: "ne10", context: "Melodía en Sol Mayor, acorde de tónica (Sol-Si-Re). Notas: Sol - La - Sol", markedNote: "La (la nota central)", options: ["Bordadura (B)", "Nota de paso (NP)", "Apoyatura (A)", "No es nota extraña"], correctIndex: 0, explanation: "La sale de Sol y vuelve a Sol, un grado superior. Bordadura superior (B)." },
];

export function randomNotaExtraniaExercise(): NotaExtraniaExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
