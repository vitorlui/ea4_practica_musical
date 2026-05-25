export interface EnarmoniaExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: EnarmoniaExercise[] = [
  { id: "e01", question: "¿Cuál es el enarmónico de Fa#?", options: ["Solb", "Fab", "Sol", "Fa"], correctIndex: 0, explanation: "Fa# y Solb tienen el mismo sonido (6 semitonos desde Do). Son enarmónicos." },
  { id: "e02", question: "¿Cuál es el enarmónico de Reb?", options: ["Do#", "Re", "Dob", "Mib"], correctIndex: 0, explanation: "Reb y Do# tienen el mismo sonido (1 semitono desde Do). Son enarmónicos." },
  { id: "e03", question: "¿Cuál es el enarmónico de Si?", options: ["Dob", "Do", "Sib", "La#"], correctIndex: 0, explanation: "Si y Dob tienen el mismo sonido. Si = Dob (11 semitonos desde Do)." },
  { id: "e04", question: "¿Cuál es el enarmónico de Mi?", options: ["Fab", "Fa", "Mib", "Re#"], correctIndex: 0, explanation: "Mi y Fab tienen el mismo sonido (4 semitonos desde Do)." },
  { id: "e05", question: "¿Cuál es el enarmónico de Sol#?", options: ["Lab", "Sol", "Fa##", "Sib"], correctIndex: 0, explanation: "Sol# y Lab tienen el mismo sonido (8 semitonos desde Do)." },
  { id: "e06", question: "¿Cuál es el enarmónico de La#?", options: ["Sib", "Lab", "Si", "Sol##"], correctIndex: 0, explanation: "La# y Sib tienen el mismo sonido (10 semitonos desde Do)." },
  { id: "e07", question: "¿Cuál es el enarmónico de Mib?", options: ["Re#", "Fa", "Mi", "Reb"], correctIndex: 0, explanation: "Mib y Re# tienen el mismo sonido (3 semitonos desde Do)." },
  { id: "e08", question: "¿Cuántos semitonos separan dos notas enarmónicas?", options: ["0 (mismo sonido)", "1 semitono", "2 semitonos", "Depende del instrumento"], correctIndex: 0, explanation: "Por definición, dos notas enarmónicas tienen el mismo sonido (0 semitonos de diferencia). Solo cambia el nombre escrito." },
  { id: "e09", question: "¿Qué tonalidades son enarmónicas entre sí?", options: ["Fa# Mayor y Solb Mayor", "Re Mayor y Mib Mayor", "La Mayor y Sib Mayor", "Mi Mayor y Fa Mayor"], correctIndex: 0, explanation: "Fa# Mayor (6 sostenidos) = Solb Mayor (6 bemoles). Suenan igual, se escriben distinto." },
  { id: "e10", question: "¿Cuál es el enarmónico de Do#?", options: ["Reb", "Do", "Re", "Dob"], correctIndex: 0, explanation: "Do# y Reb tienen el mismo sonido (1 semitono desde Do)." },
  { id: "e11", question: "¿Cuál es el enarmónico de Lab?", options: ["Sol#", "Sib", "La", "Reb"], correctIndex: 0, explanation: "Lab y Sol# tienen el mismo sonido (8 semitonos desde Do)." },
  { id: "e12", question: "¿La nota Dob es enarmónica de...?", options: ["Si", "Do", "Sib", "Re"], correctIndex: 0, explanation: "Dob = Si (mismo sonido, 11 semitonos desde Do). Se usan en distintas tonalidades pero suenan igual." },
];

export function randomEnarmoniaExercise(): EnarmoniaExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}
