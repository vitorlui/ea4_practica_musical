import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function Card({ title, children, className = "", footer }: CardProps) {
  return (
    <div className={["bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", className].join(" ")}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">{footer}</div>}
    </div>
  );
}
