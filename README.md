# NusaStat — Statistik Nusantara

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/AhmadTurki182/nusastat/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/AhmadTurki182/nusastat/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**NusaStat — Statistik Nusantara** — portal statistik Indonesia berbahasa Indonesia: dashboard plus 7 seksi (Penduduk, Ekonomi, Harga & Inflasi, Ketenagakerjaan, Kemiskinan, Pendidikan, Kesehatan). Semua angka resmi BPS/SSGI dengan tahun dan sumber di setiap angka; angka yang belum dirilis ditandai "—", bukan perkiraan. Grafik garis, batang, dan donat digambar tangan di canvas; pemilih tahun 2020–2026 dan pemilih provinsi me-render ulang KPI, grafik, dan tabel; pencarian indikator benar-benar memfilter dan membuka halaman hasil. Tanpa satu pun permintaan jaringan — semua data tertanam sebagai file di dalam app/.

Competition: [Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539) — total hadiah $50, 10 besar berbagi. AI judge membandingkan situs dua-dua lewat screenshot dan outline source; makin sering dipilih, makin tinggi peringkat.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — no build step, no network, plain static files.

## Screenshots

1. `1-overview.jpg` — dashboard (6 KPI, grafik penduduk) tahun 2024.
2. `2-charts.jpg` — halaman Ekonomi, grafik batang pertumbuhan PDB 2020–2024.
3. `3-tables.jpg` — tabel 10 provinsi terbesar + tabel penduduk.
4. `4-phone.jpg` — tampilan ponsel (layout menumpuk, tanpa overflow horizontal).

## How it works

- **Tahun:** pemilih 2020–2026 me-render ulang KPI, grafik, dan tabel, dengan penanda di titik tahun terpilih.
- **Provinsi:** pemilih provinsi menampilkan kartu rincian provinsi dan menandai barisnya di tabel.
- **Pencarian:** ketik indikator (mis. "inflasi") — hasil dropdown dan halaman hasil memfilter indikator yang cocok; tombol "/" memfokuskan pencarian.
- **Seksi:** Beranda, Penduduk, Ekonomi, Harga & Inflasi, Ketenagakerjaan, Kemiskinan, Pendidikan, Kesehatan — masing-masing dengan KPI, grafik, tabel, dan catatan sumber.
