import { Link } from "react-router-dom";
import { PageShell } from "../components/layout";
import logoSindicat from "/logo-sindicat.jpg";

interface ExerciseCard {
  to: string;
  label: string;
  description: string;
  icon: string;
  unitat: string;
}

const EXERCISES: ExerciseCard[] = [
  { to: "/sincopas",         label: "Síncopas y Contratiempos", description: "Identifica síncopas y contratiempos en fragmentos rítmicos",      icon: "🎵", unitat: "U1"   },
  { to: "/transporte",       label: "Transporte",               description: "Transporta melodías a 2ª mayor, 3ª menor, 4ª justa…",             icon: "🎺", unitat: "U1"   },
  { to: "/completar-compas", label: "Completar compás",         description: "Completa compases con las figuras correctas",                     icon: "✏️", unitat: "U1"   },
  { to: "/compas-tonalidad", label: "Compás y Tonalidad",       description: "Identifica el compás y la tonalidad de fragmentos musicales",     icon: "🎼", unitat: "U2–4" },
  { to: "/armadura",         label: "Armadura",                 description: "Reconoce armaduras y sus tonalidades mayor/menor",                icon: "🔑", unitat: "U3–4" },
  { to: "/circulo-quintas",  label: "Círculo de Quintas",       description: "Organización tonal de las 12 tonalidades ordenadas por quintas",     icon: "⭕", unitat: "U3–4" },
  { to: "/notas-extranyas",  label: "Notas extrañas",           description: "Identifica notas de paso, bordaduras y apoyaturas",              icon: "🎶", unitat: "U5"   },
  { to: "/escalas",          label: "Escalas",                  description: "Identifica escalas mayor, menor natural y armónica",             icon: "🎹", unitat: "U6–7" },
  { to: "/grados-tonales",   label: "Grados tonales",           description: "I–VII: tónica, dominante, sensible y sus funciones",             icon: "🏛️", unitat: "U7"   },
  { to: "/intervalos",       label: "Intervalos",               description: "Clasifica intervalos por número, calidad y consonancia",         icon: "📏", unitat: "U8"   },
  { to: "/enarmonia",        label: "Enarmonía",                description: "Reconoce notas enarmónicas y tonalidades equivalentes",          icon: "↔️", unitat: "U8"   },
  { to: "/acordes",          label: "Acordes perfectos",        description: "Identifica tríadas perfectas mayores y menores",                 icon: "🎸", unitat: "U9"   },
  { to: "/semitono",         label: "Semitono",                 description: "Distingue semitonos diatónicos y cromáticos",                    icon: "½",  unitat: "U9"   },
  { to: "/notas-adorno",     label: "Notas de adorno",          description: "Apoiatura, mordente, grupeto, trino y arpejo",                   icon: "✨", unitat: "U10"  },
];

export default function HomePage() {
  return (
    <PageShell title="Practicador EA4 — Lenguaje Musical">
      <div className="space-y-6">

        {/* Welcome banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl overflow-hidden flex flex-col sm:flex-row items-stretch">
          <div className="sm:w-44 shrink-0 bg-white flex items-center justify-center p-3">
            <img
              src={logoSindicat}
              alt="Sindicat d'Estudiants de Música"
              className="w-36 h-36 object-cover rounded-xl"
            />
          </div>
          <div className="px-6 py-5 flex flex-col justify-center">
            <h2 className="text-lg font-bold text-indigo-800 mb-1">Sindicat d'Estudiants de Música</h2>
            <p className="text-indigo-700 text-sm font-medium mb-2">EA4 — Practicador de Lenguaje Musical</p>
            <p className="text-indigo-600 text-sm leading-relaxed">
              Practica los 13 bloques temáticos del examen de Lenguaje Musical de 4º curso.
              Teoría con pentagramas, ejercicios interactivos y corrección inmediata.
            </p>
          </div>
        </div>

        {/* Exercise grid — all 13 topics in book order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {EXERCISES.map((ex) => (
            <Link
              key={ex.to}
              to={`${ex.to}?v=practica`}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{ex.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 rounded px-1.5 py-0.5 shrink-0">
                      {ex.unitat}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 leading-tight">
                      {ex.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{ex.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Exam link */}
        <Link
          to="/examen"
          className="block bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">📄</span>
            <div>
              <h3 className="text-lg font-bold">Generar Examen Aleatorio</h3>
              <p className="text-indigo-200 text-sm">
                Crea un examen completo tipo EA4 con PDF imprimible y hoja de soluciones
              </p>
            </div>
          </div>
        </Link>
      </div>
    </PageShell>
  );
}
