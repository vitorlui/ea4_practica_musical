export interface CirculoExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const EXERCISES: CirculoExercise[] = [
  {
    id: "cq01",
    question: "¿Cuántos sostenidos tiene la tonalidad de Re Mayor?",
    options: ["1 sostenido (Fa♯)", "2 sostenidos (Fa♯, Do♯)", "3 sostenidos (Fa♯, Do♯, Sol♯)", "Ninguno"],
    correctIndex: 1,
    explanation: "Re Mayor tiene 2♯: Fa♯ y Do♯. En el círculo, Re está 2 posiciones a la derecha de Do.",
  },
  {
    id: "cq02",
    question: "¿En qué dirección se gira en el círculo para añadir sostenidos?",
    options: ["Hacia la izquierda (sentido antihorario)", "Hacia la derecha (sentido horario)", "Hacia arriba", "Hacia abajo"],
    correctIndex: 1,
    explanation: "Girando a la derecha (sentido horario) se añade un sostenido en cada paso: Do→Sol→Re→La… La tónica sube una 5ª justa.",
  },
  {
    id: "cq03",
    question: "¿Cuál es la tonalidad relativa menor de Sol Mayor?",
    options: ["Re menor", "Si menor", "Mi menor", "La menor"],
    correctIndex: 2,
    explanation: "La relativa menor está una 3ª menor por debajo de la mayor. Sol - 3ª menor = Mi. Por eso Mi menor (1♯) comparte armadura con Sol Mayor.",
  },
  {
    id: "cq04",
    question: "Si subes una 5ª justa desde Fa, ¿qué tonalidad obtienes?",
    options: ["Do", "Si♭", "Re♭", "Sol"],
    correctIndex: 0,
    explanation: "5ª justa sobre Fa: Fa(1)-Sol(2)-La(3)-Si♭(4)-Do(5). La respuesta es Do. Por eso Fa está a la izquierda de Do en el círculo.",
  },
  {
    id: "cq05",
    question: "¿Cuántos bemoles tiene Mi♭ Mayor?",
    options: ["2 bemoles", "3 bemoles", "4 bemoles", "5 bemoles"],
    correctIndex: 1,
    explanation: "Mi♭ Mayor tiene 3♭: Si♭, Mi♭ y La♭. En el círculo está 3 posiciones a la izquierda de Do.",
  },
  {
    id: "cq06",
    question: "¿Cuál es el primer sostenido que aparece en todas las armaduras con sostenidos?",
    options: ["Do♯", "Sol♯", "Fa♯", "Re♯"],
    correctIndex: 2,
    explanation: "El orden de los sostenidos es Fa-Do-Sol-Re-La-Mi-Si. Fa♯ siempre es el primero, aparece desde Sol Mayor (1♯).",
  },
  {
    id: "cq07",
    question: "¿Qué intervalo se usa para construir el círculo hacia la derecha (sentido horario)?",
    options: ["4ª justa ascendente", "5ª justa ascendente", "2ª mayor ascendente", "3ª menor ascendente"],
    correctIndex: 1,
    explanation: "Cada paso a la derecha (horario) sube una 5ª justa: Do→Sol→Re→La→Mi→Si… Por eso se llama 'círculo de quintas'.",
  },
  {
    id: "cq08",
    question: "¿Qué tonalidades son enarmónicas (mismo sonido, distinta escritura) en el fondo del círculo?",
    options: ["Sol Mayor y Sol menor", "Fa♯ Mayor y Sol♭ Mayor", "Re♭ Mayor y Re Mayor", "Mi♭ Mayor y Mi Mayor"],
    correctIndex: 1,
    explanation: "En el fondo del círculo, Fa♯ Mayor (6♯) y Sol♭ Mayor (6♭) suenan exactamente igual pero se escriben de forma distinta. Son enarmónicas.",
  },
  {
    id: "cq09",
    question: "¿Cuál es la tónica que resulta de bajar una 5ª justa desde Do?",
    options: ["Sol", "Fa", "Si♭", "Re"],
    correctIndex: 1,
    explanation: "Bajar una 5ª justa desde Do: Do(1)-Si(2)-La(3)-Sol(4)-Fa(5). La respuesta es Fa. Por eso Fa está a la izquierda de Do y añade 1 bemol (Si♭).",
  },
  {
    id: "cq10",
    question: "¿Cuál es el último bemol que aparece en la armadura de La♭ Mayor (4 bemoles)?",
    options: ["Si♭", "Mi♭", "La♭", "Re♭"],
    correctIndex: 3,
    explanation: "Los 4 bemoles de La♭ Mayor son: Si♭, Mi♭, La♭ y Re♭ (en ese orden). El último (4º) es Re♭. La tónica (La♭) es el penúltimo bemol.",
  },
];

export function randomCirculoExercise(): CirculoExercise {
  return EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
}

export { EXERCISES as ALL_CIRCULO_EXERCISES };
