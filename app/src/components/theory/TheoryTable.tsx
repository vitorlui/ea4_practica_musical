import type { TheoryTable as TheoryTableType, TableCell } from "./types";

const BADGE_STYLES: Record<string, string> = {
  perfecta: "bg-indigo-100 text-indigo-700",
  imperfecta: "bg-blue-100 text-blue-700",
  consonante: "bg-green-100 text-green-700",
  disonante: "bg-red-100 text-red-700",
};

function renderCell(cell: TableCell, key: number) {
  if (typeof cell === "string") {
    return <td key={key} className="px-3 py-2 text-gray-700">{cell}</td>;
  }
  return (
    <td key={key} className="px-3 py-2">
      <span className={["inline-block px-2 py-0.5 rounded text-xs font-semibold", cell.badge ? BADGE_STYLES[cell.badge] : ""].join(" ")}>
        {cell.text}
      </span>
    </td>
  );
}

interface Props {
  table: TheoryTableType;
}

export function TheoryTable({ table }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-gray-50">
              {row.map((cell, ci) => renderCell(cell, ci))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
