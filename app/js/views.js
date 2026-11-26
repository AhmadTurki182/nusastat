// NusaStat — tampilan (views). Setiap halaman dirender dari data.js;
// tidak ada angka yang ditulis langsung di markup, semua lewat indikator.

import {
  YEARS, INDICATORS, PROVINCES, ISLAND_SHARE, SECTIONS,
  valueAt, latestYear, indicatorById, indicatorsOf,
  formatNumber, formatIndicatorValue, provinceById, provinceDensity, provinceShare,
} from './data.js';
import { lineChart, barChart, donutChart } from './charts.js';

const PALETTE = ['#0e7c7b', '#0a2e4d', '#c9a227', '#b3402e', '#5b7fa6', '#7a9e3f'];

export function esc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function kpiCard(indicator, year) {
  const value = valueAt(indicator, year);
  const latest = latestYear(indicator);
  const shown = value === null ? (latest !== null ? valueAt(indicator, latest) : null) : value;
  const shownYear = value === null ? latest : year;
  const stale = value === null;
  return `<a class="kpi" href="#/${indicator.section}" data-indicator="${indicator.id}">
    <span class="kpi-label">${esc(indicator.name)}</span>
    <span class="kpi-value">${shown === null ? '—' : formatIndicatorValue(indicator, shown)}</span>
    <span class="kpi-unit">${esc(indicator.unit)} · ${shownYear === null ? 'belum ada data' : shownYear}${stale ? ' (terbaru)' : ''}</span>
  </a>`;
}

function sourceLine(indicator) {
  return `<p class="source">Sumber: ${esc(indicator.source)}. ${esc(indicator.note)}</p>`;
}

function changeCell(indicator, year) {
  const v = valueAt(indicator, year);
  const prev = valueAt(indicator, year - 1);
  if (v === null || prev === null || prev === 0) return '<td>—</td>';
  const diff = v - prev;
  const sign = diff > 0 ? '+' : '';
  const cls = indicator.id === 'pertumbuhan-ekonomi' || indicator.id === 'pdb-nominal' || indicator.id === 'pdb-per-kapita'
    ? (diff >= 0 ? 'up' : 'down')
    : '';
  return `<td class="${cls}">${sign}${formatNumber(diff, indicator.decimals)}</td>`;
}

function indicatorTable(indicator, highlightYear) {
  const rows = YEARS.map((y) => {
    const v = valueAt(indicator, y);
    return `<tr${y === highlightYear ? ' class="hl"' : ''}>
      <td>${y}</td>
      <td>${v === null ? '—' : formatIndicatorValue(indicator, v)}</td>
      ${changeCell(indicator, y)}
    </tr>`;
  }).join('');
  return `<table class="data-table">
    <thead><tr><th>Tahun</th><th>${esc(indicator.name)} (${esc(indicator.unit)})</th><th>Perubahan</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="table-note">Tanda “—” berarti angka tahun itu belum dirilis BPS saat situs ini dibuat.</p>`;
}

function chartBlock(id, title, subtitle, height) {
  return `<section class="chart-card">
    <h3>${esc(title)}</h3>
    <p class="chart-sub">${esc(subtitle)}</p>
    <div class="chart-wrap"><canvas id="${id}" data-height="${height || 260}"></canvas></div>
    <div class="chart-legend"></div>
  </section>`;
}

function sectionHead(section, year) {
  return `<div class="page-head">
    <h2>${esc(section.title)}</h2>
    <p>${esc(section.blurb)} Tahun data yang dipilih: <strong>${year}</strong> — ubah lewat pemilih tahun di atas.</p>
  </div>`;
}

// ---------------- Beranda ----------------

