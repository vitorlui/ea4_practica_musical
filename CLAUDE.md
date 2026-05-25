# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is a content repository for generating music theory exams for 4th-year *Lenguaje Musical* (Music Language) students. It is based on the textbook *Pentagrama 3. Llenguatge Musical* by C. Amat and A. Casanova.

There is no build system, package manager, or runnable code. Work here consists of creating, editing, or generating content — Markdown documents and exam exercises.

## Content Structure

- `contexto_teoria.md` — Complete music theory reference document in Spanish. Covers all exam topics with explanations, examples, and solved exercises. This is the primary source of truth for generating exam content.
- `Prova/` — Folder containing JPEG images of a sample exam (`pagina_1.jpeg`, `pagina_2.jpeg`, `pagina_3.jpeg`). Use these as formatting and difficulty references when generating new exams.

## Exam Topics (from `contexto_teoria.md`)

Three thematic blocks:

1. **Tonality, scales, key signatures, intervals** — major/minor scales, harmonic minor, key signatures (sharps/flats), relative keys, interval number and quality.
2. **Time signatures, rhythm, equivalences, syncopation, off-beat** — simple/compound time, corresponding time signatures, note value equivalences, triplets, syncopation vs. off-beat.
3. **Chords, non-chord tones, semitones, enharmony, ornaments** — perfect major/minor triads, passing notes, neighbor notes, appoggiatura, mordent, turn, trill, arpeggio, diatonic/chromatic semitones, enharmonic equivalents, cadences.

## Working with This Repository

When generating new exams or exercises:
- Use `contexto_teoria.md` as the theory reference to ensure correctness.
- Use the images in `Prova/` as layout and difficulty references.
- Write content in Spanish, matching the register and terminology of the source document.
- Exercises should include both the question and the worked solution, following the format used in sections 52–55 of `contexto_teoria.md`.
