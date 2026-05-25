import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR  = join(__dirname, '..', '..', 'examens');
const BASE_URL = 'http://localhost:5173/ea4_practica_musical/#/examen';
const sleep    = ms => new Promise(r => setTimeout(r, ms));

async function tryConnect() {
  try {
    const r = await fetch('http://localhost:5173/ea4_practica_musical/');
    return r.status < 500;
  } catch { return false; }
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    if (await tryConnect()) return;
    await sleep(500);
  }
  throw new Error('Server not ready after 30s');
}

async function clickByText(page, text) {
  const found = await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')]
      .find(b => b.textContent?.trim().includes(t));
    if (btn) { btn.click(); return true; }
    return false;
  }, text);
  if (!found) throw new Error(`Button "${text}" not found`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let vite = null;
  if (!(await tryConnect())) {
    console.log('Starting Vite dev server...');
    vite = spawn('npm', ['run', 'dev'], {
      cwd: join(__dirname, '..'),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    vite.stdout.on('data', d => process.stdout.write(d));
    await waitForServer();
    console.log('Server ready.\n');
  } else {
    console.log('Using existing server at localhost:5173\n');
  }

  const browser = await puppeteer.launch({ headless: true });

  try {
    for (let i = 1; i <= 10; i++) {
      const num = String(i).padStart(2, '0');
      console.log(`Generating exam ${num}...`);

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900 });

      // Load exam page fresh
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      await sleep(500);

      // Generate exam
      await clickByText(page, 'Generar examen');

      // Wait for all VexFlow SVGs to render
      await page.waitForSelector('svg', { timeout: 10000 });
      await sleep(2500);

      // ── Questions PDF (CSS hides .solution-box in print) ──────────────
      await page.emulateMediaType('print');
      await page.pdf({
        path: join(OUT_DIR, `examen_${num}.pdf`),
        format: 'A4',
        printBackground: false,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
      });

      // ── Solution PDF ───────────────────────────────────────────────────
      await page.emulateMediaType('screen');
      await clickByText(page, 'Mostrar solucions');
      await sleep(1500); // wait for solution SVGs to render

      await page.evaluate(() => document.body.classList.add('print-solution-only'));
      await page.emulateMediaType('print');
      await page.pdf({
        path: join(OUT_DIR, `examen_${num}_solucio.pdf`),
        format: 'A4',
        printBackground: false,
        margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
      });

      await page.close();
      console.log(`  ✓ examen_${num}.pdf  +  examen_${num}_solucio.pdf`);
    }
  } finally {
    await browser.close();
    if (vite) { vite.kill(); }
  }

  console.log(`\nDone! 20 PDFs saved to examens/`);
}

main().catch(e => { console.error(e); process.exit(1); });
