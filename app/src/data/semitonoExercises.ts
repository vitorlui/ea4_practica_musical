import type { VexNote } from "../components/music/VexFlowRenderer";

export interface SemitonoExercise {
  id: string;
  question: string;
  stimulus: string;
  staffNotes?: VexNote[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: SemitonoExercise[] = [
  {
    id: "s01", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Mi → Fa",
    staffNotes: [{ keys: ["e/4"], duration: "h" }, { keys: ["f/4"], duration: "h" }],
    options: ["Diatónico", "Cromático", "No es semitono", "Es un tono"], correctIndex: 0,
    explanation: "Mi→Fa: son nombres distintos (E y F), distancia de 1 semitono. → Semitono diatónico.",
  },
  {
    id: "s02", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Do → Do#",
    staffNotes: [{ keys: ["c/4"], duration: "h" }, { keys: ["c/4"], accidentals: ["#"], duration: "h" }],
    options: ["Cromático", "Diatónico", "No es semitono", "Es una 2ª mayor"], correctIndex: 0,
    explanation: "Do→Do#: mismo nombre (Do), distinto accidental. → Semitono cromático.",
  },
  {
    id: "s03", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Si → Do",
    staffNotes: [{ keys: ["b/3"], duration: "h" }, { keys: ["c/4"], duration: "h" }],
    options: ["Diatónico", "Cromático", "No es semitono", "Es un tono"], correctIndex: 0,
    explanation: "Si→Do: nombres distintos, distancia 1 semitono. → Semitono diatónico natural.",
  },
  {
    id: "s04", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Re → Reb",
    staffNotes: [{ keys: ["d/4"], duration: "h" }, { keys: ["d/4"], accidentals: ["b"], duration: "h" }],
    options: ["Cromático", "Diatónico", "No es semitono", "Es una 2ª menor"], correctIndex: 0,
    explanation: "Re→Reb: mismo nombre (Re), distinto accidental (natural vs bemol). → Semitono cromático descendente.",
  },
  {
    id: "s05", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "La → Sib",
    staffNotes: [{ keys: ["a/4"], duration: "h" }, { keys: ["b/4"], accidentals: ["b"], duration: "h" }],
    options: ["Diatónico", "Cromático", "No es semitono", "Es un tono"], correctIndex: 0,
    explanation: "La→Sib: nombres distintos (A y B), distancia 1 semitono. → Semitono diatónico.",
  },
  {
    id: "s06", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Fa# → Sol",
    staffNotes: [{ keys: ["f/4"], accidentals: ["#"], duration: "h" }, { keys: ["g/4"], duration: "h" }],
    options: ["Diatónico", "Cromático", "No es semitono", "Es un tono"], correctIndex: 0,
    explanation: "Fa#→Sol: nombres distintos (F y G), distancia 1 semitono. → Semitono diatónico.",
  },
  {
    id: "s07", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Sol → Sol#",
    staffNotes: [{ keys: ["g/4"], duration: "h" }, { keys: ["g/4"], accidentals: ["#"], duration: "h" }],
    options: ["Cromático", "Diatónico", "No es semitono", "Es una 2ª mayor"], correctIndex: 0,
    explanation: "Sol→Sol#: mismo nombre, distinto accidental. → Semitono cromático.",
  },
  {
    id: "s08", question: "¿Cuál es la diferencia entre semitono diatónico y cromático?", stimulus: "",
    options: ["Diatónico: notas con nombres distintos. Cromático: misma nota, distinto accidental.", "Diatónico: mismo nombre. Cromático: nombres distintos.", "Diatónico: más grande. Cromático: más pequeño.", "No hay diferencia, son lo mismo."], correctIndex: 0,
    explanation: "Regla: mismo nombre de nota → semitono cromático. Nombres distintos → semitono diatónico.",
  },
  {
    id: "s09", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Mib → Re#",
    staffNotes: [{ keys: ["e/4"], accidentals: ["b"], duration: "h" }, { keys: ["d/4"], accidentals: ["#"], duration: "h" }],
    options: ["No es semitono (son enarmónicas, 0 semitonos)", "Diatónico", "Cromático", "Es un tono"], correctIndex: 0,
    explanation: "Mib y Re# son enarmónicas: mismo sonido, 0 semitonos. No es un semitono sino equivalencia enarmónica.",
  },
  {
    id: "s10", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "La# → Sib",
    staffNotes: [{ keys: ["a/4"], accidentals: ["#"], duration: "h" }, { keys: ["b/4"], accidentals: ["b"], duration: "h" }],
    options: ["No es semitono (enarmónicas)", "Diatónico", "Cromático", "Es un tono"], correctIndex: 0,
    explanation: "La# y Sib son enarmónicas (mismo sonido). Distancia = 0 semitonos, no hay semitono entre ellas.",
  },
  {
    id: "s11", question: "En la escala de Do mayor, ¿dónde hay semitonos diatónicos?", stimulus: "Do-Re-Mi-Fa-Sol-La-Si-Do",
    options: ["Entre Mi-Fa y Si-Do", "Entre Do-Re y Sol-La", "Entre Re-Mi y La-Si", "No hay semitonos"], correctIndex: 0,
    explanation: "En la escala mayor los semitonos naturales están entre los grados III-IV (Mi-Fa) y VII-VIII (Si-Do). Son semitonos diatónicos.",
  },
  {
    id: "s12", question: "¿Qué tipo de semitono hay entre estas dos notas?", stimulus: "Do# → Re",
    staffNotes: [{ keys: ["c/4"], accidentals: ["#"], duration: "h" }, { keys: ["d/4"], duration: "h" }],
    options: ["Diatónico", "Cromático", "No es semitono", "Es una 2ª mayor"], correctIndex: 0,
    explanation: "Do#→Re: nombres distintos (C y D), distancia 1 semitono. → Semitono diatónico.",
  },
];

export function randomSemitonoExercise(): SemitonoExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
