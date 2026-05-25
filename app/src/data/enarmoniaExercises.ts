import type { VexNote } from "../components/music/VexFlowRenderer";

export interface EnarmoniaExercise {
  id: string;
  question: string;
  staffNotes?: VexNote[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: EnarmoniaExercise[] = [
  {
    id: "e01", question: "¿Cuál es el enarmónico de Fa#?",
    staffNotes: [{ keys: ["f/4"], accidentals: ["#"], duration: "h", annotations: ["Fa#"], annotationColors: ["#4338ca"] }],
    options: ["Solb", "Fab", "Sol", "Fa"], correctIndex: 0,
    explanation: "Fa# y Solb tienen el mismo sonido (6 semitonos desde Do). Son enarmónicos.",
  },
  {
    id: "e02", question: "¿Cuál es el enarmónico de Reb?",
    staffNotes: [{ keys: ["d/4"], accidentals: ["b"], duration: "h", annotations: ["Reb"], annotationColors: ["#4338ca"] }],
    options: ["Do#", "Re", "Dob", "Mib"], correctIndex: 0,
    explanation: "Reb y Do# tienen el mismo sonido (1 semitono desde Do). Son enarmónicos.",
  },
  {
    id: "e03", question: "¿Cuál es el enarmónico de Si?",
    staffNotes: [{ keys: ["b/4"], duration: "h", annotations: ["Si"], annotationColors: ["#4338ca"] }],
    options: ["Dob", "Do", "Sib", "La#"], correctIndex: 0,
    explanation: "Si y Dob tienen el mismo sonido. Si = Dob (11 semitonos desde Do).",
  },
  {
    id: "e04", question: "¿Cuál es el enarmónico de Mi?",
    staffNotes: [{ keys: ["e/4"], duration: "h", annotations: ["Mi"], annotationColors: ["#4338ca"] }],
    options: ["Fab", "Fa", "Mib", "Re#"], correctIndex: 0,
    explanation: "Mi y Fab tienen el mismo sonido (4 semitonos desde Do).",
  },
  {
    id: "e05", question: "¿Cuál es el enarmónico de Sol#?",
    staffNotes: [{ keys: ["g/4"], accidentals: ["#"], duration: "h", annotations: ["Sol#"], annotationColors: ["#4338ca"] }],
    options: ["Lab", "Sol", "Fa##", "Sib"], correctIndex: 0,
    explanation: "Sol# y Lab tienen el mismo sonido (8 semitonos desde Do).",
  },
  {
    id: "e06", question: "¿Cuál es el enarmónico de La#?",
    staffNotes: [{ keys: ["a/4"], accidentals: ["#"], duration: "h", annotations: ["La#"], annotationColors: ["#4338ca"] }],
    options: ["Sib", "Lab", "Si", "Sol##"], correctIndex: 0,
    explanation: "La# y Sib tienen el mismo sonido (10 semitonos desde Do).",
  },
  {
    id: "e07", question: "¿Cuál es el enarmónico de Mib?",
    staffNotes: [{ keys: ["e/4"], accidentals: ["b"], duration: "h", annotations: ["Mib"], annotationColors: ["#4338ca"] }],
    options: ["Re#", "Fa", "Mi", "Reb"], correctIndex: 0,
    explanation: "Mib y Re# tienen el mismo sonido (3 semitonos desde Do).",
  },
  {
    id: "e08", question: "¿Cuántos semitonos separan dos notas enarmónicas?",
    options: ["0 (mismo sonido)", "1 semitono", "2 semitonos", "Depende del instrumento"], correctIndex: 0,
    explanation: "Por definición, dos notas enarmónicas tienen el mismo sonido (0 semitonos de diferencia). Solo cambia el nombre escrito.",
  },
  {
    id: "e09", question: "¿Qué tonalidades son enarmónicas entre sí?",
    options: ["Fa# Mayor y Solb Mayor", "Re Mayor y Mib Mayor", "La Mayor y Sib Mayor", "Mi Mayor y Fa Mayor"], correctIndex: 0,
    explanation: "Fa# Mayor (6 sostenidos) = Solb Mayor (6 bemoles). Suenan igual, se escriben distinto.",
  },
  {
    id: "e10", question: "¿Cuál es el enarmónico de Do#?",
    staffNotes: [{ keys: ["c/4"], accidentals: ["#"], duration: "h", annotations: ["Do#"], annotationColors: ["#4338ca"] }],
    options: ["Reb", "Do", "Re", "Dob"], correctIndex: 0,
    explanation: "Do# y Reb tienen el mismo sonido (1 semitono desde Do).",
  },
  {
    id: "e11", question: "¿Cuál es el enarmónico de Lab?",
    staffNotes: [{ keys: ["a/4"], accidentals: ["b"], duration: "h", annotations: ["Lab"], annotationColors: ["#4338ca"] }],
    options: ["Sol#", "Sib", "La", "Reb"], correctIndex: 0,
    explanation: "Lab y Sol# tienen el mismo sonido (8 semitonos desde Do).",
  },
  {
    id: "e12", question: "¿La nota Dob es enarmónica de...?",
    staffNotes: [{ keys: ["c/5"], accidentals: ["b"], duration: "h", annotations: ["Dob"], annotationColors: ["#4338ca"] }],
    options: ["Si", "Do", "Sib", "Re"], correctIndex: 0,
    explanation: "Dob = Si (mismo sonido, 11 semitonos desde Do). Se usan en distintas tonalidades pero suenan igual.",
  },
];

export function randomEnarmoniaExercise(): EnarmoniaExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
