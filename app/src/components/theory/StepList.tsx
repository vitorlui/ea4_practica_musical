import { VexFlowRenderer } from "../music/VexFlowRenderer";
import type { TheoryStep } from "./types";

interface Props {
  steps: TheoryStep[];
}

export function StepList({ steps }: Props) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li
          key={i}
          className={[
            "flex gap-3 rounded-lg p-3",
            step.highlight ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50",
          ].join(" ")}
        >
          <span
            className={[
              "flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5",
              step.highlight
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-500",
            ].join(" ")}
          >
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className={["text-sm font-semibold mb-0.5", step.highlight ? "text-indigo-800" : "text-gray-800"].join(" ")}>
              {step.title}
            </p>
            <p className={["text-sm leading-relaxed", step.highlight ? "text-indigo-700" : "text-gray-600"].join(" ")}>
              {step.body}
            </p>
            {step.staffExample && (
              <div className="mt-3 overflow-x-auto">
                <VexFlowRenderer
                  notes={step.staffExample.notes}
                  keySignature={step.staffExample.keySignature ?? "C"}
                  timeSignature={step.staffExample.timeSignature ?? ""}
                  width={step.staffExample.width ?? 340}
                  height={step.staffExample.height ?? 130}
                />
                {step.staffExample.caption && (
                  <p className="text-xs text-gray-500 text-center mt-1 italic">
                    {step.staffExample.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
