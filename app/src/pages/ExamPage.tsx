import React, { useState, useCallback } from "react";
import { PageShell } from "../components/layout";
import { Card, Button } from "../components/ui";
import { VexFlowRenderer, type VexNote } from "../components/music/VexFlowRenderer";
import { MultiMeasureRenderer } from "../components/music/MultiMeasureRenderer";
import type { MeasureData } from "../components/music/MultiMeasureRenderer";
import { generateExam } from "../exam/ExamGenerator";
import type { ExamData, ExamExercise, ExamConfig } from "../theory/types";

function ExamHeader({ config: _config }: { config: ExamConfig }) {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6">
      <div className="text-center">
        <h1 className="text-lg font-bold">EXAMEN DE LLENGUATGE MUSICAL EA4</h1>
        <p className="text-sm text-gray-600">El Sindicato EA4</p>
      </div>
    </div>
  );
}

function SolutionBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="solution-box mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
      <span className="font-semibold text-blue-700 block mb-2">Solució:</span>
      {children}
    </div>
  );
}

function MultiStaff({ measures, ks, ts }: { measures: MeasureData[]; ks: string; ts: string }) {
  const n = measures.length;
  const perRow = n <= 4 ? n : 4;
  return (
    <div className="overflow-x-auto">
      <MultiMeasureRenderer
        measures={measures}
        keySignature={ks}
        timeSignature={ts}
        measuresPerRow={perRow}
        measureWidth={160}
        rowHeight={160}
      />
    </div>
  );
}

