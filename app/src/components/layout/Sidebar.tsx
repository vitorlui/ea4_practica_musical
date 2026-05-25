import { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useLayout } from "./LayoutContext";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  unitat: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/sincopas",         label: "Síncopas y Contratiempos", icon: "🎵", unitat: "U1"   },
  { to: "/transporte",       label: "Transporte",               icon: "🎺", unitat: "U1"   },
  { to: "/completar-compas", label: "Completar compás",         icon: "✏️", unitat: "U1"   },
  { to: "/compas-tonalidad", label: "Compás y Tonalidad",       icon: "🎼", unitat: "U2–4" },
  { to: "/armadura",         label: "Armadura",                 icon: "🔑", unitat: "U3–4" },
  { to: "/notas-extranyas",  label: "Notas extrañas",           icon: "🎶", unitat: "U5"   },
  { to: "/escalas",          label: "Escalas",                  icon: "🎹", unitat: "U6–7" },
  { to: "/grados-tonales",   label: "Grados tonales",           icon: "🏛️", unitat: "U7"   },
  { to: "/intervalos",       label: "Intervalos",               icon: "📏", unitat: "U8"   },
  { to: "/enarmonia",        label: "Enarmonía",                icon: "↔️", unitat: "U8"   },
  { to: "/acordes",          label: "Acordes perfectos",        icon: "🎸", unitat: "U9"   },
  { to: "/semitono",         label: "Semitono",                 icon: "½",  unitat: "U9"   },
  { to: "/notas-adorno",     label: "Notas de adorno",          icon: "✨", unitat: "U10"  },
];

const LINK_BASE = "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors";
const ACTIVE_CLS = "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600";
const IDLE_CLS = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
const SUBLINK_BASE = "flex items-center gap-2 pl-12 pr-4 py-1.5 text-xs font-medium transition-colors";

export function Sidebar() {
  const { sidebarOpen, closeSidebar } = useLayout();
  const location = useLocation();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const match = NAV_ITEMS.find((item) => location.pathname === item.to);
    if (match) setExpanded(match.to);
  }, [location.pathname]);

  const currentView = new URLSearchParams(location.search).get("v");

  return (
    <>
      {sidebarOpen && (
        <div className="no-print fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={[
          "no-print fixed top-14 left-0 z-20 h-[calc(100vh-3.5rem)] w-60 bg-white border-r border-gray-200",
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
              [LINK_BASE, isActive ? ACTIVE_CLS : IDLE_CLS].join(" ")
            }
          >
            <span>🏠</span><span>Inicio</span>
          </NavLink>

          <div className="mx-4 my-1.5 border-t border-gray-100" />

          {NAV_ITEMS.map((item) => {
            const isCurrentPath = location.pathname === item.to;
            const isOpen = expanded === item.to;

            return (
              <div key={item.to}>
                <button
                  onClick={() => setExpanded(isOpen ? null : item.to)}
                  className={[
                    LINK_BASE, "w-full text-left justify-between",
                    isCurrentPath ? "text-indigo-700 bg-indigo-50" : IDLE_CLS,
                  ].join(" ")}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="leading-tight truncate">{item.label}</span>
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className="text-[10px] text-gray-400 font-normal">{item.unitat}</span>
                    <span className="text-gray-400 text-xs">{isOpen ? "▾" : "▸"}</span>
                  </span>
                </button>

                {isOpen && (
                  <div className="bg-gray-50 border-l-2 border-indigo-100 ml-4">
                    {(["teoria", "practica"] as const).map((view) => {
                      const isActive = isCurrentPath && currentView === view;
                      return (
                        <Link
                          key={view}
                          to={`${item.to}?v=${view}`}
                          onClick={closeSidebar}
                          className={[
                            SUBLINK_BASE,
                            isActive
                              ? "text-indigo-700 font-semibold bg-indigo-50"
                              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
                          ].join(" ")}
                        >
                          <span>{view === "teoria" ? "📖" : "✏️"}</span>
                          <span>{view === "teoria" ? "Teoría" : "Práctica"}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mx-4 my-1.5 border-t border-gray-100" />

          <NavLink
            to="/teoria"
            onClick={closeSidebar}
            className={({ isActive }) =>
              [LINK_BASE, isActive ? ACTIVE_CLS : IDLE_CLS].join(" ")
            }
          >
            <span>📚</span><span>Teoría general</span>
          </NavLink>

          <NavLink
            to="/examen"
            onClick={closeSidebar}
            className={({ isActive }) =>
              [LINK_BASE, isActive ? ACTIVE_CLS : IDLE_CLS].join(" ")
            }
          >
            <span>📄</span><span>Examen aleatorio</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
