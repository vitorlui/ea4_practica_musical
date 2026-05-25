import { useLayout } from "./LayoutContext";

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
        src="/logo.jpg"
        alt="Sindicat d'Estudiants de Música"
        className="h-10 w-10 rounded-full object-cover shrink-0 border-2 border-indigo-400"
      />

      <div className="min-w-0 leading-tight">
        <p className="font-bold text-sm sm:text-base tracking-tight leading-none">
          Sindicat d'Estudiants
        </p>
        <p className="text-indigo-200 text-xs leading-tight">
          de Música — EA4
        </p>
      </div>
    </header>
  );
}
