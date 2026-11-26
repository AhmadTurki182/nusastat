// NusaStat — program penyerahan (Node 22, hanya pustaka standar).
// Situsnya adalah folder app/ di samping berkas ini: berkas statis yang dibuka
// browser dari app/index.html, tanpa langkah build dan tanpa permintaan jaringan.
// Program ini menyalin app/ dan screenshots/ ke /output lalu menulis
// /output/dossier.json dengan pustaka make.fun yang sudah dibundel di vendor/.
// vendor/makefun-frontend.ts harus tetap sama seperti di kit: penilai membandingkan
// dossier.json dengan hasil yang ditulis ulang oleh salinannya sendiri.
//
// Di luar wadah penilai, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Folder tempat main.ts ini berada — app/ dan screenshots/ ada di sampingnya.
const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Gagal cepat dengan pesan yang jelas bila situsnya tidak ada.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html tidak ditemukan di samping main.ts — jalankan dari root repositori entri.');
}

// Siapkan /output, salin situs dan tangkapan layarnya, lalu tulis dossier.
mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Batas yang dipakai penilai (lihat RULES.txt): dossier paling besar 160 KiB teks,
// paling banyak 4 tangkapan layar @ 256 KiB, app/ paling banyak 993 berkas/direktori
// dan 16 MiB. buildDossier menolak entri yang melampaui batas itu.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
