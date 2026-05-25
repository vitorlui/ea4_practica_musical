import type { VexNote } from "../components/music/VexFlowRenderer";

export interface AcordeExercise {
  id: string;
  question: string;
  stimulus: string;
  staffNotes?: VexNote[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: AcordeExercise[] = [
  {
    id: "a01", question: "¿Qué tipo de acorde es este?", stimulus: "Do - Mi - Sol",
    staffNotes: [{ keys: ["c/4", "e/4", "g/4"], duration: "w" }],
    options: ["Perfecto mayor", "Perfecto menor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "Do-Mi = 3ª mayor (4 semitonos). Mi-Sol = 3ª menor (3 semitonos). Do-Sol = 5ª justa. → Acorde perfecto mayor.",
  },
  {
    id: "a02", question: "¿Qué tipo de acorde es este?", stimulus: "La - Do - Mi",
    staffNotes: [{ keys: ["a/3", "c/4", "e/4"], duration: "w" }],
    options: ["Perfecto menor", "Perfecto mayor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "La-Do = 3ª menor (3 semitonos). Do-Mi = 3ª mayor (4 semitonos). La-Mi = 5ª justa. → Acorde perfecto menor.",
  },
  {
    id: "a03", question: "¿Qué tipo de acorde es este?", stimulus: "Fa - La - Do",
    staffNotes: [{ keys: ["f/4", "a/4", "c/5"], duration: "w" }],
    options: ["Perfecto mayor", "Perfecto menor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "Fa-La = 3ª mayor (4 semitonos). La-Do = 3ª menor (3 semitonos). Fa-Do = 5ª justa. → Acorde perfecto mayor.",
  },
  {
    id: "a04", question: "¿Qué tipo de acorde es este?", stimulus: "Re - Fa - La",
    staffNotes: [{ keys: ["d/4", "f/4", "a/4"], duration: "w" }],
    options: ["Perfecto menor", "Perfecto mayor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "Re-Fa = 3ª menor (3 semitonos). Fa-La = 3ª mayor (4 semitonos). Re-La = 5ª justa. → Acorde perfecto menor.",
  },
  {
    id: "a05", question: "¿Qué tipo de acorde es este?", stimulus: "Sol - Si - Re",
    staffNotes: [{ keys: ["g/4", "b/4", "d/5"], duration: "w" }],
    options: ["Perfecto mayor", "Perfecto menor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "Sol-Si = 3ª mayor (4 semitonos). Si-Re = 3ª menor (3 semitonos). Sol-Re = 5ª justa. → Acorde perfecto mayor.",
  },
  {
    id: "a06", question: "¿Cuántos semitonos hay de la fundamental a la 3ª en un acorde perfecto mayor?",
    stimulus: "Acorde perfecto mayor: fundamental + 3ª + 5ª",
    options: ["4 semitonos (3ª mayor)", "3 semitonos (3ª menor)", "5 semitonos (4ª justa)", "2 semitonos (2ª mayor)"], correctIndex: 0,
    explanation: "En el acorde perfecto mayor: fundamental → 3ª = 3ª mayor = 4 semitonos. La 3ª mayor da el carácter 'alegre' del acorde.",
  },
  {
    id: "a07", question: "¿Cuántos semitonos hay de la fundamental a la 3ª en un acorde perfecto menor?",
    stimulus: "Acorde perfecto menor: fundamental + 3ª + 5ª",
    options: ["3 semitonos (3ª menor)", "4 semitonos (3ª mayor)", "5 semitonos (4ª justa)", "7 semitonos (5ª justa)"], correctIndex: 0,
    explanation: "En el acorde perfecto menor: fundamental → 3ª = 3ª menor = 3 semitonos. La 3ª menor da el carácter 'triste' o 'oscuro'.",
  },
  {
    id: "a08", question: "¿Qué tipo de acorde es este?", stimulus: "Mi - Sol - Si",
    staffNotes: [{ keys: ["e/4", "g/4", "b/4"], duration: "w" }],
    options: ["Perfecto menor", "Perfecto mayor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "Mi-Sol = 3ª menor (3 semitonos). Sol-Si = 3ª mayor (4 semitonos). Mi-Si = 5ª justa. → Acorde perfecto menor.",
  },
  {
    id: "a09", question: "¿Cuál es la estructura de un acorde perfecto mayor?",
    stimulus: "Estructura de las tríadas perfectas:",
    options: ["3ª mayor + 3ª menor (desde la fundamental)", "3ª menor + 3ª mayor", "3ª mayor + 3ª mayor", "3ª menor + 3ª menor"], correctIndex: 0,
    explanation: "Perfecto mayor = 3ª mayor (4st) + 3ª menor (3st). Entre fundamental y quinta: 5ª justa (7st).",
  },
  {
    id: "a10", question: "¿Qué tipo de acorde es este?", stimulus: "Sib - Re - Fa",
    staffNotes: [{ keys: ["b/3", "d/4", "f/4"], accidentals: ["b", null, null], duration: "w" }],
    options: ["Perfecto mayor", "Perfecto menor", "Aumentado", "Disminuido"], correctIndex: 0,
    explanation: "Sib-Re = 3ª mayor (4st). Re-Fa = 3ª menor (3st). Sib-Fa = 5ª justa. → Acorde perfecto mayor.",
  },
];

export function randomAcordeExercise(): AcordeExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
