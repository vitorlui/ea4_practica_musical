import { useState } from "react";

/* ── geometry constants ─────────────────────────────────────────────── */
const CX = 255, CY = 255;
const R_OUT = 243;   // outer edge of major ring
const R_MID = 172;   // major / minor boundary
const R_INN = 104;   // inner edge of minor ring
const R_CTR = 68;    // center circle

const toRad = (d: number) => (d * Math.PI) / 180;
const fmt   = (n: number) => n.toFixed(2);

function sectorPath(r1: number, r2: number, a1: number, a2: number): string {
  const x1 = CX + r2 * Math.cos(toRad(a1)), y1 = CY + r2 * Math.sin(toRad(a1));
  const x2 = CX + r2 * Math.cos(toRad(a2)), y2 = CY + r2 * Math.sin(toRad(a2));
  const x3 = CX + r1 * Math.cos(toRad(a2)), y3 = CY + r1 * Math.sin(toRad(a2));
  const x4 = CX + r1 * Math.cos(toRad(a1)), y4 = CY + r1 * Math.sin(toRad(a1));
  return [
    `M ${fmt(x1)},${fmt(y1)}`,
    `A ${r2},${r2} 0 0,1 ${fmt(x2)},${fmt(y2)}`,
    `L ${fmt(x3)},${fmt(y3)}`,
    `A ${r1},${r1} 0 0,0 ${fmt(x4)},${fmt(y4)}`,
    "Z",
  ].join(" ");
}

