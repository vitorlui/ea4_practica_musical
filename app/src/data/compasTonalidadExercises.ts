export interface CompasExercise {
  id: string;
  type: "compas" | "tonalidad";
  question: string;
  stimulus: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: CompasExercise[] = [
  { id: "c01", type: "compas", question: "¿Este compás es simple o compuesto?", stimulus: "Compás: 3/4", options: ["Simple", "Compuesto", "No es un compás válido", "Depende del tempo"], correctIndex: 0, explanation: "3/4 es simple: numerador 3 (no múltiplo de 3 mayor que 3), cada tiempo se divide en 2." },
  { id: "c02", type: "compas", question: "¿Este compás es simple o compuesto?", stimulus: "Compás: 6/8", options: ["Simple", "Compuesto", "Ternario simple", "Binario simple"], correctIndex: 1, explanation: "6/8 es compuesto: numerador 6 (múltiplo de 3), cada tiempo se divide en 3. Tiene 2 tiempos de negra con puntillo." },
  { id: "c03", type: "compas", question: "¿Cuántos tiempos tiene el compás 9/8?", stimulus: "Compás: 9/8", options: ["9 tiempos", "3 tiempos", "4 tiempos", "6 tiempos"], correctIndex: 1, explanation: "9/8 es ternario compuesto: 9 ÷ 3 = 3 tiempos. Cada tiempo dura una negra con puntillo." },
  { id: "c04", type: "compas", question: "¿Cuál es el compás simple correspondiente a 12/8?", stimulus: "Compás compuesto: 12/8", options: ["3/4", "4/4", "6/4", "2/4"], correctIndex: 1, explanation: "12/8 → 12÷3=4 tiempos → cuaternario. El simple correspondiente es 4/4." },
  { id: "c05", type: "compas", question: "En el compás 4/4, ¿cuántas corcheas caben en un compás?", stimulus: "Compás: 4/4", options: ["4", "6", "8", "16"], correctIndex: 2, explanation: "Un compás de 4/4 = 4 negras. Cada negra = 2 corcheas → 4 × 2 = 8 corcheas." },
  { id: "c06", type: "compas", question: "¿Qué figura vale un tiempo en el compás 3/8?", stimulus: "Compás: 3/8", options: ["Negra", "Blanca", "Corchea", "Semicorchea"], correctIndex: 2, explanation: "En 3/8, el denominador 8 indica que la corchea vale un tiempo. El compás tiene 3 tiempos de corchea." },
  { id: "t01", type: "tonalidad", question: "¿A qué tonalidad mayor corresponde esta armadura?", stimulus: "Armadura: 2 sostenidos (Fa#, Do#)", options: ["Re Mayor", "La Mayor", "Sol Mayor", "Mi Mayor"], correctIndex: 0, explanation: "2 sostenidos: Fa#, Do#. El último sostenido es Do#. La tónica mayor está una 2ª menor por encima: Do# + 1 semitono = Re. → Re Mayor." },
  { id: "t02", type: "tonalidad", question: "¿A qué tonalidad mayor corresponde esta armadura?", stimulus: "Armadura: 3 bemoles (Sib, Mib, Lab)", options: ["Mib Mayor", "Lab Mayor", "Sib Mayor", "Fa Mayor"], correctIndex: 0, explanation: "3 bemoles: el penúltimo es Mib. → Mib Mayor." },
  { id: "t03", type: "tonalidad", question: "¿Cuál es la tonalidad menor relativa de Sol Mayor?", stimulus: "Tonalidad mayor: Sol Mayor (1 sostenido: Fa#)", options: ["Mi menor", "Si menor", "La menor", "Re menor"], correctIndex: 0, explanation: "La relativa menor está una 3ª menor (1T+1ST) por debajo de la mayor. Sol - 3ª menor = Mi. → Mi menor." },
  { id: "t04", type: "tonalidad", question: "¿A qué tonalidad mayor corresponde esta armadura?", stimulus: "Armadura: sin alteraciones (0 alteraciones)", options: ["Do Mayor", "La Mayor", "Sol Mayor", "Fa Mayor"], correctIndex: 0, explanation: "Sin alteraciones → Do Mayor (y su relativa La menor)." },
  { id: "t05", type: "tonalidad", question: "¿A qué tonalidad mayor corresponde esta armadura?", stimulus: "Armadura: 1 bemol (Sib)", options: ["Fa Mayor", "Sib Mayor", "Do Mayor", "Re Mayor"], correctIndex: 0, explanation: "1 bemol es caso especial: Fa Mayor. No se puede aplicar la regla del penúltimo (solo hay uno)." },
  { id: "t06", type: "tonalidad", question: "¿Cuántos sostenidos tiene la armadura de La Mayor?", stimulus: "Tonalidad: La Mayor", options: ["3", "4", "2", "5"], correctIndex: 0, explanation: "La Mayor tiene 3 sostenidos: Fa#, Do#, Sol#." },
];

export function randomCompasTonalidadExercise(): CompasExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
