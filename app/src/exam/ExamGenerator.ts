import { randomSyncopationExercise } from "../data/syncopationExercises";
import { randomIntervalExercise } from "../data/intervalExercises";
import { randomScaleExercise } from "../data/scaleExercises";
import { randomKeySignatureExercise } from "../data/keySignatureExercises";
import { buildScale, noteToSpanish } from "../theory/scales";
import { getKeySignature, getRelativeKey } from "../theory/keys";
import type { ExamData, ExamConfig, ExamExercise } from "../theory/types";

function generateSyncopaExercise(num: number): ExamExercise {
  const ex = randomSyncopationExercise();
  return {
    type: "sincopa",
    number: num,
    title: "Síncopa y Contratiempo",
    instructions:
      "Indica encima de cada figura si es: S (síncopa), C (contratiempo), N (normal) o R (silencio).",
    data: { exercise: ex },
    solution: {
      beatTypes: ex.beatTypes,
    },
  };
}

function generateIntervalExercise(num: number): ExamExercise {
  const ex = randomIntervalExercise();
  return {
    type: "intervalos",
    number: num,
    title: "Intervalos",
    instructions: "Escribe el nombre del intervalo (número y calidad) entre las dos notas dadas.",
    data: { exercise: ex },
    solution: { label: ex.label, number: ex.number, quality: ex.quality },
  };
}

function generateScaleExercise(num: number): ExamExercise {
  const config = randomScaleExercise();
  const notes = buildScale(config.tonic, config.scaleType);
  const noteNames = notes.map(noteToSpanish);
  return {
    type: "escalas",
    number: num,
    title: "Escala",
    instructions: `Escribe la escala de ${config.label} en clave de Sol.`,
    data: { config, noteNames },
    solution: { type: config.scaleType, label: config.label, notes: noteNames },
  };
}

function generateKeySignatureExercise(num: number): ExamExercise {
  const ex = randomKeySignatureExercise();
  const ks = getKeySignature(ex.tonic, ex.mode);
  const relative = getRelativeKey(ex.tonic, ex.mode);
  return {
    type: "armadura",
    number: num,
    title: "Armadura",
    instructions:
      "Identifica la tonalidad mayor y menor de la siguiente armadura. Escribe las alteraciones correspondientes.",
    data: { exercise: ex },
    solution: {
      tonic: ex.tonic,
      mode: ex.mode,
      label: ex.label,
      accidentals: ks.accidentals,
      numAccidentals: ks.numAccidentals,
      accidentalType: ks.accidentalType,
      relative: `${relative.tonic} ${relative.mode === "major" ? "mayor" : "menor"}`,
    },
  };
}

const EXERCISE_GENERATORS: Record<string, (num: number) => ExamExercise> = {
  sincopa: generateSyncopaExercise,
  transporte: (num) => ({
    type: "transporte",
    number: num,
    title: "Transporte",
    instructions: "Transporta la melodía indicada una 2ª mayor ascendente.",
    data: {},
    solution: {},
  }),
  compas_tonalidad: (num) => ({
    type: "compas_tonalidad",
    number: num,
    title: "Compás y Tonalidad",
    instructions: "Identifica el compás y la tonalidad del fragmento dado.",
    data: {},
    solution: {},
  }),
  intervalos: generateIntervalExercise,
  completar_compas: (num) => ({
    type: "completar_compas",
    number: num,
    title: "Completar compás",
    instructions: "Completa el compás con las figuras que faltan.",
    data: {},
    solution: {},
  }),
  escalas: generateScaleExercise,
  armadura: generateKeySignatureExercise,
  notas_extranyas: (num) => ({
    type: "notas_extranyas",
    number: num,
    title: "Notas extrañas",
    instructions: "Identifica las notas de adorno y explica su función.",
    data: {},
    solution: {},
  }),
};

const DEFAULT_EXERCISE_ORDER = [
  "sincopa", "transporte", "compas_tonalidad", "intervalos",
  "completar_compas", "escalas", "armadura", "notas_extranyas",
];

export function generateExam(config: ExamConfig): ExamData {
  const exercises: ExamExercise[] = DEFAULT_EXERCISE_ORDER.map((type, i) => {
    const gen = EXERCISE_GENERATORS[type];
    return gen(i + 1);
  });

  return {
    config,
    exercises,
    generatedAt: new Date().toISOString(),
  };
}