export function renderDashboard(state) {
  const pop = indicatorById('penduduk');
  const growth = indicatorById('pertumbuhan-ekonomi');
  const infl = indicatorById('inflasi');
  const tpt = indicatorById('pengangguran');
  const poor = indicatorById('kemiskinan');
  const ipm = indicatorById('ipm');
  const cards = [pop, growth, infl, tpt, poor, ipm].map((ind) => kpiCard(ind, state.year)).join('');
  const indexRows = INDICATORS.map((ind) => {
    const ly = latestYear(ind);
    return `<a class="index-item" href="#/${ind.section}" data-indicator="${ind.id}">
      <span class="index-name">${esc(ind.name)}</span>
      <span class="index-value">${ly === null ? '—' : formatIndicatorValue(ind, valueAt(ind, ly))}</span>
      <span class="index-year">${ly === null ? '' : ly}</span>
    </a>`;
  }).join('');
  return `<div class="hero">
    <h2>Statistik Indonesia, satu tempat.</h2>
    <p>Angka-angka resmi tentang penduduk, ekonomi, harga, pekerjaan, kemiskinan,
    pendidikan, dan kesehatan — dengan tahun dan sumber yang jelas di setiap angka.</p>
  </div>
  <section class="kpi-grid">${cards}</section>
  ${chartBlock('ch-pop', 'Jumlah penduduk Indonesia', 'Juta jiwa, 2020–2026 · Sensus Penduduk 2020 & Proyeksi BPS')}
  <div class="two-col">
    ${chartBlock('ch-growth', 'Pertumbuhan ekonomi', 'PDB y-on-y, 2020–2024 · BPS')}
    ${chartBlock('ch-prov', 'Provinsi berpenduduk terbesar', 'Juta jiwa, pertengahan 2024 · Proyeksi BPS')}
  </div>
  <section class="index-block">
    <h3>Semua indikator</h3>
    <p class="chart-sub">Klik sebuah indikator untuk membuka halamannya. Cari lewat kotak pencarian di atas.</p>
    <div class="index-list">${indexRows}</div>
  </section>
  <section class="about">
    <h3>Tentang NusaStat</h3>
    <p>NusaStat adalah portal statistik Indonesia yang disusun dari publikasi Badan Pusat
    Statistik (BPS) dan Survei Status Gizi Indonesia (SSGI) Kementerian Kesehatan. Setiap
    angka mencantumkan tahun dan sumbernya; angka yang belum dirilis ditandai “—”, bukan
    diisi perkiraan. Gunakan pemilih tahun untuk melihat angka tahun lain dan pemilih
    provinsi untuk melihat rincian penduduk per provinsi.</p>
  </section>`;
}

// ---------------- Halaman seksi ----------------

function sectionPage(state, sectionId, intro, chartHtml, extraHtml) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  const inds = indicatorsOf(sectionId);
  const cards = inds.map((ind) => kpiCard(ind, state.year)).join('');
  const tables = inds.map((ind) => `<div class="table-block"><h3>${esc(ind.name)}</h3>${indicatorTable(ind, state.year)}${sourceLine(ind)}</div>`).join('');
  return `${sectionHead(section, state.year)}
  <p class="intro">${intro}</p>
  <section class="kpi-grid">${cards}</section>
  ${chartHtml}
  ${extraHtml || ''}
  <section class="tables">${tables}</section>`;
}

