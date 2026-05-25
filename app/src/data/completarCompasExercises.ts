export interface CompletarCompasExercise {
  id: string;
  meter: string;
  totalBeatsDescription: string;
  existingNotes: string;
  usedValue: number;
  totalValue: number;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

const EXERCISES: CompletarCompasExercise[] = [
  { id: "cc01", meter: "3/4", totalBeatsDescription: "3 tiempos de negra (valor total: 3 negras)", existingNotes: "negra + corchea", usedValue: 1.5, totalValue: 3, correctAnswer: "negra con puntillo", options: ["negra con puntillo", "blanca", "dos corcheas", "semicorchea"], explanation: "3 negras - 1.5 = 1.5. Una negra con puntillo = 1.5 tiempos. Correcto." },
  { id: "cc02", meter: "4/4", totalBeatsDescription: "4 tiempos de negra (valor total: 4 negras)", existingNotes: "negra + negra + corchea", usedValue: 2.5, totalValue: 4, correctAnswer: "negra con puntillo", options: ["negra con puntillo", "blanca", "negra", "blanca con puntillo"], explanation: "4 - 2.5 = 1.5 = negra con puntillo." },
  { id: "cc03", meter: "2/4", totalBeatsDescription: "2 tiempos de negra (valor total: 2 negras)", existingNotes: "negra", usedValue: 1, totalValue: 2, correctAnswer: "negra", options: ["negra", "blanca", "corchea", "dos semicorcheas"], explanation: "2 - 1 = 1 negra." },
  { id: "cc04", meter: "6/8", totalBeatsDescription: "2 tiempos de negra con puntillo (valor total: 6 corcheas)", existingNotes: "negra con puntillo (= 3 corcheas)", usedValue: 3, totalValue: 6, correctAnswer: "negra con puntillo", options: ["negra con puntillo", "blanca con puntillo", "tres corcheas", "blanca"], explanation: "6 corcheas - 3 = 3 corcheas = negra con puntillo." },
  { id: "cc05", meter: "3/4", totalBeatsDescription: "3 tiempos de negra", existingNotes: "blanca", usedValue: 2, totalValue: 3, correctAnswer: "negra", options: ["negra", "negra con puntillo", "corchea", "blanca"], explanation: "3 - 2 = 1 negra." },
  { id: "cc06", meter: "4/4", totalBeatsDescription: "4 tiempos de negra", existingNotes: "blanca + corchea + corchea", usedValue: 3, totalValue: 4, correctAnswer: "negra", options: ["negra", "blanca", "corchea", "negra con puntillo"], explanation: "4 - 3 = 1 negra." },
  { id: "cc07", meter: "9/8", totalBeatsDescription: "3 tiempos de negra con puntillo (valor total: 9 corcheas)", existingNotes: "dos negras con puntillo (= 6 corcheas)", usedValue: 6, totalValue: 9, correctAnswer: "negra con puntillo", options: ["negra con puntillo", "blanca", "tres corcheas", "semicorchea"], explanation: "9 - 6 = 3 corcheas = negra con puntillo." },
  { id: "cc08", meter: "2/4", totalBeatsDescription: "2 tiempos de negra", existingNotes: "corchea + corchea + corchea", usedValue: 1.5, totalValue: 2, correctAnswer: "corchea", options: ["corchea", "negra", "semicorchea", "negra con puntillo"], explanation: "2 - 1.5 = 0.5 = una corchea." },
  { id: "cc09", meter: "4/4", totalBeatsDescription: "4 tiempos de negra", existingNotes: "blanca con puntillo", usedValue: 3, totalValue: 4, correctAnswer: "negra", options: ["negra", "corchea", "negra con puntillo", "blanca"], explanation: "4 - 3 (blanca con puntillo) = 1 negra." },
  { id: "cc10", meter: "3/4", totalBeatsDescription: "3 tiempos de negra", existingNotes: "negra + dos corcheas", usedValue: 2, totalValue: 3, correctAnswer: "negra", options: ["negra", "blanca", "corchea con puntillo", "semicorchea"], explanation: "3 - 2 = 1 negra." },
];

export function randomCompletarCompasExercise(): CompletarCompasExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
