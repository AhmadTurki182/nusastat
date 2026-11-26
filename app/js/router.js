// NusaStat — perute hash. Rute:
//   #/                 Beranda
//   #/penduduk         Halaman seksi (dan seterusnya untuk tiap seksi)
//   #/cari/<kata>      Hasil pencarian indikator

import { renderDashboard, renderSection, drawViewCharts } from './views.js';
import { SECTIONS } from './data.js';

const SECTION_IDS = new Set(SECTIONS.map((s) => s.id).filter((id) => id !== 'beranda'));

export function parseRoute(hash) {
  const clean = (hash || '#/').replace(/^#/, '');
  const parts = clean.split('/').filter(Boolean);
  if (parts.length === 0) return { view: 'beranda' };
  if (parts[0] === 'cari' && parts[1]) {
    return { view: 'cari', query: decodeURIComponent(parts[1]) };
  }
  if (SECTION_IDS.has(parts[0])) return { view: parts[0] };
  return { view: 'beranda' };
}

export function renderRoute(state) {
  const route = parseRoute(window.location.hash);
  const app = document.getElementById('app');
  let html;
  if (route.view === 'beranda') html = renderDashboard(state);
  else if (route.view === 'cari') html = renderSearchResults(state, route.query);
  else html = renderSection(state, route.view);
  app.innerHTML = html;
  drawViewCharts(state, route.view);
  const titles = { beranda: 'NusaStat — Statistik Nusantara' };
  document.title = titles[route.view] || `${route.view === 'cari' ? 'Pencarian' : (SECTIONS.find((s) => s.id === route.view)?.title || '')} | NusaStat`;
  document.querySelectorAll('.nav-link').forEach((a) => {
    const target = a.getAttribute('href') || '';
    a.classList.toggle('active', target === '#/' + (route.view === 'beranda' ? '' : route.view));
  });
  window.scrollTo(0, 0);
  return route;
}

function renderSearchResults(state, query) {
  const q = query.toLowerCase();
  const hits = state.index.filter((item) =>
    (item.name + ' ' + item.sectionTitle + ' ' + item.keywords).toLowerCase().includes(q));
  const cards = hits.length === 0
    ? '<p class="empty">Tidak ada indikator yang cocok dengan “' + escapeHtml(query) + '”. Coba kata lain, misalnya “penduduk”, “inflasi”, atau “kemiskinan”.</p>'
    : hits.map((item) => `<a class="index-item" href="#/${item.section}">
        <span class="index-name">${escapeHtml(item.name)}</span>
        <span class="index-value">${escapeHtml(item.valueText)}</span>
        <span class="index-year">${escapeHtml(item.sectionTitle)}</span>
      </a>`).join('');
  return `<div class="page-head"><h2>Hasil pencarian: “${escapeHtml(query)}”</h2>
    <p>${hits.length} indikator ditemukan.</p></div>
    <div class="index-list">${cards}</div>`;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