export function renderSection(state, sectionId) {
  switch (sectionId) {
    case 'penduduk': {
      const prov = state.province === 'nasional' ? null : provinceById(state.province);
      const detail = prov ? `<section class="province-card">
        <h3>${esc(prov.name)}</h3>
        <dl>
          <div><dt>Penduduk 2024</dt><dd>${formatNumber(prov.population2024, 2)} juta jiwa</dd></div>
          <div><dt>Pangsa nasional</dt><dd>${formatNumber(provinceShare(prov), 2)}%</dd></div>
          <div><dt>Luas wilayah</dt><dd>${formatNumber(prov.areaKm2, 0)} km²</dd></div>
          <div><dt>Kepadatan</dt><dd>${formatNumber(provinceDensity(prov), 0)} jiwa/km²</dd></div>
          <div><dt>Peringkat</dt><dd>#${PROVINCES.findIndex((p) => p.id === prov.id) + 1} dari 10 provinsi terbesar</dd></div>
        </dl>
        <p class="source">Sumber: BPS, Proyeksi Penduduk 2024; luas wilayah BPS. Kepadatan dihitung dari angka di atas.</p>
      </section>` : '';
      const rows = PROVINCES.map((p) => `<tr${prov && p.id === prov.id ? ' class="hl"' : ''}>
        <td>${esc(p.name)}</td><td>${formatNumber(p.population2024, 2)}</td>
        <td>${formatNumber(provinceShare(p), 2)}%</td><td>${formatNumber(provinceDensity(p), 0)}</td></tr>`).join('');
      const extra = `${detail}
      <section class="table-block"><h3>Sepuluh provinsi berpenduduk terbesar, 2024</h3>
      <table class="data-table"><thead><tr><th>Provinsi</th><th>Penduduk (juta)</th><th>Pangsa</th><th>Kepadatan (jiwa/km²)</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <p class="source">Sumber: BPS, Proyeksi Penduduk pertengahan 2024.</p></section>`;
      return sectionPage(state, 'penduduk',
        'Indonesia berpenduduk 281,6 juta jiwa pada 2024 dan terus bertambah sekitar 2,5–3 juta jiwa per tahun. Lebih dari separuh penduduk tinggal di Pulau Jawa.',
        `${chartBlock('ch-pop-line', 'Jumlah penduduk, 2020–2026', 'Juta jiwa · Sensus Penduduk 2020 & Proyeksi BPS')}
        <div class="two-col">
        ${chartBlock('ch-island', 'Penduduk menurut pulau', 'Pangsa, Sensus Penduduk 2020 · BPS')}
        ${chartBlock('ch-prov-bar', 'Sepuluh provinsi terbesar', 'Juta jiwa, 2024 · Proyeksi BPS')}
        </div>`,
        extra);
    }
    case 'ekonomi':
      return sectionPage(state, 'ekonomi',
        'Ekonomi Indonesia tumbuh 5,03% pada 2024 setelah pulih dari kontraksi -2,07% pada 2020. PDB harga berlaku mencapai Rp22.139 triliun pada 2024.',
        `${chartBlock('ch-growth-bar', 'Pertumbuhan ekonomi', 'PDB y-on-y, 2020–2024 · BPS')}
        <div class="two-col">
        ${chartBlock('ch-gdp-line', 'PDB harga berlaku', 'Rp triliun, 2020–2024 · BPS')}
        ${chartBlock('ch-gdppc-line', 'PDB per kapita', 'Rp juta, 2020–2024 · BPS')}
        </div>`,
        '');
    case 'harga':
      return sectionPage(state, 'harga',
        'Inflasi Indonesia pada Desember 2024 tercatat 1,57% (y-on-y), terendah dalam lima tahun terakhir setelah sempat 5,51% pada Desember 2022.',
        chartBlock('ch-infl-line', 'Inflasi Desember (y-on-y)', 'Persentase, 2020–2024 · BPS, IHK'),
        '');
    case 'tenaga-kerja':
      return sectionPage(state, 'tenaga-kerja',
        'Tingkat Pengangguran Terbuka terus menurun sejak pandemi: dari 7,07% pada Agustus 2020 menjadi 4,91% pada Agustus 2024.',
        chartBlock('ch-tpt-line', 'Tingkat Pengangguran Terbuka', 'Persentase angkatan kerja, Agustus tiap tahun · Sakernas BPS'),
        '');
    case 'kemiskinan':
      return sectionPage(state, 'kemiskinan',
        'Tingkat kemiskinan Maret 2025 tercatat 8,47%, melanjutkan penurunan dari 10,19% pada September 2020. Rasio Gini stabil di 0,379 sejak 2022.',
        `${chartBlock('ch-poor-line', 'Tingkat kemiskinan', 'Persentase penduduk, Maret & September · BPS')}
        ${chartBlock('ch-gini-line', 'Rasio Gini', 'Maret tiap tahun · BPS')}`,
        '');
    case 'pendidikan':
      return sectionPage(state, 'pendidikan',
        'Indeks Pembangunan Manusia Indonesia mencapai 75,02 pada 2024 — kategori “tinggi”. Rata-rata lama sekolah 9,04 tahun dan harapan lama sekolah 14,11 tahun.',
        `${chartBlock('ch-ipm-line', 'Indeks Pembangunan Manusia', 'Indeks, 2020–2024 · BPS')}
        ${chartBlock('ch-rls-bar', 'Rata-rata lama sekolah', 'Tahun, 2020–2024 · BPS')}`,
        '');
    case 'kesehatan':
      return sectionPage(state, 'kesehatan',
        'Angka harapan hidup mencapai 74,46 tahun pada 2024. Prevalensi stunting balita turun ke 19,8% pada 2024 dari 24,4% pada 2021.',
        `${chartBlock('ch-ahh-line', 'Angka harapan hidup', 'Tahun, 2021–2024 · BPS')}
        ${chartBlock('ch-stunt-bar', 'Prevalensi stunting balita', 'Persentase, 2021–2024 · SSGI Kemenkes')}`,
        '');
    default:
      return renderDashboard(state);
  }
}

// ---------------- Menggambar grafik tiap halaman ----------------

function seriesOf(indicator, color) {
  return {
    label: indicator.name,
    color,
    data: YEARS.map((y) => valueAt(indicator, y)),
  };
}

function tickPct(v) { return formatNumber(v, v % 1 === 0 ? 0 : 1) + '%'; }
function tickPlain(v) { return formatNumber(v, v % 1 === 0 ? 0 : 1); }
function tickTriliun(v) { return formatNumber(v, 0); }

