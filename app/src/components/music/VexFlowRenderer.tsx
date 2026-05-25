import { useEffect, useRef } from "react";
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental,
  Annotation,
  Dot,
} from "vexflow";

export interface VexNote {
  keys: string[];       // e.g. ["c/4", "e/4"]
  duration: string;     // e.g. "q", "h", "w", "8", "16"
  accidentals?: (string | null)[];  // e.g. ["#", null] per key
  annotations?: string[];           // text labels above each note
  annotationColors?: string[];      // hex colors per annotation
  bottomAnnotations?: string[];     // text labels below each note (e.g. F, D, SF)
  bottomAnnotationColors?: string[];
  isRest?: boolean;
  dots?: number;
  tieToNext?: boolean;              // tie this note to the next (including cross-barline)
  color?: string;                   // note head / stem color (CSS color string)
}

interface VexFlowRendererProps {
  notes: VexNote[];
  timeSignature?: string;  // e.g. "4/4"
  keySignature?: string;   // e.g. "G" or "Bb"
  clef?: "treble" | "bass";
  width?: number;
  height?: number;
  staveY?: number;         // vertical offset of staff within SVG (default 20)
  className?: string;
}

function buildDuration(note: VexNote): string {
  let dur = note.duration;
  if (note.isRest) dur += "r";
  if (note.dots === 1) dur += "d";
  return dur;
}

export function VexFlowRenderer({
  notes,
  timeSignature = "4/4",
  keySignature = "C",
  clef = "treble",
  width = 500,
  height = 150,
  staveY = 20,
  className = "",
}: VexFlowRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    try {
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();

      const staveX = 10;
      const staveWidth = width - 20;

      const stave = new Stave(staveX, staveY, staveWidth);
      stave.addClef(clef);
      stave.addKeySignature(keySignature);
      if (timeSignature) stave.addTimeSignature(timeSignature);
      stave.setContext(context).draw();

      if (notes.length === 0) return;

      const staveNotes = notes.map((n) => {
        const dur = buildDuration(n);
        const keys = n.isRest ? [clef === "treble" ? "b/4" : "d/3"] : n.keys;
        const sn = new StaveNote({ keys, duration: dur, clef });
        if (n.dots) Dot.buildAndAttach([sn]);
        if (n.color) sn.setStyle({ fillStyle: n.color, strokeStyle: n.color });

        if (n.accidentals) {
          n.accidentals.forEach((acc, i) => {
            if (acc) sn.addModifier(new Accidental(acc), i);
          });
        }

        if (n.annotations) {
          n.annotations.forEach((text, i) => {
            if (!text) return;
            const ann = new Annotation(text);
            ann.setVerticalJustification(Annotation.VerticalJustify.TOP);
            const color = n.annotationColors?.[i] ?? "#1d4ed8";
            ann.setStyle({ fillStyle: color, strokeStyle: color });
            sn.addModifier(ann, 0);
          });
        }

        if (n.bottomAnnotations) {
          n.bottomAnnotations.forEach((text, i) => {
            if (!text) return;
            const ann = new Annotation(text);
            ann.setVerticalJustification(Annotation.VerticalJustify.BOTTOM);
            const color = n.bottomAnnotationColors?.[i] ?? "#374151";
            ann.setStyle({ fillStyle: color, strokeStyle: color });
            sn.addModifier(ann, 0);
          });
        }

        return sn;
      });

      const [numStr, denomStr] = (timeSignature || "4/4").split("/");
      const num = parseInt(numStr ?? "4");
      const denom = parseInt(denomStr ?? "4");

      const voice = new Voice({ numBeats: num, beatValue: denom });
      voice.setMode(Voice.Mode.SOFT);
      voice.addTickables(staveNotes);

      new Formatter().joinVoices([voice]).format([voice], staveWidth - 80);
      voice.draw(context, stave);
    } catch (err) {
      console.error("VexFlow render error:", err);
    }
  }, [notes, timeSignature, keySignature, clef, width, height, staveY]);

  return (
    <div
      ref={containerRef}
      className={["overflow-x-auto", className].join(" ")}
      style={{ minWidth: width }}
      aria-label="Notación musical"
    />
  );
}
