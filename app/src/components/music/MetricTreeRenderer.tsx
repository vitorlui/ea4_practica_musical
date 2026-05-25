interface MetricTreeRendererProps {
  timeSignature: string;
  width?: number;
  className?: string;
}

type BeatStrength = "F" | "D" | "SF" | "d";

function getBeatStrengths(numBeats: number): BeatStrength[] {
  if (numBeats === 2) return ["F", "D"];
  if (numBeats === 3) return ["F", "D", "D"];
  if (numBeats === 4) return ["F", "D", "SF", "D"];
  return Array.from({ length: numBeats }, (_, i) => (i === 0 ? "F" : "D"));
}

const STRENGTH_COLOR: Record<BeatStrength, string> = {
  F: "#1d4ed8",
  SF: "#7c3aed",
  D: "#6b7280",
  d: "#9ca3af",
};

const STRENGTH_LABEL: Record<BeatStrength, string> = {
  F: "F",
  SF: "SF",
  D: "D",
  d: "d",
};

// Given a parent node's strength, return first-child and second-child strengths
function childStrengths(parent: BeatStrength): [BeatStrength, BeatStrength] {
  // First half inherits parent's label; second half is always weak (d)
  return [parent === "d" ? "d" : parent, "d"];
}

export function MetricTreeRenderer({
  timeSignature,
  width = 520,
  className = "",
}: MetricTreeRendererProps) {
  const [numStr] = timeSignature.split("/");
  const numBeats = parseInt(numStr ?? "4");
  const beatStrengths = getBeatStrengths(numBeats);

  const height = 135;
  const padL = 20;
  const padR = 20;
  const usableW = width - padL - padR;

  // X positions by level
  const beatX   = (i: number) => padL + (i + 0.5) * (usableW / numBeats);
  const subX    = (i: number, h: number) => padL + (i + (h === 0 ? 0.25 : 0.75)) * (usableW / numBeats);
  const lv3X    = (i: number, h: number, q: number) =>
    padL + (i + h * 0.5 + q * 0.25 + 0.125) * (usableW / numBeats);

  // Y layout
  const rootY  = 10;
  const beatY  = 35;
  const subY   = 65;
  const lv3Y   = 95;
  const lv3LblY = lv3Y + 14;

  const rootX = width / 2;

  // Level 2: [beatStrength, "d"] per beat
  const lv2Strengths: BeatStrength[][] = beatStrengths.map((bs) => childStrengths(bs));

  // Level 3: per [beat][half][quarter]
  const lv3Strengths: BeatStrength[][][] = lv2Strengths.map((halves) =>
    halves.map((hs) => childStrengths(hs))
  );

  return (
    <svg
      width={width}
      height={height}
      className={className}
      aria-label="Arbre mètric"
      style={{ display: "block" }}
    >
      {/* Root node */}
      <circle cx={rootX} cy={rootY} r={5} fill="#374151" />
      <text x={rootX} y={rootY - 8} textAnchor="middle" fontSize={9} fill="#374151">
        {timeSignature}
      </text>

      {/* Root → Beat lines */}
      {beatStrengths.map((_, i) => (
        <line key={`rl-${i}`} x1={rootX} y1={rootY} x2={beatX(i)} y2={beatY - 7}
          stroke="#9ca3af" strokeWidth={1} />
      ))}

      {/* Beat nodes (Level 1) */}
      {beatStrengths.map((s, i) => (
        <g key={`b-${i}`}>
          <circle cx={beatX(i)} cy={beatY} r={8} fill={STRENGTH_COLOR[s]} />
          <text x={beatX(i)} y={beatY + 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill="white">
            {STRENGTH_LABEL[s]}
          </text>
        </g>
      ))}

      {/* Beat → Sub lines (Level 1 → Level 2) */}
      {beatStrengths.map((_, i) =>
        [0, 1].map((h) => (
          <line key={`bl-${i}-${h}`} x1={beatX(i)} y1={beatY + 8} x2={subX(i, h)} y2={subY - 5}
            stroke="#d1d5db" strokeWidth={1} />
        ))
      )}

      {/* Sub nodes (Level 2) */}
      {lv2Strengths.map((halves, i) =>
        halves.map((s, h) => (
          <g key={`s-${i}-${h}`}>
            <circle cx={subX(i, h)} cy={subY} r={5} fill={STRENGTH_COLOR[s]} opacity={0.75} />
            <text x={subX(i, h)} y={subY + 4} textAnchor="middle" fontSize={8} fontWeight="bold"
              fill="white" opacity={0.9}>
              {STRENGTH_LABEL[s]}
            </text>
          </g>
        ))
      )}

      {/* Sub → Lv3 lines (Level 2 → Level 3) */}
      {beatStrengths.map((_, i) =>
        [0, 1].map((h) =>
          [0, 1].map((q) => (
            <line key={`sl-${i}-${h}-${q}`}
              x1={subX(i, h)} y1={subY + 5}
              x2={lv3X(i, h, q)} y2={lv3Y - 3}
              stroke="#e5e7eb" strokeWidth={1} />
          ))
        )
      )}

      {/* Level 3 nodes */}
      {lv3Strengths.map((halves, i) =>
        halves.map((quarters, h) =>
          quarters.map((s, q) => (
            <g key={`l3-${i}-${h}-${q}`}>
              <circle cx={lv3X(i, h, q)} cy={lv3Y} r={4} fill={STRENGTH_COLOR[s]} opacity={0.55} />
              <text x={lv3X(i, h, q)} y={lv3LblY} textAnchor="middle" fontSize={7}
                fill={STRENGTH_COLOR[s]}>
                {STRENGTH_LABEL[s]}
              </text>
            </g>
          ))
        )
      )}

      {/* Level labels on the right */}
      <text x={width - 2} y={beatY + 4}  textAnchor="end" fontSize={7} fill="#9ca3af">N1</text>
      <text x={width - 2} y={subY + 4}   textAnchor="end" fontSize={7} fill="#9ca3af">N2</text>
      <text x={width - 2} y={lv3Y + 4}   textAnchor="end" fontSize={7} fill="#9ca3af">N3</text>
    </svg>
  );
}