export function drawViewCharts(state, viewId) {
  const yearIdx = YEARS.indexOf(state.year);
  const get = (id) => document.getElementById(id);
  const line = (id, indicator, color, tick) => {
    const el = get(id);
    if (!el) return;
    lineChart(el, {
      labels: YEARS,
      series: [seriesOf(indicator, color)],
      formatTick: tick,
      formatValue: (v) => formatIndicatorValue(indicator, v),
      highlightIndex: yearIdx,
    });
  };
  const bar = (id, indicator, color, tick) => {
    const el = get(id);
    if (!el) return;
    barChart(el, {
      labels: YEARS,
      values: YEARS.map((y) => valueAt(indicator, y)),
      color,
      formatTick: tick,
      formatValue: (v) => formatIndicatorValue(indicator, v),
      highlightIndex: yearIdx,
    });
  };

  if (viewId === 'beranda') {
    line('ch-pop', indicatorById('penduduk'), PALETTE[0], tickPlain);
    bar('ch-growth', indicatorById('pertumbuhan-ekonomi'), PALETTE[1], tickPct);
    const provEl = get('ch-prov');
    if (provEl) {
      const top = [...PROVINCES].sort((a, b) => b.population2024 - a.population2024).slice(0, 5);
      barChart(provEl, {
        labels: top.map((p) => p.name.replace('Jawa ', 'J. ').replace('Sumatera', 'Sum.')),
        values: top.map((p) => p.population2024),
        color: PALETTE[0],
        formatTick: tickPlain,
        formatValue: (v) => formatNumber(v, 2) + ' juta',
        highlightIndex: top.findIndex((p) => p.id === state.province),
      });
    }
    return;
  }

  if (viewId === 'penduduk') {
    line('ch-pop-line', indicatorById('penduduk'), PALETTE[0], tickPlain);
    const donutEl = get('ch-island');
    if (donutEl) {
      donutChart(donutEl, {
        segments: ISLAND_SHARE.map((s, i) => ({ ...s, value: s.share, color: PALETTE[i % PALETTE.length] })),
        formatValue: (v) => formatNumber(v, 2) + '%',
      });
    }
    const barEl = get('ch-prov-bar');
    if (barEl) {
      barChart(barEl, {
        labels: PROVINCES.map((p) => p.name.replace('Jawa ', 'J. ').replace('Sumatera', 'Sum.').replace('Sulawesi', 'Sul.')),
        values: PROVINCES.map((p) => p.population2024),
        color: PALETTE[1],
        formatTick: tickPlain,
        formatValue: (v) => formatNumber(v, 2) + ' juta',
        highlightIndex: PROVINCES.findIndex((p) => p.id === state.province),
      });
    }
    return;
  }

  if (viewId === 'ekonomi') {
    bar('ch-growth-bar', indicatorById('pertumbuhan-ekonomi'), PALETTE[1], tickPct);
    line('ch-gdp-line', indicatorById('pdb-nominal'), PALETTE[0], tickTriliun);
    line('ch-gdppc-line', indicatorById('pdb-per-kapita'), PALETTE[2], tickPlain);
    return;
  }
  if (viewId === 'harga') { line('ch-infl-line', indicatorById('inflasi'), PALETTE[3], tickPct); return; }
  if (viewId === 'tenaga-kerja') { line('ch-tpt-line', indicatorById('pengangguran'), PALETTE[1], tickPct); return; }
  if (viewId === 'kemiskinan') {
    const el = get('ch-poor-line');
    if (el) {
      lineChart(el, {
        labels: YEARS,
        series: [
          seriesOf(indicatorById('kemiskinan'), PALETTE[0]),
          seriesOf(indicatorById('kemiskinan-september'), PALETTE[2]),
        ],
        formatTick: tickPct,
        formatValue: (v) => formatNumber(v, 2) + '%',
        highlightIndex: yearIdx,
      });
    }
    line('ch-gini-line', indicatorById('gini'), PALETTE[1], (v) => formatNumber(v, 2));
    return;
  }
  if (viewId === 'pendidikan') {
    line('ch-ipm-line', indicatorById('ipm'), PALETTE[0], tickPlain);
    bar('ch-rls-bar', indicatorById('lama-sekolah'), PALETTE[1], tickPlain);
    return;
  }
  if (viewId === 'kesehatan') {
    line('ch-ahh-line', indicatorById('harapan-hidup'), PALETTE[0], tickPlain);
    bar('ch-stunt-bar', indicatorById('stunting'), PALETTE[3], tickPct);
  }
}