function mid(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

/* ── slice data ─────────────────────────────────────────────────────── */
interface Slice {
  major: string;
  minor: string;
  accLabel: string;  // "2♯", "3♭", "0"
  accNames: string;  // names of accidentals
  scaleMaj: string;  // major scale notes
  scaleMin: string;  // natural minor scale notes
  enhar?: string;    // enharmonic label e.g. "= Sol♭"
}

const SLICES: Slice[] = [
  { major: "Do",   minor: "lam",    accLabel: "0",   accNames: "—",
    scaleMaj: "Do Re Mi Fa Sol La Si",
    scaleMin: "La Si Do Re Mi Fa Sol" },
  { major: "Sol",  minor: "mim",    accLabel: "1♯",  accNames: "Fa♯",
    scaleMaj: "Sol La Si Do Re Mi Fa♯",
    scaleMin: "Mi Fa♯ Sol La Si Do Re" },
  { major: "Re",   minor: "sim",    accLabel: "2♯",  accNames: "Fa♯ Do♯",
    scaleMaj: "Re Mi Fa♯ Sol La Si Do♯",
    scaleMin: "Si Do♯ Re Mi Fa♯ Sol La" },
  { major: "La",   minor: "fa♯m",  accLabel: "3♯",  accNames: "Fa♯ Do♯ Sol♯",
    scaleMaj: "La Si Do♯ Re Mi Fa♯ Sol♯",
    scaleMin: "Fa♯ Sol♯ La Si Do♯ Re Mi" },
  { major: "Mi",   minor: "do♯m",  accLabel: "4♯",  accNames: "Fa♯ Do♯ Sol♯ Re♯",
    scaleMaj: "Mi Fa♯ Sol♯ La Si Do♯ Re♯",
    scaleMin: "Do♯ Re♯ Mi Fa♯ Sol♯ La Si" },
  { major: "Si",   minor: "sol♯m", accLabel: "5♯",  accNames: "Fa♯ Do♯ Sol♯ Re♯ La♯",
    scaleMaj: "Si Do♯ Re♯ Mi Fa♯ Sol♯ La♯",
    scaleMin: "Sol♯ La♯ Si Do♯ Re♯ Mi Fa♯",
    enhar: "= Do♭" },
  { major: "Fa♯",  minor: "re♯m",  accLabel: "6♯",  accNames: "Fa♯ Do♯ Sol♯ Re♯ La♯ Mi♯",
    scaleMaj: "Fa♯ Sol♯ La♯ Si Do♯ Re♯ Mi♯",
    scaleMin: "Re♯ Mi♯ Fa♯ Sol♯ La♯ Si Do♯",
    enhar: "= Sol♭" },
  { major: "Re♭",  minor: "si♭m",  accLabel: "5♭",  accNames: "Si♭ Mi♭ La♭ Re♭ Sol♭",
    scaleMaj: "Re♭ Mi♭ Fa Sol♭ La♭ Si♭ Do",
    scaleMin: "Si♭ Do Re♭ Mi♭ Fa Sol♭ La♭",
    enhar: "= Do♯" },
  { major: "La♭",  minor: "fam",   accLabel: "4♭",  accNames: "Si♭ Mi♭ La♭ Re♭",
    scaleMaj: "La♭ Si♭ Do Re♭ Mi♭ Fa Sol",
    scaleMin: "Fa Sol La♭ Si♭ Do Re♭ Mi♭" },
  { major: "Mi♭",  minor: "dom",   accLabel: "3♭",  accNames: "Si♭ Mi♭ La♭",
    scaleMaj: "Mi♭ Fa Sol La♭ Si♭ Do Re",
    scaleMin: "Do Re Mi♭ Fa Sol La♭ Si♭" },
  { major: "Si♭",  minor: "solm",  accLabel: "2♭",  accNames: "Si♭ Mi♭",
    scaleMaj: "Si♭ Do Re Mi♭ Fa Sol La",
    scaleMin: "Sol La Si♭ Do Re Mi♭ Fa" },
  { major: "Fa",   minor: "rem",   accLabel: "1♭",  accNames: "Si♭",
    scaleMaj: "Fa Sol La Si♭ Do Re Mi",
    scaleMin: "Re Mi Fa Sol La Si♭ Do" },
];

/* ── color scheme (index 0..11) ─────────────────────────────────────── */
const MAJOR_FILL  = ["#f1f5f9","#fef9c3","#fef08a","#fde047","#fbbf24","#f59e0b","#92400e","#93c5fd","#60a5fa","#3b82f6","#1d4ed8","#bfdbfe"];
const MINOR_FILL  = ["#f8fafc","#fefce8","#fefce8","#fef9c3","#fef3c7","#fef3c7","#78350f","#dbeafe","#bfdbfe","#93c5fd","#3b82f6","#eff6ff"];
const MAJOR_TEXT  = ["#1e293b","#78350f","#78350f","#78350f","#78350f","#78350f","#fef9c3","#1e3a5f","#1e3a5f","#ffffff","#ffffff","#1e3a5f"];
const MINOR_TEXT  = ["#64748b","#a16207","#a16207","#a16207","#92400e","#92400e","#fef3c7","#2563eb","#1d4ed8","#dbeafe","#bfdbfe","#2563eb"];

/* ── component ──────────────────────────────────────────────────────── */
export function CircleOfFifthsRenderer() {
  const [selected, setSelected] = useState<number | null>(null);

  const sel = selected !== null ? SLICES[selected] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 510 510"
        width="100%"
        style={{ maxWidth: 480 }}
        className="select-none"
      >
        {/* ── background white circle ────────────────────────── */}
        <circle cx={CX} cy={CY} r={R_OUT} fill="white" stroke="#cbd5e1" strokeWidth="1" />

        {/* ── slices ─────────────────────────────────────────── */}
        {SLICES.map((sl, i) => {
          const ca  = i * 30 - 90;          // center angle (degrees)
          const a1  = ca - 15, a2 = ca + 15; // sector boundaries
          const rMaj = (R_OUT + R_MID) / 2;
          const rMin = (R_MID + R_INN) / 2;
          const pMaj = mid(rMaj, ca);
          const pMin = mid(rMin, ca);
          const isSelected = selected === i;
          const stroke = isSelected ? "#4338ca" : "#cbd5e1";
          const sw     = isSelected ? 2 : 0.5;

          return (
            <g key={i} onClick={() => setSelected(selected === i ? null : i)} style={{ cursor: "pointer" }}>
              {/* major ring */}
              <path
                d={sectorPath(R_MID, R_OUT, a1, a2)}
                fill={MAJOR_FILL[i]}
                stroke={stroke}
                strokeWidth={sw}
                opacity={isSelected ? 1 : 0.92}
              />
              {/* minor ring */}
              <path
                d={sectorPath(R_INN, R_MID, a1, a2)}
                fill={MINOR_FILL[i]}
                stroke={stroke}
                strokeWidth={sw}
                opacity={isSelected ? 1 : 0.92}
              />

              {/* major key label */}
              <text
                x={pMaj.x} y={pMaj.y - 6}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={15} fontWeight="bold" fill={MAJOR_TEXT[i]}
                style={{ pointerEvents: "none" }}
              >
                {sl.major}
              </text>
              {sl.enhar && (
                <text
                  x={pMaj.x} y={pMaj.y + 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fill={MAJOR_TEXT[i]} opacity={0.8}
                  style={{ pointerEvents: "none" }}
                >
                  {sl.enhar}
                </text>
              )}

              {/* minor key label */}
              <text
                x={pMin.x} y={pMin.y - 5}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={11} fill={MINOR_TEXT[i]}
                style={{ pointerEvents: "none" }}
              >
                {sl.minor}
              </text>
              {/* accidentals count */}
              <text
                x={pMin.x} y={pMin.y + 9}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={9} fill={MINOR_TEXT[i]} opacity={0.85}
                style={{ pointerEvents: "none" }}
              >
                {sl.accLabel}
              </text>
            </g>
          );
        })}

        {/* ── separator lines ─────────────────────────────────── */}
        {SLICES.map((_, i) => {
          const a = toRad(i * 30 - 90 - 15);
          return (
            <line
              key={`sep-${i}`}
              x1={fmt(CX + R_INN * Math.cos(a))} y1={fmt(CY + R_INN * Math.sin(a))}
              x2={fmt(CX + R_OUT * Math.cos(a))} y2={fmt(CY + R_OUT * Math.sin(a))}
              stroke="#cbd5e1" strokeWidth="0.5"
            />
          );
        })}

        {/* ── center circle ───────────────────────────────────── */}
        <circle cx={CX} cy={CY} r={R_CTR} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <text x={CX} y={CY - 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#4338ca">Círculo</text>
        <text x={CX} y={CY + 8} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#4338ca">de 5ªs</text>

        {/* ── outer ring labels: # / b direction arrows ─────── */}
        <text x={CX + 60} y={20} textAnchor="middle" fontSize={10} fill="#d97706" fontWeight="600">↻ +♯</text>
        <text x={CX - 60} y={20} textAnchor="middle" fontSize={10} fill="#2563eb" fontWeight="600">↺ +♭</text>
      </svg>

      {/* ── info panel ──────────────────────────────────────────── */}
      {sel ? (
        <div className="w-full max-w-md bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-indigo-800">{sel.major} Mayor</span>
              <span className="text-gray-500 mx-2">/</span>
              <span className="text-base font-semibold text-indigo-600">{sel.minor} menor</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <dt className="text-gray-500 font-medium">Alteraciones</dt>
            <dd className="font-semibold text-gray-800">{sel.accLabel === "0" ? "Ninguna" : sel.accLabel}</dd>
            <dt className="text-gray-500 font-medium">Nombres</dt>
            <dd className="font-semibold text-gray-800">{sel.accNames}</dd>
            <dt className="text-gray-500 font-medium">Escala mayor</dt>
            <dd className="font-semibold text-indigo-700">{sel.scaleMaj}</dd>
            <dt className="text-gray-500 font-medium">Escala menor</dt>
            <dd className="font-semibold text-blue-700">{sel.scaleMin}</dd>
            {sel.enhar && (
              <>
                <dt className="text-gray-500 font-medium">Enarmónica</dt>
                <dd className="font-semibold text-purple-700">{sel.major} Mayor {sel.enhar} Mayor</dd>
              </>
            )}
          </dl>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Haz clic en cualquier tonalidad para ver su escala y alteraciones</p>
      )}
    </div>
  );
}
