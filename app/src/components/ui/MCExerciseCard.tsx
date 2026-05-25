import { useState, useCallback } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface Props {
  question: string;
  stimulus?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  streak: number;
  onNext: () => void;
  onAnswer?: (correct: boolean) => void;
}

export function MCExerciseCard({ question, stimulus, options, correctIndex, explanation, streak, onNext, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const answered = selected !== null;
  const isCorrect = selected === correctIndex;

  const handleSelect = useCallback((i: number) => {
    if (!answered) {
      setSelected(i);
      onAnswer?.(i === correctIndex);
    }
  }, [answered, correctIndex, onAnswer]);

  const handleNext = useCallback(() => {
    setSelected(null);
    onNext();
  }, [onNext]);

  return (
    <div className="space-y-4">
      {streak > 1 && (
        <div>
          <Badge color="correct">Racha: {streak} correctas</Badge>
        </div>
      )}

      <Card title="Ejercicio">
        <p className="text-sm text-gray-700 font-medium mb-1">{question}</p>
        {stimulus && <p className="text-xs text-gray-500 mb-3">{stimulus}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {options.map((opt, i) => {
            let cls = "w-full text-left px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ";
            if (!answered) {
              cls += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
            } else if (i === correctIndex) {
              cls += "border-green-500 bg-green-50 text-green-800";
            } else if (i === selected) {
              cls += "border-red-400 bg-red-50 text-red-700";
            } else {
              cls += "border-gray-100 bg-gray-50 text-gray-400";
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
                <span className="font-bold mr-2 text-xs">{String.fromCharCode(65 + i)}.</span>{opt}
              </button>
            );
          })}
        </div>
      </Card>

      {answered && (
        <Card>
          <div className="space-y-2">
            <Badge color={isCorrect ? "correct" : "incorrect"}>
              {isCorrect ? "Correcto" : "Incorrecto"}
            </Badge>
            <p className="text-sm text-gray-700">{explanation}</p>
          </div>
          <Button onClick={handleNext} variant="primary" className="mt-3">
            Siguiente
          </Button>
        </Card>
      )}
    </div>
  );
}
