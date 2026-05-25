import { useState } from "react";
import { PageShell } from "../components/layout";
import { Card } from "../components/ui";

interface TheorySection {
  id: string;
  title: string;
  content: string[];
}

const THEORY_SECTIONS: TheorySection[] = [
  {
    id: "sincopa",
    title: "Síncopa y Contratiempo",
    content: [
      "Síncopa: nota que comienza en parte o fracción débil del compás y se prolonga ocupando la parte o fracción fuerte siguiente, ya sea por ligadura o por su propio valor.",
      "Contratiempo: nota breve que ocupa la parte o fracción débil del tiempo, sin prolongarse al tiempo fuerte. No hay ligadura.",
      "Regla práctica: si una nota empieza en tiempo débil y 'atraviesa' el tiempo fuerte → síncopa. Si empieza en tiempo débil y acaba antes del tiempo fuerte → contratiempo.",
    ],
  },
  {
    id: "intervalos",
    title: "Intervalos",
    content: [
      "Número del intervalo: contar las notas incluyendo las dos extremas (Do→Sol = 5ª).",
      "Calidad del intervalo: depende de los semitonos: 2ª mayor (2st), 2ª menor (1st), 3ª mayor (4st), 3ª menor (3st), 4ª justa (5st), 4ª aumentada (6st), 5ª justa (7st), 5ª disminuida (6st), 6ª mayor (9st), 6ª menor (8st), 7ª mayor (11st), 7ª menor (10st), 8ª justa (12st).",
      "Intervalos consonantes: unísono, 3ª, 5ª, 6ª, 8ª. Disonantes: 2ª, 4ª (excepto con el bajo), 7ª.",
    ],
  },
  {
    id: "tonalidades",
    title: "Tonalidades y Armaduras",
    content: [
      "Sostenidos: el orden es Fa, Do, Sol, Re, La, Mi, Si. Regla: la tónica mayor está una 2ª menor encima del último sostenido.",
      "Bemoles: el orden es Si, Mi, La, Re, Sol, Do, Fa. Regla: la tónica mayor es el penúltimo bemol.",
      "Tonalidades relativas: la menor relativa está una 3ª menor por debajo de la mayor (Do mayor → La menor, Sol mayor → Mi menor, etc.).",
      "Tonalidades enarmónicas: Fa# mayor = Solb mayor (6 sostenidos = 6 bemoles).",
    ],
  },
  {
    id: "escalas",
    title: "Escalas",
    content: [
      "Escala mayor: T-T-S-T-T-T-S (T=tono=2 semitonos, S=semitono=1 semitono).",
      "Escala menor natural: T-S-T-T-S-T-T.",
      "Escala menor armónica: T-S-T-T-S-T+S-S (sube el 7º grado medio tono = sensible).",
      "Escala menor melódica (ascendente): T-S-T-T-T-T-S (sube los grados 6º y 7º).",
    ],
  },
  {
    id: "compases",
    title: "Compases",
    content: [
      "Compases simples: el numerador indica el número de tiempos; el denominador indica qué figura vale un tiempo. Ej: 2/4 = 2 tiempos de negra.",
      "Compases compuestos: el numerador es múltiplo de 3; cada tiempo se divide en 3 partes. Ej: 6/8 = 2 tiempos de negra con puntillo.",
      "Correspondencia: 2/4 ↔ 6/8, 3/4 ↔ 9/8, 4/4 ↔ 12/8.",
      "Equivalencia: 1 redonda = 2 blancas = 4 negras = 8 corcheas = 16 semicorcheas. Puntillo añade la mitad del valor.",
    ],
  },
];

export default function TheoryPage() {
  const [openSection, setOpenSection] = useState<string | null>("sincopa");

  return (
    <PageShell title="Teoría — Resumen EA4">
      <div className="space-y-3">
        {THEORY_SECTIONS.map((section) => (
          <Card key={section.id}>
            <button
              className="w-full flex items-center justify-between text-left gap-2"
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              aria-expanded={openSection === section.id}
            >
              <h3 className="text-base font-semibold text-gray-800">{section.title}</h3>
              <span className="text-gray-400 text-xl leading-none">
                {openSection === section.id ? "−" : "+"}
              </span>
            </button>
            {openSection === section.id && (
              <ul className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                {section.content.map((line, i) => (
                  <li key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                    <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
