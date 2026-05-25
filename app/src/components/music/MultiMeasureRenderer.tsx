import { useEffect, useRef } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  StaveTie,
  Voice,
  Formatter,
  Accidental,
  Annotation,
  Dot,
} from "vexflow";
import type { VexNote } from "./VexFlowRenderer";

export interface MeasureData {
  notes: VexNote[];
  timeSignature?: string; // override per-measure (shown only if differs)
}

interface MultiMeasureRendererProps {
  measures: MeasureData[];
  keySignature?: string;
  timeSignature?: string;   // global time signature (shown on first measure)
  clef?: "treble" | "bass";
  measuresPerRow?: number;
  measureWidth?: number;
  rowHeight?: number;
  topPadding?: number;      // extra space above first staff line for top annotations
  className?: string;
}

function buildDuration(note: VexNote): string {
  let dur = note.duration;
  if (note.isRest) dur += "r";
  if (note.dots === 1) dur += "d";
  return dur;
}

export function MultiMeasureRenderer({
  measures,
  keySignature = "C",
  timeSignature = "4/4",
  clef = "treble",
  measuresPerRow = 2,
  measureWidth = 240,
  rowHeight = 140,
  topPadding = 10,
  className = "",
}: MultiMeasureRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || measures.length === 0) return;
    container.innerHTML = "";

    const numRows = Math.ceil(measures.length / measuresPerRow);
    const firstStaveExtra = 80; // extra width for clef+key+time on first stave
    const svgWidth = measuresPerRow * measureWidth + firstStaveExtra + 20;
    const svgHeight = numRows * rowHeight + topPadding + 10;

    try {
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(svgWidth, svgHeight);
      const ctx = renderer.getContext();

      const [numStr, denomStr] = timeSignature.split("/");
      const numBeats = parseInt(numStr ?? "4");
      const beatValue = parseInt(denomStr ?? "4");

      // pendingTie: carry a note whose tieToNext crosses a barline
      let pendingTieNote: StaveNote | null = null;

      for (let row = 0; row < numRows; row++) {
        let x = 10;
        const y = row * rowHeight + topPadding;

        for (let col = 0; col < measuresPerRow; col++) {
          const mIdx = row * measuresPerRow + col;
          if (mIdx >= measures.length) break;

          const measure = measures[mIdx];
          const isFirstStave = mIdx === 0;
          const isRowStart = col === 0;

          // Extra width only on very first stave
          const w = isFirstStave ? measureWidth + firstStaveExtra : measureWidth;

          const stave = new Stave(x, y, w);
          if (isFirstStave) {
            stave.addClef(clef);
            stave.addKeySignature(keySignature);
            stave.addTimeSignature(measure.timeSignature ?? timeSignature);
          } else if (isRowStart) {
            stave.addClef(clef);
          }
          stave.setContext(ctx).draw();

          if (measure.notes.length > 0) {
            const staveNotes = measure.notes.map((n) => {
              const dur = buildDuration(n);
              const keys = n.isRest
                ? [clef === "treble" ? "b/4" : "d/3"]
                : n.keys;
              const sn = new StaveNote({ keys, duration: dur, clef });
              if (n.dots) Dot.buildAndAttach([sn]);

              (n.accidentals ?? []).forEach((acc, i) => {
                if (acc) sn.addModifier(new Accidental(acc), i);
              });

              (n.annotations ?? []).forEach((text, i) => {
                if (!text) return;
                const ann = new Annotation(text);
                ann.setVerticalJustification(Annotation.VerticalJustify.TOP);
                const color = n.annotationColors?.[i] ?? "#1d4ed8";
                ann.setStyle({ fillStyle: color, strokeStyle: color });
                sn.addModifier(ann, 0);
              });

              (n.bottomAnnotations ?? []).forEach((text, i) => {
                if (!text) return;
                const ann = new Annotation(text);
                ann.setVerticalJustification(Annotation.VerticalJustify.BOTTOM);
                const color = n.bottomAnnotationColors?.[i] ?? "#374151";
                ann.setStyle({ fillStyle: color, strokeStyle: color });
                sn.addModifier(ann, 0);
              });

              return sn;
            });

            const voice = new Voice({ numBeats, beatValue });
            voice.setMode(Voice.Mode.SOFT);
            voice.addTickables(staveNotes);

            const formatWidth = w - (isFirstStave ? firstStaveExtra + 15 : 15);
            new Formatter().joinVoices([voice]).format([voice], formatWidth);
            voice.draw(ctx, stave);

            // Draw cross-barline tie from previous measure
            if (pendingTieNote && staveNotes.length > 0) {
              try {
                const tie = new StaveTie({
                  firstNote: pendingTieNote,
                  lastNote: staveNotes[0],
                  firstIndexes: [0],
                  lastIndexes: [0],
                });
                tie.setContext(ctx).draw();
              } catch (_) { /* ignore tie errors */ }
              pendingTieNote = null;
            }

            // Draw within-measure ties and collect cross-barline tie
            measure.notes.forEach((n, i) => {
              if (!n.tieToNext) return;
              if (i < staveNotes.length - 1) {
                try {
                  const tie = new StaveTie({
                    firstNote: staveNotes[i],
                    lastNote: staveNotes[i + 1],
                    firstIndexes: [0],
                    lastIndexes: [0],
                  });
                  tie.setContext(ctx).draw();
                } catch (_) { /* ignore tie errors */ }
              } else {
                // Tie crosses to next measure
                pendingTieNote = staveNotes[i];
              }
            });
          }

          x += w;
        }
      }
    } catch (err) {
      console.error("MultiMeasureRenderer error:", err);
    }
  }, [measures, keySignature, timeSignature, clef, measuresPerRow, measureWidth, rowHeight]);

  const numRows = Math.ceil(measures.length / measuresPerRow);
  const firstStaveExtra = 80;
  const totalWidth = measuresPerRow * measureWidth + firstStaveExtra + 20;
  const totalHeight = numRows * rowHeight + topPadding + 10;

  return (
    <div
      ref={containerRef}
      className={["overflow-x-auto", className].join(" ")}
      style={{ minWidth: totalWidth, height: totalHeight }}
      aria-label="Notació musical"
    />
  );
}
