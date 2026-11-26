// DompetKita — program penyerah untuk entri best-household-budget-site.
// Node 22, pustaka standar saja. Program ini menyalin app/ dan screenshots/ dari
// repositori ke /output (atau MAKEFUN_OUTPUT_DIR di luar grader) lalu menulis
// /output/dossier.json dengan buildDossier dari vendor/makefun-frontend.ts.
// vendor/makefun-frontend.ts dibiarkan apa adanya, persis seperti salinan kit.
//
// Menjalankan di luar grader:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Batas yang sama dengan yang dipakai penilai: paling banyak 4 tangkapan layar
// (masing-masing ≤ 256 KiB), app/ paling banyak 993 berkas/direktori dan 16 MiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`DompetKita handed in: app/ + screenshots/ copied to ${out}, dossier.json written.`);
