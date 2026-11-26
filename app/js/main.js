// NusaStat — titik masuk: state global, pemilih tahun & provinsi,
// pencarian indikator, dan pengikatan awal.

import { YEARS, DEFAULT_YEAR, PROVINCES, INDICATORS, SECTIONS, latestYear, valueAt, formatIndicatorValue } from './data.js';
import { renderRoute } from './router.js';

const state = {
  year: DEFAULT_YEAR,
  province: 'nasional',
  index: buildIndex(),
};

function buildIndex() {
  return INDICATORS.map((ind) => {
    const ly = latestYear(ind);
    const section = SECTIONS.find((s) => s.id === ind.section);
    return {
      id: ind.id,
      name: ind.name,
      section: ind.section,
      sectionTitle: section ? section.title : '',
      keywords: ind.unit + ' ' + ind.source,
      valueText: ly === null ? '—' : formatIndicatorValue(ind, valueAt(ind, ly)) + ' (' + ly + ')',
    };
  });
}

function buildYearSelect(select) {
  select.innerHTML = YEARS.map((y) => `<option value="${y}"${y === state.year ? ' selected' : ''}>${y}</option>`).join('');
}

function buildProvinceSelect(select) {
  const options = [{ id: 'nasional', name: 'Nasional (seluruh Indonesia)' }]
    .concat(PROVINCES.map((p) => ({ id: p.id, name: p.name })));
  select.innerHTML = options.map((o) => `<option value="${o.id}"${o.id === state.province ? ' selected' : ''}>${o.name}</option>`).join('');
}

function buildNav(nav) {
  nav.innerHTML = SECTIONS.map((s) =>
    `<a class="nav-link" href="${s.path}">${s.title}</a>`).join('');
}

function bindSearch(input, box) {
  const closeBox = () => { box.hidden = true; box.innerHTML = ''; };
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { closeBox(); return; }
    const hits = state.index.filter((item) =>
      (item.name + ' ' + item.sectionTitle + ' ' + item.keywords).toLowerCase().includes(q)).slice(0, 8);
    if (hits.length === 0) {
      box.innerHTML = '<div class="search-empty">Tidak ada indikator yang cocok.</div>';
    } else {
      box.innerHTML = hits.map((item) => `<a class="search-hit" href="#/${item.section}">
        <span class="search-name">${item.name}</span>
        <span class="search-meta">${item.sectionTitle} · ${item.valueText}</span>
      </a>`).join('');
    }
    box.hidden = false;
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value.trim().length >= 2) {
      closeBox();
      window.location.hash = '#/cari/' + encodeURIComponent(input.value.trim());
    }
    if (event.key === 'Escape') closeBox();
  });
  box.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeBox();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-wrap')) closeBox();
  });
}

function init() {
  buildYearSelect(document.getElementById('year-select'));
  buildProvinceSelect(document.getElementById('province-select'));
  buildNav(document.getElementById('main-nav'));

  document.getElementById('year-select').addEventListener('change', (event) => {
    state.year = Number(event.target.value);
    renderRoute(state);
  });
  document.getElementById('province-select').addEventListener('change', (event) => {
    state.province = event.target.value;
    renderRoute(state);
  });
  bindSearch(
    document.getElementById('search-input'),
    document.getElementById('search-results'),
  );

  window.addEventListener('hashchange', () => renderRoute(state));
  // Tekan "/" di mana saja untuk langsung ke kotak pencarian.
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'SELECT') {
      event.preventDefault();
      document.getElementById('search-input').focus();
    }
  });
  renderRoute(state);
}

init();