function ExerciseBlock({ exercise, showSolution }: { exercise: ExamExercise; showSolution: boolean }) {
  const data = exercise.data as Record<string, unknown>;
  const sol = exercise.solution as Record<string, unknown>;

  const getMeasures = (src: Record<string, unknown>, key: string) =>
    (src[key] as MeasureData[]) ?? [];
  const str = (src: Record<string, unknown>, key: string) => (src[key] as string) ?? "";

  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-4">
      <h2 className="text-base font-bold mb-1">
        Exercici {exercise.number}: {exercise.title}
      </h2>
      <p className="text-sm text-gray-600 mb-3 italic">{exercise.instructions}</p>

      {/* Question content — hidden in print-solution-only mode */}
      <div className="exam-question-content">

        {/* ── 1. Síncopa ─────────────────────────────────── */}
        {exercise.type === "sincopa" && (
          <MultiStaff
            measures={getMeasures(data, "measures")}
            ks={str(data, "keySignature")}
            ts={str(data, "timeSignature")}
          />
        )}

        {/* ── 2. Transport ───────────────────────────────── */}
        {exercise.type === "transporte" && (() => {
          const intervals = (data.intervals as string[]) ?? [];
          return (
            <>
              <p className="text-xs text-gray-400 mb-1">Original:</p>
              <MultiStaff
                measures={getMeasures(data, "measures")}
                ks={str(data, "keySignature")}
                ts={str(data, "timeSignature")}
              />
              {!showSolution && intervals.map((ivLabel, i) => (
                <div key={i} className="mt-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">
                    Transport {intervals.length > 1 ? `${i + 1} — ` : ""}<strong>{ivLabel}</strong>:
                  </p>
                  <div className="border border-dashed border-gray-300 rounded h-28 bg-gray-50" />
                </div>
              ))}
            </>
          );
        })()}

        {/* ── 3. Anàlisi Mètric-Tonal ────────────────────── */}
        {exercise.type === "compas_tonalidad" && (
          <VexFlowRenderer
            notes={(data.flatNotes as Parameters<typeof VexFlowRenderer>[0]["notes"]) ?? []}
            keySignature={str(data, "keySignature")}
            timeSignature=""
            width={720}
            height={160}
          />
        )}

        {/* ── 4. Intervals ───────────────────────────────── */}
        {exercise.type === "intervalos" && (
          <div className="overflow-x-auto">
            <VexFlowRenderer
              notes={(data.notes as Parameters<typeof VexFlowRenderer>[0]["notes"]) ?? []}
              keySignature="C"
              timeSignature=""
              staveY={50}
              width={850}
              height={160}
            />
          </div>
        )}

        {/* ── 5. Completar compàs ────────────────────────── */}
        {exercise.type === "completar_compas" && (() => {
          type CMItem = { timeSignature: string; questionNotes: VexNote[]; completionNotes: VexNote[] };
          const items = (data.items ?? []) as CMItem[];
          return (
            <div className="grid grid-cols-3 gap-x-4 gap-y-1">
              {items.map((item, i) => (
                <VexFlowRenderer key={i}
                  notes={item.questionNotes}
                  timeSignature={item.timeSignature}
                  keySignature="C"
                  width={250}
                  height={130}
                  staveY={30}
                />
              ))}
            </div>
          );
        })()}

        {/* ── 6. Escales ─────────────────────────────────── */}
        {exercise.type === "escalas" && (
          <div className="overflow-x-auto">
            <VexFlowRenderer
              notes={[]}
              keySignature="C"
              timeSignature=""
              clef="treble"
              width={720}
              height={160}
              staveY={45}
            />
          </div>
        )}

        {/* ── 7. Armadura ────────────────────────────────── */}
        {exercise.type === "armadura" && (() => {
          type KSItem = { vexKey: string; majorLabel: string; minorLabel: string };
          const items = (data.items as KSItem[]) ?? [];
          return (
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <VexFlowRenderer
                    notes={[{ keys: ["b/4"], duration: "wr", isRest: true }]}
                    keySignature={item.vexKey}
                    timeSignature=""
                    width={220}
                    height={110}
                    staveY={20}
                  />
                  <div className="mt-1 w-44 space-y-2">
                    <div className="border-b border-gray-400 h-5" />
                    <div className="border-b border-gray-400 h-5" />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── 8. Notes estranyes ─────────────────────────── */}
        {exercise.type === "notas_extranyas" && (
          <MultiStaff
            measures={getMeasures(data, "measures")}
            ks={str(data, "keySignature")}
            ts={str(data, "timeSignature")}
          />
        )}

        {/* ── 9. Enarmonies ──────────────────────────────── */}
        {exercise.type === "enarmonia" && (() => {
          type EnaItem = { questionNotes: VexNote[] };
          const items = (data.items as EnaItem[]) ?? [];
          return (
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <VexFlowRenderer
                    notes={item.questionNotes}
                    timeSignature=""
                    keySignature="C"
                    width={200}
                    height={120}
                    staveY={25}
                  />
                  <div className="mt-1 w-36 space-y-2">
                    <div className="border-b border-gray-400 h-5" />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── 10. Acords perfectes ───────────────────────── */}
        {exercise.type === "acordes" && (() => {
          type AcordItem = { questionNote: VexNote };
          const items = (data.items as AcordItem[]) ?? [];
          return (
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <VexFlowRenderer
                    notes={[item.questionNote]}
                    timeSignature=""
                    keySignature="C"
                    width={200}
                    height={120}
                    staveY={20}
                  />
                  <div className="mt-1 w-36 space-y-2">
                    <div className="border-b border-gray-400 h-5" />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ── 11. Semitons ───────────────────────────────── */}
        {exercise.type === "semitonos" && (() => {
          type SemItem = { questionNotes: VexNote[] };
          const items = (data.items as SemItem[]) ?? [];
          return (
            <div className="grid grid-cols-3 gap-x-4 gap-y-4">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <VexFlowRenderer
                    notes={item.questionNotes}
                    timeSignature=""
                    keySignature="C"
                    width={200}
                    height={120}
                    staveY={25}
                  />
                  <div className="mt-1 w-36 space-y-2">
                    <div className="border-b border-gray-400 h-5" />
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Answer line */}
        {!showSolution && exercise.type === "compas_tonalidad" && (
          <div className="answer-line mt-3 h-8 border-b border-gray-300 w-64" />
        )}
      </div>

      {/* Solution */}
      {showSolution && (
        <SolutionBox>
          {exercise.type === "sincopa" && (
            <>
              <MultiStaff
                measures={getMeasures(sol, "measures")}
                ks={str(sol, "keySignature")}
                ts={str(sol, "timeSignature")}
              />
              <p className="text-xs text-gray-500 mt-1">
                <span className="text-purple-600 font-bold">&gt;</span> Síncopa &nbsp;
                <span className="text-orange-600 font-bold">+</span> Contratemps
              </p>
              <div className="mt-2 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                <p><strong>Síncopa (S):</strong> figura que comença en temps dèbil (o part dèbil) i es prolonga fins al temps fort següent, desplaçant l'accent rítmic.</p>
                <p><strong>Contratemps (C):</strong> figura que ocupa exclusivament la part dèbil del temps, precedida i seguida de silenci o de la part forta.</p>
              </div>
            </>
          )}

          {exercise.type === "transporte" && (() => {
            type Transposition = { measures: MeasureData[]; keySignature: string; timeSignature: string; label: string };
            const transpositions = (sol.transpositions as Transposition[]) ?? [];
            return (
              <>
                {transpositions.map((t, i) => (
                  <div key={i} className={i > 0 ? "mt-4 pt-3 border-t border-blue-200" : ""}>
                    <p className="text-xs text-gray-500 mb-1">{t.label}</p>
                    <MultiStaff
                      measures={t.measures}
                      ks={t.keySignature}
                      ts={t.timeSignature}
                    />
                  </div>
                ))}
                <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                  <p className="font-semibold text-gray-700">Repàs:</p>
                  <p><strong>Transport:</strong> desplaça tota la melodia un interval concret amunt o avall, mantenint exactament la mateixa estructura d'intervals entre les notes.</p>
                  <p><strong>Armadura:</strong> la nova tonalitat s'obté transposant la tònica original el mateix interval. Ex: Do major + 2ª major superior → Re major (armadura 2#).</p>
                </div>
              </>
            );
          })()}

          {exercise.type === "compas_tonalidad" && (
            <>
              <p className="font-medium mb-1">
                Compàs: <strong>{str(sol, "meterLabel")}</strong> — Tonalitat: <strong>{str(sol, "keyLabel")}</strong>
              </p>
              <div className="mb-2 text-xs space-y-0.5">
                <p><span className="font-semibold" style={{ color: "#1d4ed8" }}>I</span> — {str(sol, "tonicLabel")}</p>
                <p><span className="font-semibold" style={{ color: "#16a34a" }}>IV</span> — {str(sol, "subdominantLabel")}</p>
                <p><span className="font-semibold" style={{ color: "#c2410c" }}>V</span> — {str(sol, "dominantLabel")}</p>
                <p><span className="font-semibold" style={{ color: "#dc2626" }}>VII</span> — {str(sol, "leadingToneLabel")}</p>
              </div>
              <MultiStaff
                measures={getMeasures(sol, "measures")}
                ks={str(sol, "keySignature")}
                ts={str(sol, "timeSignature")}
              />
              <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                <p className="font-semibold text-gray-700">Repàs:</p>
                <p><strong style={{ color: "#1d4ed8" }}>I (Tònica):</strong> 1r grau, centre tonal. Inici i final de la frase.</p>
                <p><strong style={{ color: "#16a34a" }}>IV (Subdominant):</strong> 4t grau (4ª justa ↑ des de I). Contrast, tensió subdominant.</p>
                <p><strong style={{ color: "#c2410c" }}>V (Dominant):</strong> 5è grau (5ª justa ↑ des de I). Prepara la cadència a la tònica.</p>
                <p><strong style={{ color: "#dc2626" }}>VII (Sensible):</strong> 7è grau, 1 semitò per sota de I. Tendència forta a resoldre cap a I.</p>
              </div>
            </>
          )}

          {exercise.type === "intervalos" && (
            <>
              <div className="overflow-x-auto">
                <VexFlowRenderer
                  notes={(sol.notes as Parameters<typeof VexFlowRenderer>[0]["notes"]) ?? []}
                  keySignature="C"
                  timeSignature=""
                  staveY={80}
                  width={850}
                  height={270}
                />
              </div>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                <p className="font-semibold text-gray-700">Repàs:</p>
                <p><strong>Número:</strong> compta totes les notes des de l'inferior fins la superior, inclosos els extrems. Do→Sol = 5ª (Do Re Mi Fa Sol = 5 notes).</p>
                <p><strong>Qualitat:</strong> 2ªm=1ST · 2ªM=1T · 3ªm=1T+½T · 3ªM=2T · 4ªJ=2T+½T · 5ªJ=3T+½T · 6ªm=4T · 6ªM=4T+½T · 7ªm=5T · 7ªM=5T+½T · 8ªJ=6T.</p>
                <p><strong>Conjunt / Disjunt:</strong> interval de 2ª = moviment conjunt (per grau). Interval &gt; 2ª = disjunt (salt).</p>
                <p><strong>Simple / Compost:</strong> fins a 8ª inclusiva = simple. Més gran que una 8ª (9ª, 10ª...) = compost.</p>
              </div>
            </>
          )}

          {exercise.type === "completar_compas" && (() => {
            type CMItem = { timeSignature: string; questionNotes: VexNote[]; completionNotes: VexNote[] };
            const items = (sol.items ?? []) as CMItem[];
            return (
              <>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                  {items.map((item, i) => (
                    <VexFlowRenderer key={i}
                      notes={[...item.questionNotes, ...item.completionNotes]}
                      timeSignature={item.timeSignature}
                      keySignature="C"
                      width={250}
                      height={130}
                      staveY={30}
                    />
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                  <p className="font-semibold text-gray-700">Repàs:</p>
                  <p><strong>Compàs:</strong> numerador = temps per compàs; denominador = figura d'1 temps. Ex: 3/4 = 3 negres; 6/8 = 6 corxeres (2 grups de 3).</p>
                  <p><strong>Punt d'augment:</strong> allarga la nota la meitat del seu valor. Negra amb punt (♩.) = 1½ temps. Corxera amb punt = ¾ temps.</p>
                  <p><strong>Equivalències:</strong> rodona (4) = 2 blanques = 4 negres = 8 corxeres = 16 semicorxeres.</p>
                </div>
              </>
            );
          })()}

          {exercise.type === "escalas" && (
            <>
              <p className="font-medium text-sm mb-2">
                {(sol.notes as string[])?.join(" — ")}
              </p>
              <div className="overflow-x-auto">
                <VexFlowRenderer
                  notes={(sol.vexNotes as VexNote[]) ?? []}
                  keySignature="C"
                  timeSignature=""
                  clef="treble"
                  width={720}
                  height={160}
                  staveY={30}
                />
              </div>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                <p className="font-semibold text-gray-700">Repàs:</p>
                <p><strong>Major:</strong> semitons entre 3r–4t i 7è–8è graus — T·T·ST·T·T·T·ST.</p>
                <p><strong>Menor natural:</strong> semitons entre 2n–3r i 5è–6è graus — T·ST·T·T·ST·T·T.</p>
                <p><strong>Menor harmònica:</strong> com la natural però amb el 7è grau elevat ½ to (sensible), creant interval de 2ª aug entre 6è i 7è.</p>
              </div>
            </>
          )}

          {exercise.type === "armadura" && (() => {
            type KSItem = { vexKey: string; majorLabel: string; minorLabel: string };
            const items = (sol.items as KSItem[]) ?? [];
            return (
              <>
                <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <VexFlowRenderer
                        notes={[{ keys: ["b/4"], duration: "wr", isRest: true }]}
                        keySignature={item.vexKey}
                        timeSignature=""
                        width={220}
                        height={110}
                        staveY={20}
                      />
                      <div className="mt-1 text-center text-xs">
                        <p className="font-semibold text-blue-700">{item.majorLabel}</p>
                        <p className="text-gray-600">Relativa: {item.minorLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                  <p className="font-semibold text-gray-700">Repàs:</p>
                  <p><strong>Ordre dels #:</strong> Fa–Do–Sol–Re–La–Mi–Si. Tonalitat major: última # + 1 semitò ↑. Ex: 2# (Fa#,Do#) → Re major.</p>
                  <p><strong>Ordre dels ♭:</strong> Si–Mi–La–Re–Sol–Do–Fa. Tonalitat major: penúltim ♭. Ex: 3♭ (Si♭,Mi♭,La♭) → Mi♭ major.</p>
                  <p><strong>Relativa menor:</strong> mateixa armadura; tònica 3ª menor per sota de la major (o 6ª major ↑). Ex: Do major → La menor.</p>
                </div>
              </>
            );
          })()}

          {exercise.type === "notas_extranyas" && (
            <>
              <MultiStaff
                measures={getMeasures(sol, "measures")}
                ks={str(sol, "keySignature")}
                ts={str(sol, "timeSignature")}
              />
              <ul className="mt-2 space-y-1">
                {(sol.explanations as string[])?.map((e, i) => (
                  <li key={i} className="text-xs text-gray-700">• {e}</li>
                ))}
              </ul>
              <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                <p className="font-semibold text-gray-700">Repàs:</p>
                <p><strong>Nota de pas (NP):</strong> nota estranys a l'acord que s'intercala entre dues notes de l'acord per moviment de grau conjunt, sense accent mètric.</p>
                <p><strong>Bordadura (B):</strong> nota estranys a l'acord que s'aleja un grau (superior o inferior) d'una nota de l'acord i torna immediatament al mateix grau.</p>
                <p><strong>Apoggiatura (A):</strong> nota d'adorn que es troba en posició accentuada (temps fort), un grau per sobre o per sota de la nota real, i resol per grau conjunt.</p>
              </div>
            </>
          )}

          {exercise.type === "enarmonia" && (() => {
            type EnaItem = { solutionNotes: VexNote[]; enaLabel: string };
            const items = (sol.items as EnaItem[]) ?? [];
            return (
              <>
                <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <VexFlowRenderer
                        notes={item.solutionNotes}
                        timeSignature=""
                        keySignature="C"
                        width={200}
                        height={145}
                        staveY={25}
                      />
                      <p className="text-center text-xs font-semibold text-blue-700 -mt-1">{item.enaLabel}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                  <p className="font-semibold text-gray-700">Repàs:</p>
                  <p><strong>Enarmonia:</strong> dues notes que sonen igual però s'escriuen diferent. Mateix so, diferent nom i alteració.</p>
                  <p><strong>Parelles principals:</strong> Fa#=Solb · Do#=Reb · Sol#=Lab · Re#=Mib · La#=Sib.</p>
                  <p><strong>Enarmònics naturals:</strong> Mi=Fab (E=Fb) · Si=Dob (B=Cb). No necessiten alteració en un dels casos.</p>
                </div>
              </>
            );
          })()}

          {exercise.type === "acordes" && (() => {
            type AcordItem = { solutionNote: VexNote; label: string; color: string };
            const items = (sol.items as AcordItem[]) ?? [];
            return (
              <>
                <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <VexFlowRenderer
                        notes={[item.solutionNote]}
                        timeSignature=""
                        keySignature="C"
                        width={200}
                        height={120}
                        staveY={20}
                      />
                      <p className="text-center text-xs font-semibold" style={{ color: item.color }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                  <p className="font-semibold text-gray-700">Repàs:</p>
                  <p><strong style={{ color: "#1d4ed8" }}>Acord perfecte major:</strong> 3ª major (2T) + 3ª menor (1T+½T) = 5ª justa. Ex: Do–Mi–Sol.</p>
                  <p><strong style={{ color: "#b91c1c" }}>Acord perfecte menor:</strong> 3ª menor (1T+½T) + 3ª major (2T) = 5ª justa. Ex: La–Do–Mi.</p>
                  <p><strong>Clau:</strong> la 5ª sempre és justa (7 semitons). La diferència és la 3ª: major (4 semitons) o menor (3 semitons).</p>
                </div>
              </>
            );
          })()}

          {exercise.type === "semitonos" && (() => {
            type SemItem = { solutionNotes: VexNote[]; typeLabel: string; color: string };
            const items = (sol.items as SemItem[]) ?? [];
            return (
              <>
                <div className="grid grid-cols-3 gap-x-4 gap-y-4">
                  {items.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <VexFlowRenderer
                        notes={item.solutionNotes}
                        timeSignature=""
                        keySignature="C"
                        width={200}
                        height={145}
                        staveY={25}
                      />
                      <p className="text-center text-xs font-semibold -mt-1" style={{ color: item.color }}>{item.typeLabel}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-0.5 border-t border-blue-100 pt-2">
                  <p className="font-semibold text-gray-700">Repàs:</p>
                  <p><strong style={{ color: "#16a34a" }}>Semitò diatònic:</strong> dues notes de nom diferent separades per 1 semitò. Ex: Mi–Fa, Si–Do, Fa#–Sol, Do#–Re. Noms distints.</p>
                  <p><strong style={{ color: "#dc2626" }}>Semitò cromàtic:</strong> dues notes del mateix nom amb diferent alteració. Ex: Do–Do#, Fa–Fa#, Sol–Sol#. Nom idèntic.</p>
                  <p><strong>Regla pràctica:</strong> mira els noms de les notes. Noms distints = diatònic. Nom igual = cromàtic.</p>
                </div>
              </>
            );
          })()}
        </SolutionBox>
      )}
    </div>
  );
}

function CfgCheckboxes({ options, value, onChange }: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
          <input type="checkbox" checked={value.includes(opt.value)} onChange={() => toggle(opt.value)} className="rounded" />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function CfgRadios({ name, options, value, onChange }: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1 cursor-pointer">
          <input type="radio" name={name} checked={value === opt.value} onChange={() => onChange(opt.value)} />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function CfgSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-gray-200 pt-3 first:border-t-0 first:pt-0">
      <p className="font-semibold text-gray-600 text-xs uppercase tracking-wide mb-2">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function resolveTransportCount(s: string): number {
  if (s.includes("-")) {
    const parts = s.split("-").map(Number);
    const lo = parts[0] ?? 2;
    const hi = parts[1] ?? 5;
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }
  return Math.max(1, parseInt(s) || 3);
}

export default function ExamPage() {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Ex. 1 — Síncopa
  const [syncMeters, setSyncMeters] = useState<string[]>([]);

  // Ex. 2 — Transport
  const [transportCount, setTransportCount] = useState("2-5");
  const [transportKeys, setTransportKeys] = useState<string[]>([]);
  const [transportIntervals, setTransportIntervals] = useState<string[]>([]);

  // Ex. 4 — Intervals
  const [intQualities, setIntQualities] = useState<string[]>([]);

  // Ex. 6 — Escales
  const [scaleModes, setScaleModes] = useState<string[]>([]);
  const [scaleTypes, setScaleTypes] = useState<string[]>([]);

  // Ex. 7 — Armadura
  const [ksModes, setKsModes] = useState<string[]>([]);
  const [ksAccTypes, setKsAccTypes] = useState<string[]>([]);

  // Ex. 9 — Enarmonies
  const [enaAccTypes, setEnaAccTypes] = useState<string[]>([]);

  // Ex. 10 — Acords
  const [acordesModes, setAcordesModes] = useState<string[]>([]);

  // Ex. 11 — Semitons
  const [semitonosTypes, setSemitonosTypes] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const config: ExamConfig = {
      exerciseCounts: {},
      title: "Examen Llenguatge Musical EA4",
      date: new Date().toLocaleDateString("ca-ES"),
      studentName: "",
      syncopaConfig: { meters: syncMeters },
      transportConfig: { count: resolveTransportCount(transportCount), keys: transportKeys, intervals: transportIntervals },
      intervalsConfig: { qualities: intQualities },
      scalesConfig: { modes: scaleModes, scaleTypes },
      keySigConfig: { modes: ksModes, accidentalTypes: ksAccTypes },
      enarmoniaConfig: { accidentalTypes: enaAccTypes },
      acordesConfig: { modes: acordesModes },
      semitonosConfig: { types: semitonosTypes },
    };
    setExamData(generateExam(config));
    setShowSolution(false);
  }, [syncMeters, transportCount, transportKeys, transportIntervals, intQualities, scaleModes, scaleTypes, ksModes, ksAccTypes, enaAccTypes, acordesModes, semitonosTypes]);

  const handlePrintExam = useCallback(() => {
    document.body.classList.remove("print-solution-only");
    setShowSolution(false);
    setTimeout(() => { window.print(); }, 150);
  }, []);

  const handlePrintSolution = useCallback(() => {
    document.body.classList.add("print-solution-only");
    setShowSolution(true);
    // Wait for React to re-render before printing
    setTimeout(() => {
      window.print();
      // Remove class after print dialog closes
      const cleanup = () => {
        document.body.classList.remove("print-solution-only");
        window.removeEventListener("afterprint", cleanup);
      };
      window.addEventListener("afterprint", cleanup);
    }, 150);
  }, []);

  return (
    <PageShell title="Examen Aleatori">
      <div className="space-y-4 w-full">
        <Card title="Configuració" className="no-print">
          <div className="flex justify-end">
            <Button onClick={handleGenerate} variant="primary" size="lg">
              Generar examen
            </Button>
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(s => !s)}
              className="text-xs text-blue-600 hover:underline focus:outline-none"
            >
              {showAdvanced ? "▲ Amagar configuració avançada" : "▼ Configuració avançada"}
            </button>
          </div>

          {showAdvanced && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm space-y-4">

              <CfgSection label="Ex. 1 — Síncopa i Contratemps">
                <p className="text-xs text-gray-500">Compàs (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[{ value: "2/4", label: "2/4" }, { value: "3/4", label: "3/4" }, { value: "4/4", label: "4/4" }]}
                  value={syncMeters}
                  onChange={setSyncMeters}
                />
              </CfgSection>

              <CfgSection label="Ex. 2 — Transport">
                <p className="text-xs text-gray-500">Nombre de transposicions</p>
                <CfgRadios
                  name="transport-count"
                  options={[
                    { value: "2-3", label: "Aleatori 2–3" },
                    { value: "2-4", label: "Aleatori 2–4" },
                    { value: "2-5", label: "Aleatori 2–5" },
                    { value: "2-8", label: "Aleatori 2–8" },
                    { value: "2",   label: "Exacte: 2" },
                    { value: "3",   label: "Exacte: 3" },
                    { value: "4",   label: "Exacte: 4" },
                    { value: "5",   label: "Exacte: 5" },
                    { value: "6",   label: "Exacte: 6" },
                    { value: "7",   label: "Exacte: 7" },
                    { value: "8",   label: "Exacte: 8" },
                  ]}
                  value={transportCount}
                  onChange={setTransportCount}
                />
                <p className="text-xs text-gray-500 mt-1">Tonalitat d'origen (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[{ value: "C", label: "Do" }, { value: "G", label: "Sol" }, { value: "F", label: "Fa" }, { value: "Bb", label: "Si♭" }]}
                  value={transportKeys}
                  onChange={setTransportKeys}
                />
                <p className="text-xs text-gray-500 mt-1">Intervals (buit = aleatori)</p>
                <CfgCheckboxes
                  options={[
                    { value: "2ª major superior",  label: "2ª major superior"  },
                    { value: "2ª major inferior",  label: "2ª major inferior"  },
                    { value: "2ª menor superior",  label: "2ª menor superior"  },
                    { value: "2ª menor inferior",  label: "2ª menor inferior"  },
                    { value: "3ª major superior",  label: "3ª major superior"  },
                    { value: "3ª major inferior",  label: "3ª major inferior"  },
                    { value: "3ª menor superior",  label: "3ª menor superior"  },
                    { value: "3ª menor inferior",  label: "3ª menor inferior"  },
                  ]}
                  value={transportIntervals}
                  onChange={setTransportIntervals}
                />
              </CfgSection>

              <CfgSection label="Ex. 4 — Intervals">
                <p className="text-xs text-gray-500">Qualitat (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[
                    { value: "justa", label: "Justa" },
                    { value: "mayor", label: "Major" },
                    { value: "menor", label: "Menor" },
                    { value: "aumentada", label: "Augmentada" },
                    { value: "disminuida", label: "Disminuïda" },
                  ]}
                  value={intQualities}
                  onChange={setIntQualities}
                />
              </CfgSection>

              <CfgSection label="Ex. 6 — Escales">
                <p className="text-xs text-gray-500">Mode (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[{ value: "major", label: "Major" }, { value: "minor", label: "Menor" }]}
                  value={scaleModes}
                  onChange={setScaleModes}
                />
                <p className="text-xs text-gray-500 mt-1">Tipus (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[
                    { value: "major", label: "Natural major" },
                    { value: "natural_minor", label: "Menor natural" },
                    { value: "harmonic_minor", label: "Menor harmònica" },
                  ]}
                  value={scaleTypes}
                  onChange={setScaleTypes}
                />
              </CfgSection>

              <CfgSection label="Ex. 7 — Armadura">
                <p className="text-xs text-gray-500">Mode (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[{ value: "major", label: "Major" }, { value: "minor", label: "Menor" }]}
                  value={ksModes}
                  onChange={setKsModes}
                />
                <p className="text-xs text-gray-500 mt-1">Alteracions (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[
                    { value: "sharp", label: "Sostinguts (#)" },
                    { value: "flat", label: "Bemols (♭)" },
                    { value: "none", label: "Sense alteracions" },
                  ]}
                  value={ksAccTypes}
                  onChange={setKsAccTypes}
                />
              </CfgSection>

              <CfgSection label="Ex. 9 — Enarmonies">
                <p className="text-xs text-gray-500">Tipus (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[
                    { value: "sharp",   label: "# → ♭ (ex: Fa# → Solb)" },
                    { value: "flat",    label: "♭ → # (ex: Solb → Fa#)" },
                    { value: "natural", label: "Naturals (Mi/Fab, Si/Dob)" },
                  ]}
                  value={enaAccTypes}
                  onChange={setEnaAccTypes}
                />
              </CfgSection>

              <CfgSection label="Ex. 10 — Acords perfectes">
                <p className="text-xs text-gray-500">Mode (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[{ value: "major", label: "Major" }, { value: "minor", label: "Menor" }]}
                  value={acordesModes}
                  onChange={setAcordesModes}
                />
              </CfgSection>

              <CfgSection label="Ex. 11 — Semitons">
                <p className="text-xs text-gray-500">Tipus (buit = qualsevol)</p>
                <CfgCheckboxes
                  options={[
                    { value: "diatonic",  label: "Diatònic (ex: Mi–Fa)" },
                    { value: "chromatic", label: "Cromàtic (ex: Do–Do#)" },
                  ]}
                  value={semitonosTypes}
                  onChange={setSemitonosTypes}
                />
              </CfgSection>

            </div>
          )}
        </Card>

        {examData && (
          <>
            <div className="flex gap-3 no-print flex-wrap">
              <Button onClick={handlePrintExam} variant="secondary">
                Imprimir examen
              </Button>
              <Button onClick={handlePrintSolution} variant="primary">
                Imprimir solució
              </Button>
              <Button
                onClick={() => setShowSolution((s) => !s)}
                variant={showSolution ? "danger" : "ghost"}
              >
                {showSolution ? "Amagar solucions" : "Mostrar solucions"}
              </Button>
              <Button onClick={handleGenerate} variant="ghost">
                Nou examen
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-x-auto w-full">
              <ExamHeader config={examData.config} />
              {examData.exercises.map((ex) => (
                <ExerciseBlock key={ex.number} exercise={ex} showSolution={showSolution} />
              ))}
            </div>
          </>
        )}

        {!examData && (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-3">📄</p>
              <p>Prem "Generar examen" per crear un examen amb els 8 blocs aleatoris.</p>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
