import React from "react";
import { useLayout } from "./LayoutContext";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  const { sidebarOpen } = useLayout();

  return (
    <main
      className={[
        "min-h-screen pt-14 transition-all duration-200",
        sidebarOpen ? "lg:pl-56" : "",
      ].join(" ")}
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
        {children}
      </div>
    </main>
  );
}
