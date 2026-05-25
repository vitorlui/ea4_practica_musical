import { useSearchParams } from "react-router-dom";
import { PageShell } from "./PageShell";
import { StepList } from "../theory/StepList";
import { TheoryTable } from "../theory/TheoryTable";
import type { TheorySection } from "../theory/types";

interface Props {
  title: string;
  bookPages: string;
  theory: TheorySection[];
  children: React.ReactNode;
}

export function TheoryPracticeLayout({ title, bookPages, theory, children }: Props) {
  const [params] = useSearchParams();
  const view = params.get("v") === "teoria" ? "teoria" : "practica";

  return (
    <PageShell title={title}>
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
          📚 {bookPages}
        </span>
        <span className="text-xs text-gray-400">
          {view === "teoria" ? "Teoría" : "Práctica"}
        </span>
      </div>

      {view === "teoria" ? (
        <div className="space-y-5">
          {theory.map((section) => (
            <div key={section.id} className="space-y-4">
              {section.title && (
                <h3 className="text-base font-semibold text-gray-800">{section.title}</h3>
              )}
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
          ))}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </PageShell>
  );
}
