import { Link } from "react-router-dom";
import { PageShell } from "../components/layout";

interface ExerciseCard {
  to: string;
  number: string;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

const EXERCISES: ExerciseCard[] = [
  { to: "/sincopas", number: "1", title: "Síncopas", description: "Identifica síncopas y contratiempos en fragmentos rítmicos", icon: "🎵", available: true },
  { to: "/transporte", number: "2", title: "Transporte", description: "Transporta melodías a 2ª mayor y 3ª menor", icon: "🎺", available: false },
  { to: "/compas-tonalidad", number: "3", title: "Compás y Tonalidad", description: "Identifica el compás y la tonalidad de fragmentos musicales", icon: "🎼", available: false },
  { to: "/intervalos", number: "4", title: "Intervalos", description: "Clasifica intervalos por número y calidad", icon: "📏", available: true },
  { to: "/completar-compas", number: "5", title: "Completar compás", description: "Completa compases con las figuras correctas", icon: "✏️", available: false },
  { to: "/escalas", number: "6", title: "Escalas", description: "Identifica escalas mayores, menores naturales y armónicas", icon: "🎹", available: true },
  { to: "/armadura", number: "7", title: "Armadura", description: "Reconoce armaduras y sus tonalidades", icon: "🔑", available: true },
  { to: "/notas-extranyas", number: "8", title: "Notas extrañas", description: "Identifica notas de adorno y su función", icon: "🎶", available: false },
];

export default function HomePage() {
  return (
    <PageShell title="Practicador EA4 — Lenguaje Musical">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-5">
          <h2 className="text-xl font-bold text-indigo-800 mb-1">El Sindicato EA4</h2>
          <p className="text-indigo-600 text-sm">
            Practica los 8 bloques temáticos del examen de Lenguaje Musical de 4º curso.
            Ejercicios interactivos con corrección inmediata y generación de exámenes tipo real.
          </p>
        </div>

        {/* Exercise grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {EXERCISES.map((ex) => (
            <div key={ex.to} className="relative">
              {ex.available ? (
                <Link
                  to={ex.to}
                  className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{ex.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 rounded px-1.5 py-0.5">
                          {ex.number}
                        </span>
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                          {ex.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{ex.description}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="block bg-gray-50 border border-gray-200 rounded-xl p-5 opacity-60">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl grayscale">{ex.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded px-1.5 py-0.5">
                          {ex.number}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">{ex.title}</span>
                        <span className="text-xs text-gray-400 ml-auto">🚧</span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{ex.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
