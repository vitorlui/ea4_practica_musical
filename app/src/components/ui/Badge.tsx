import React from "react";

type BadgeColor = "correct" | "incorrect" | "missing" | "solution" | "neutral";

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
  className?: string;
}

const COLOR_CLASSES: Record<BadgeColor, string> = {
  correct: "bg-green-100 text-green-800 border-green-300",
  incorrect: "bg-red-100 text-red-800 border-red-300",
  missing: "bg-yellow-100 text-yellow-800 border-yellow-300",
  solution: "bg-blue-100 text-blue-800 border-blue-300",
  neutral: "bg-gray-100 text-gray-700 border-gray-300",
};

export function Badge({ color = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        COLOR_CLASSES[color],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
