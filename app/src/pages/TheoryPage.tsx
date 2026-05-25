import { useState } from "react";
import { PageShell } from "../components/layout";
import { Card } from "../components/ui";
import { StepList } from "../components/theory/StepList";
import { TheoryTable } from "../components/theory/TheoryTable";
import type { TheorySection } from "../components/theory/types";

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
    title: "Intervalos — Número y Calidad",
    content: [
      "Número del intervalo: contar las notas incluyendo las dos extremas (Do→Sol = 5ª).",
      "Calidad del intervalo: depende de los semitonos: 2ª mayor (2st), 2ª menor (1st), 3ª mayor (4st), 3ª menor (3st), 4ª justa (5st), 4ª aumentada (6st), 5ª justa (7st), 5ª disminuida (6st), 6ª mayor (9st), 6ª menor (8st), 7ª mayor (11st), 7ª menor (10st), 8ª justa (12st).",
      "Pueden ser mayores/menores: 2ª, 3ª, 6ª, 7ª. Suelen ser justos: 4ª, 5ª, 8ª. Aumentado = semitono más que mayor/justo. Disminuido = semitono menos que menor/justo.",
    ],
  },
  {
    id: "consonancia-disonancia",
    title: "Consonancia y Disonancia — Paso a paso",
    steps: [
      {
        title: "¿Qué es la consonancia?",
        body: "Un intervalo consonante produce estabilidad y reposo al oído. No genera tensión armónica: puede 'quedarse' sin necesitar resolver. El oyente lo percibe como completo y estable.",
      },
      {
        title: "¿Qué es la disonancia?",
        body: "Un intervalo disonante produce tensión e inestabilidad. En la música tonal, tiende a moverse ('resolver') hacia una consonancia. No es feo — es energía que busca reposo.",
      },
      {
        title: "Consonancias perfectas",
        body: "Unísono (1ª), 5ª justa, 8ª justa. Máximo reposo. Sonido 'abierto' o 'hueco'. Son tan estables que en la armonía clásica se evita terminar solo en ellas (demasiado vacío).",
      },
      {
        title: "Consonancias imperfectas",
        body: "3ª mayor, 3ª menor, 6ª mayor, 6ª menor. Reposo cálido y pleno. Son las más usadas en la armonía tonal porque suenan completas sin ser rígidas. Los acordes mayores y menores se construyen sobre 3ªs.",
      },
      {
        title: "Intervalos disonantes",
        body: "2ª mayor y menor (alta tensión), 7ª mayor y menor (fuerte tensión, quiere resolver), 4ª justa* (disonante respecto al bajo en armonía clásica), 4ª aumentada y 5ª disminuida — el 'trítono', máxima disonancia, llamado diabolus in musica. Todos los aumentados y disminuidos son disonantes.",
      },
      {
        title: "Regla mnemotécnica para el examen",
        body: "CONSONANTES → 1ª, 3ª, 5ª justa, 6ª, 8ª. DISONANTES → 2ª, 4ª, 7ª (y cualquier aumentado o disminuido excepto la 5ª justa). Memoriza: 'los pares 2–4–7 son disonantes; los impares 1–3–5–6–8 son consonantes'.",
        highlight: true,
      },
    ],
    table: {
      headers: ["Intervalo", "Tipo", "Observación"],
      rows: [
        ["Unísono (1ª)", { text: "Consonancia perfecta", badge: "perfecta" }, "Mismo sonido, máximo reposo"],
        ["2ª mayor / menor", { text: "Disonante", badge: "disonante" }, "Alta tensión, quiere moverse"],
        ["3ª mayor / menor", { text: "Consonancia imperfecta", badge: "imperfecta" }, "Cálida, base de los acordes"],
        ["4ª justa", { text: "Disonante*", badge: "disonante" }, "*Disonante respecto al bajo"],
        ["4ª aum. / 5ª dis.", { text: "Disonante", badge: "disonante" }, "Trítono — diabolus in musica"],
        ["5ª justa", { text: "Consonancia perfecta", badge: "perfecta" }, "Abierta, base de la armonía"],
        ["6ª mayor / menor", { text: "Consonancia imperfecta", badge: "imperfecta" }, "Cálida, inversión de la 3ª"],
        ["7ª mayor / menor", { text: "Disonante", badge: "disonante" }, "Fuerte tensión, resolución necesaria"],
        ["8ª justa", { text: "Consonancia perfecta", badge: "perfecta" }, "Octava, sonido unísono ampliado"],
      ],
    },
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
              <div className="mt-3 border-t border-gray-100 pt-3 space-y-4">
                {section.content && (
                  <ul className="space-y-2">
                    {section.content.map((line, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                        <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.steps && <StepList steps={section.steps} />}
                {section.table && <TheoryTable table={section.table} />}
              </div>
            )}
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
