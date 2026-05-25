import { useLayout } from "./LayoutContext";
import logoHorizontal from "/logo-horizontal.png";

export function Header() {
  const { toggleSidebar } = useLayout();

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-30 h-14 bg-indigo-700 text-white flex items-center px-4 gap-3 shadow-md">
      <button
        onClick={toggleSidebar}
        aria-label="Menú"
        className="p-1 rounded hover:bg-indigo-600 transition-colors shrink-0"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <img
        src={logoHorizontal}
        alt="El Sindicato EA4 — Lenguaje Musical"
        className="h-10 object-contain"
      />
    </header>
  );
}
