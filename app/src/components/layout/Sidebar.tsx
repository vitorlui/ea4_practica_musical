import { NavLink } from "react-router-dom";
import { useLayout } from "./LayoutContext";

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const EXAM_ITEMS: NavItem[] = [
  { to: "/sincopas", label: "1. Síncopas", icon: "🎵" },
  { to: "/transporte", label: "2. Transporte", icon: "🎺" },
  { to: "/compas-tonalidad", label: "3. Compás/Tonalidad", icon: "🎼" },
  { to: "/intervalos", label: "4. Intervalos", icon: "📏" },
  { to: "/completar-compas", label: "5. Completar compás", icon: "✏️" },
  { to: "/escalas", label: "6. Escalas", icon: "🎹" },
  { to: "/armadura", label: "7. Armadura", icon: "🔑" },
  { to: "/notas-extranyas", label: "8. Notas extrañas", icon: "🎶" },
];

const EXTRA_THEORY_ITEMS: NavItem[] = [
  { to: "/grados-tonales", label: "Grados tonales", icon: "🏛️" },
  { to: "/enarmonia", label: "Enarmonía", icon: "↔️" },
  { to: "/acordes", label: "Acordes perfectos", icon: "🎸" },
  { to: "/semitono", label: "Semitono diat./crom.", icon: "½" },
  { to: "/notas-adorno", label: "Notas de adorno", icon: "✨" },
];

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  const { closeSidebar } = useLayout();
  return (
    <div>
      <p className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={closeSidebar}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            ].join(" ")
          }
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useLayout();

  return (
    <>
      {sidebarOpen && (
        <div className="no-print fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={[
          "no-print fixed top-14 left-0 z-20 h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-gray-200",
          "transition-transform duration-200 overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <nav className="py-2">
          <NavLink
            to="/"
            end
            onClick={closeSidebar}
            className={({ isActive }) =>
              ["flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span>🏠</span><span>Inicio</span>
          </NavLink>

          <NavGroup label="Ejercicios del examen" items={EXAM_ITEMS} />

          <div className="mx-4 my-2 border-t border-gray-100" />

          <NavGroup label="Teoría adicional" items={EXTRA_THEORY_ITEMS} />

          <div className="mx-4 my-2 border-t border-gray-100" />

          <NavLink
            to="/teoria"
            onClick={closeSidebar}
            className={({ isActive }) =>
              ["flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span>📚</span><span>Teoría general</span>
          </NavLink>

          <NavLink
            to="/examen"
            onClick={closeSidebar}
            className={({ isActive }) =>
              ["flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span>📄</span><span>Examen aleatorio</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
